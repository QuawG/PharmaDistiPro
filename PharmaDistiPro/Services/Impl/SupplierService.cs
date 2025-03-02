using AutoMapper;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IMapper _mapper;

        public SupplierService(ISupplierRepository supplier, IMapper mapper)
        {
            _supplierRepository = supplier;
            _mapper = mapper;
        }

        // Get all suppliers

        public async Task<Response<IEnumerable<SupplierDTO>>> GetSupplierList()
        {
            var response = new Response<IEnumerable<SupplierDTO>>();

            try
            {
                var suppliers = await _supplierRepository.GetAllAsync();

                if (!suppliers.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<IEnumerable<SupplierDTO>>(suppliers);
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response; 
        }



        // Get supplier by Id
        public async Task<Response<SupplierDTO>> GetSupplierById(int supplierId)
        {
            var response = new Response<SupplierDTO>();
            try
            {
                var suppliers = await _supplierRepository.GetByIdAsync(supplierId);
                if (suppliers == null)
                {
                    response.Success = false;
                    response.Data = null;
                    response.Message = "Không tìm thấy nhà phân phối";
                    return response;
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<SupplierDTO>(suppliers);
                    response.Message = "Supplier found";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        //Create new supplier
        public async Task<Response<SupplierDTO>> CreateNewSupplier(SupplierInputRequest supplierInputRequest)
        {
            var response = new Response<SupplierDTO>();
           

            try
            {
                // Kiểm tra xem supplier đã tồn tại chưa 
                var existingSupplier = await _supplierRepository.GetSingleByConditionAsync(x => x.SupplierName.Equals(supplierInputRequest.SupplierName) || x.SupplierCode.Equals(supplierInputRequest.SupplierCode));
                if (existingSupplier != null)
                {
                    response.Success = false;
                    response.Message = "Code và tên đã tồn tại.";
                    return response;
                }

           

                // Map dữ liệu từ DTO sang Entity
                var newSupplier = _mapper.Map<Supplier>(supplierInputRequest);
         
                newSupplier.CreatedDate = DateTime.Now;

                // Thêm mới user vào database
                await _supplierRepository.InsertAsync(newSupplier);
                await _supplierRepository.SaveAsync();

                // Trả về dữ liệu đã tạo mới
                response.Message = "Tạo mới thành công";
                response.Success = true;
                response.Data = _mapper.Map<SupplierDTO>(newSupplier);

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
                return response;
            }
        }

        ///Deactivate/Active supplier
        public async Task<Response<SupplierDTO>> ActivateDeactivateSupplier(int supplierId, bool update)
        {
            var response = new Response<SupplierDTO>();
            try
            {
                //check if supplier exists
                var suppliers = await _supplierRepository.GetByIdAsync(supplierId);
                if (suppliers == null)
                {
                    response.Success = false;
                    response.Data = _mapper.Map<SupplierDTO>(suppliers);
                    response.Message = "Không tìm thấy nhà phân phối";
                    return response;
                }
                else
                {
                    suppliers.Status = update;
                    await _supplierRepository.UpdateAsync(suppliers);
                    await _supplierRepository.SaveAsync();
                    response.Success = true;
                    response.Data = _mapper.Map<SupplierDTO>(suppliers);
                    response.Message = "Cập nhật thành công";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Update  supplier
        public async Task<Response<SupplierDTO>> UpdateSupplier(SupplierInputRequest supplierUpdateRequest)
        {
            var response = new Response<SupplierDTO>();
           

            try
            {
                // Kiểm tra nhà phân phối có tồn tại không
                var suppplierToUpdate = await _supplierRepository.GetByIdAsync(supplierUpdateRequest.Id);
                if (suppplierToUpdate == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy nhà phân phối";
                    return response;
                }

           

                // Map dữ liệu từ DTO sang thực thể
                _mapper.Map(supplierUpdateRequest, suppplierToUpdate);

            

                await _supplierRepository.UpdateAsync(suppplierToUpdate);
                await _supplierRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<SupplierDTO>(suppplierToUpdate);
                response.Message = "Cập nhật nhà phân phối thành công";
            }
            catch (Exception ex)
            {
               
                response.Success = false;
                response.Message = "Đã xảy ra lỗi trong quá trình cập nhật nhà phân phối.";
            }

            return response;
        }

    }
}