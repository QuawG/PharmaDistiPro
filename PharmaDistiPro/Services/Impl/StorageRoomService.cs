using AutoMapper;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{
    public class StorageRoomService : IStorageRoomService
    {
        private readonly IStorageRoomRepository _storageRoomRepository;
        private readonly IMapper _mapper;


        public StorageRoomService(IStorageRoomRepository storageRoom, IMapper mapper)
        {
            _storageRoomRepository = storageRoom;
            _mapper = mapper;
        }

        // Get all storageRooms

        public async Task<Response<IEnumerable<StorageRoomDTO>>> GetStorageRoomList()
        {
            var response = new Response<IEnumerable<StorageRoomDTO>>();

            try
            {
                var storageRooms = await _storageRoomRepository.GetAllAsync();

                if (!storageRooms.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<IEnumerable<StorageRoomDTO>>(storageRooms);
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }



        // Get storageRoom by Id
        public async Task<Response<StorageRoomDTO>> GetStorageRoomById(int storageRoomId)
        {
            var response = new Response<StorageRoomDTO>();
            try
            {
                var storageRooms = await _storageRoomRepository.GetByIdAsync(storageRoomId);
                if (storageRooms == null)
                {
                    response.Success = false;
                    response.Data = null;
                    response.Message = "Không tìm thấy phòng chứa kho ";
                    return response;
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<StorageRoomDTO>(storageRooms);
                    response.Message = "StorageRoom found";
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

        //Create new StorageRoom
        public async Task<Response<StorageRoomDTO>> CreateNewStorageRoom(StorageRoomInputRequest storageRoomInputRequest)
        {
            var response = new Response<StorageRoomDTO>();


            try
            {
                // Kiểm tra xem storage đã tồn tại chưa 
                var existingStorageRoom = await _storageRoomRepository.GetSingleByConditionAsync(x => x.StorageRoomCode.Equals(storageRoomInputRequest.StorageRoomCode) || x.StorageRoomName.Equals(storageRoomInputRequest.StorageRoomName));
                if (existingStorageRoom != null)
                {
                    response.Success = false;
                    response.Message = "Code và tên đã tồn tại.";
                    return response;
                }



                // Map dữ liệu từ DTO sang Entity
                var newStorageRoom = _mapper.Map<StorageRoom>(storageRoomInputRequest);

                newStorageRoom.CreatedDate = DateTime.Now;

                // Thêm mới room vào database
                await _storageRoomRepository.InsertAsync(newStorageRoom);
                await _storageRoomRepository.SaveAsync();

                // Trả về dữ liệu đã tạo mới
                response.Message = "Tạo mới thành công";
                response.Success = true;
                response.Data = _mapper.Map<StorageRoomDTO>(newStorageRoom);

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
                return response;
            }
        }

        ///Deactivate/Active storageRoom
        public async Task<Response<StorageRoomDTO>> ActivateDeactivateStorageRoom(int storageRoomId, bool update)
        {
            var response = new Response<StorageRoomDTO>();
            try
            {
                //check if storageRoom exists
                var storageRooms = await _storageRoomRepository.GetByIdAsync(storageRoomId);
                if (storageRooms == null)
                {
                    response.Success = false;
                    response.Data = _mapper.Map<StorageRoomDTO>(storageRooms);
                    response.Message = "Không tìm thấy phòng chứa kho";
                    return response;
                }
                else
                {
                    storageRooms.Status = update;
                    await _storageRoomRepository.UpdateAsync(storageRooms);
                    await _storageRoomRepository.SaveAsync();
                    response.Success = true;
                    response.Data = _mapper.Map<StorageRoomDTO>(storageRooms);
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

        public async Task<Response<StorageRoomDTO>> UpdateStorageRoom(StorageRoomInputRequest storageRoomUpdateRequest)
        {
            var response = new Response<StorageRoomDTO>();

            try
            {
                // 🔍 Kiểm tra xem nhà kho có tồn tại không
                var storageRoomToUpdate = await _storageRoomRepository.GetByIdAsync(storageRoomUpdateRequest.StorageRoomId);
                if (storageRoomToUpdate == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy nhà kho";
                    return response;
                }

                
                if (!string.IsNullOrEmpty(storageRoomUpdateRequest.StorageRoomCode))
                    storageRoomToUpdate.StorageRoomCode = storageRoomUpdateRequest.StorageRoomCode;

                if (!string.IsNullOrEmpty(storageRoomUpdateRequest.StorageRoomName))
                    storageRoomToUpdate.StorageRoomName = storageRoomUpdateRequest.StorageRoomName;

                if (storageRoomUpdateRequest.Temperature.HasValue)
                    storageRoomToUpdate.Temperature = storageRoomUpdateRequest.Temperature;

                if (storageRoomUpdateRequest.Humidity.HasValue)
                    storageRoomToUpdate.Humidity = storageRoomUpdateRequest.Humidity;

                if (storageRoomUpdateRequest.Quantity.HasValue)
                    storageRoomToUpdate.Quantity = storageRoomUpdateRequest.Quantity;

                if (storageRoomUpdateRequest.Status.HasValue)
                    storageRoomToUpdate.Status = storageRoomUpdateRequest.Status;

                if (storageRoomUpdateRequest.CreatedBy.HasValue)
                    storageRoomToUpdate.CreatedBy = storageRoomUpdateRequest.CreatedBy;

                if (storageRoomUpdateRequest.CreatedDate.HasValue)
                    storageRoomToUpdate.CreatedDate = storageRoomUpdateRequest.CreatedDate;

                // ✅ Thực hiện cập nhật
                await _storageRoomRepository.UpdateAsync(storageRoomToUpdate);
                await _storageRoomRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<StorageRoomDTO>(storageRoomToUpdate);
                response.Message = "Cập nhật nhà kho thành công";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Lỗi khi cập nhật nhà kho: {ex.Message}");
                Console.WriteLine($"🔍 Chi tiết lỗi: {ex.StackTrace}");

                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}"; // Trả về lỗi cụ thể để dễ debug
            }

            return response;
        }

        public async Task<Response<IEnumerable<StorageRoomDTO>>> CheckTemperatureWarning()
        {
            var response = new Response<IEnumerable<StorageRoomDTO>>();

            try
            {
                var storageRooms = await _storageRoomRepository.GetAllAsync();
                var warningRooms = storageRooms.Where(sr => sr.Temperature.HasValue && sr.Temperature > 30).ToList();

                if (warningRooms.Any())
                {
                    response.Success = true;
                    response.Message = "Cảnh báo: Một số phòng có nhiệt độ cao!";
                    response.Data = _mapper.Map<IEnumerable<StorageRoomDTO>>(warningRooms);
                }
                else
                {
                    response.Success = true;
                    response.Message = "Không có cảnh báo nhiệt độ.";
                    response.Data = new List<StorageRoomDTO>();
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
            }

            return response;
        }




    }
}