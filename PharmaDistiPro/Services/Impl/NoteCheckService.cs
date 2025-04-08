using AutoMapper;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.Repositories.Impl;

namespace PharmaDistiPro.Services.Impl
{
    public class NoteCheckService : INoteCheckService

    {
        private readonly INoteCheckRepository _noteCheckRepository;
        private readonly IMapper _mapper;
        private readonly IProductLotRepository _productLotRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IProductRepository _productRepository;
        public NoteCheckService(
            INoteCheckRepository noteCheckRepository,
            IMapper mapper,
            IProductLotRepository productLotRepository,
            IUserRepository userRepository,
            IHttpContextAccessor httpContextAccessor)
        {
            _noteCheckRepository = noteCheckRepository;
            _mapper = mapper;
            _productLotRepository = productLotRepository;
            _userRepository = userRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<NoteCheckDTO> CreateNoteCheckAsync(NoteCheckRequestDTO request)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            if (!string.IsNullOrEmpty(userId))
            {
                request.CreatedBy = int.Parse(userId);
            }

            var noteCheck = _mapper.Map<NoteCheck>(request);
            noteCheck.CreatedDate = request.CreatedDate ?? DateTime.UtcNow;
            noteCheck.Status = false;

            int totalDifference = 0;
            var details = new List<NoteCheckDetail>();
            var resultDetails = new List<string>();

            foreach (var detailDto in request.NoteCheckDetails)
            {
                
                var productLot = await _productLotRepository.GetSingleByConditionAsync(p => p.ProductLotId == detailDto.ProductLotId);
                if (productLot == null)
                {
                    throw new Exception($" Không tìm thấy ProductLot với ID: {detailDto.ProductLotId}");
                }

                if (!productLot.ProductId.HasValue)
                {
                    throw new Exception($" ProductLotId {productLot.ProductLotId} không liên kết với sản phẩm.");
                }

              
                var product = await _productLotRepository.GetProductByIdAsync(productLot.ProductId.Value);
                if (product == null)
                {
                    throw new Exception($" Không tìm thấy Product với ID: {productLot.ProductId.Value}");
                }

       
                var detail = _mapper.Map<NoteCheckDetail>(detailDto);

                detail.StorageQuantity = productLot.Quantity;
                detail.ErrorQuantity ??= 0;

                if (!detail.StorageQuantity.HasValue)
                {
                    throw new Exception($" StorageQuantity không có giá trị (null) cho ProductLotId {productLot.ProductLotId}.");
                }

                if (!detail.ActualQuantity.HasValue)
                {
                    throw new Exception($" ActualQuantity không có giá trị (null) cho ProductLotId {productLot.ProductLotId}.");
                }

                // 4. Tính toán chênh lệch
                int difference = detail.StorageQuantity.Value - detail.ActualQuantity.Value;
                totalDifference += difference;

                int actualShortage = difference - detail.ErrorQuantity.Value;

                // 5. Tạo chuỗi kết quả chi tiết
                string shortageText = actualShortage > 0
                    ? $"thiếu {actualShortage}"
                    : actualShortage < 0
                        ? $"thừa {Math.Abs(actualShortage)}"
                        : "đủ";

                string productName = product?.ProductName ?? "Không rõ sản phẩm";
                string lotId = productLot?.LotId?.ToString() ?? "Không rõ lô";

                resultDetails.Add($"Sản phẩm {productName} của lô {lotId} này {shortageText} (hỏng {detail.ErrorQuantity})");

                // 6. Gán status
                detail.Status = (detail.ErrorQuantity > 0) ? 0 : null;
                details.Add(detail);
            }

            // 7. Gán lại danh sách chi tiết và lưu vào DB
            noteCheck.NoteCheckDetails = details;
            noteCheck.DifferenceQuatity = totalDifference;
            noteCheck.Result = string.Join(", ", resultDetails);

            await _noteCheckRepository.InsertNoteCheckAsync(noteCheck);
            return _mapper.Map<NoteCheckDTO>(noteCheck);
        
    }



        public async Task<NoteCheckDTO> UpdateNoteCheckAsync(int noteCheckId, NoteCheckRequestDTO request)
        {
           
            var existingNoteCheck = await _noteCheckRepository.GetNoteCheckByIdAsync(noteCheckId);
            if (existingNoteCheck == null)
            {
                throw new Exception($"Không tìm thấy NoteCheck với ID: {noteCheckId}");
            }

           
            if (existingNoteCheck.Status == true)
            {
                throw new Exception("Không thể cập nhật NoteCheck đã được duyệt");
            }

     
            existingNoteCheck.CreatedDate = DateTime.UtcNow;
            // Các trường khác có thể cập nhật nếu có trong request
            if (request.CreatedDate.HasValue)
            {
                existingNoteCheck.CreatedDate = request.CreatedDate.Value;
            }
         

       
            var updatedDetails = new List<NoteCheckDetail>();
            int totalDifference = 0;
            var resultDetails = new List<string>();

            foreach (var detailDto in request.NoteCheckDetails)
            {
           
                var existingDetail = existingNoteCheck.NoteCheckDetails
                    .FirstOrDefault(d => d.NoteCheckDetailId == detailDto.NoteCheckDetailId);

                if (existingDetail == null)
                {
                   
                    var productLot = await _productLotRepository.GetSingleByConditionAsync(p =>
                        p.ProductLotId == detailDto.ProductLotId);

                    if (productLot == null)
                    {
                        throw new Exception($"Không tìm thấy ProductLot với ID: {detailDto.ProductLotId}");
                    }

                    var product = await _productLotRepository.GetProductByIdAsync(productLot.ProductId.Value);
                    if (product == null)
                    {
                        throw new Exception($"Không tìm thấy Product với ID: {productLot.ProductId.Value}");
                    }

                    var newDetail = _mapper.Map<NoteCheckDetail>(detailDto);
                    newDetail.NoteCheckId = noteCheckId;
                    newDetail.StorageQuantity = productLot.Quantity;
                    newDetail.ErrorQuantity ??= 0;

                    // Tính toán
                    int difference = newDetail.StorageQuantity.Value - newDetail.ActualQuantity.Value;
                    totalDifference += difference;
                    int actualShortage = difference - newDetail.ErrorQuantity.Value;

                    // Tạo kết quả
                    string shortageText = GetShortageText(actualShortage);
                    string resultText = BuildResultText(product, productLot, shortageText, newDetail.ErrorQuantity.Value);
                    resultDetails.Add(resultText);

                    newDetail.Status = newDetail.ErrorQuantity > 0 ? 0 : null;
                    updatedDetails.Add(newDetail);
                }
                else
                {
                   
                    existingDetail.ActualQuantity = detailDto.ActualQuantity ?? existingDetail.ActualQuantity;
                    existingDetail.ErrorQuantity = detailDto.ErrorQuantity ?? existingDetail.ErrorQuantity;

                    var productLot = await _productLotRepository.GetSingleByConditionAsync(p =>
                        p.ProductLotId == existingDetail.ProductLotId);
                    var product = await _productLotRepository.GetProductByIdAsync(productLot.ProductId.Value);

                 
                    int difference = existingDetail.StorageQuantity.Value - existingDetail.ActualQuantity.Value;
                    totalDifference += difference;
                    int actualShortage = difference - existingDetail.ErrorQuantity.Value;

                  
                    string shortageText = GetShortageText(actualShortage);
                    string resultText = BuildResultText(product, productLot, shortageText, existingDetail.ErrorQuantity.Value);
                    resultDetails.Add(resultText);

                    existingDetail.Status = existingDetail.ErrorQuantity > 0 ? 0 : null;
                    updatedDetails.Add(existingDetail);
                }
            }

    
            existingNoteCheck.NoteCheckDetails = updatedDetails;
            existingNoteCheck.DifferenceQuatity = totalDifference;
            existingNoteCheck.Result = string.Join(", ", resultDetails);

    
            await _noteCheckRepository.UpdateNoteCheckAsync(existingNoteCheck);

            return _mapper.Map<NoteCheckDTO>(existingNoteCheck);
        }

        
        private string GetShortageText(int actualShortage)
        {
            return actualShortage > 0 ? $"thiếu {actualShortage}"
                : actualShortage < 0 ? $"thừa {Math.Abs(actualShortage)}"
                : "đủ";
        }

        private string BuildResultText(Product product, ProductLot productLot, string shortageText, int errorQuantity)
        {
            string productName = product?.ProductName ?? "Không rõ sản phẩm";
            string lotId = productLot?.LotId?.ToString() ?? "Không rõ lô";
            return $"Sản phẩm {productName} của lô {lotId} này {shortageText} (hỏng {errorQuantity})";
        }

        // get all error product of productlot
        public async Task<List<ErrorProductDTO>> GetAllErrorProductsAsync()
        {
            // Lấy tất cả NoteCheck cùng với NoteCheckDetails
            var noteChecks = await _noteCheckRepository.GetAllWithDetailsAsync();
            if (noteChecks == null || !noteChecks.Any())
            {
                throw new Exception("Không có đơn kiểm kê nào.");
            }

      
            var noteCheckDTOs = _mapper.Map<List<NoteCheckDTO>>(noteChecks);
            var errorProducts = new List<ErrorProductDTO>();

            foreach (var noteCheck in noteCheckDTOs)
            {
                foreach (var detail in noteCheck.NoteCheckDetails)
                {
                   
                    if (detail.ErrorQuantity.HasValue && detail.ErrorQuantity.Value > 0)
                    {
                    
                        var productLot = detail.ProductLot;
                        if (productLot == null)
                        {
                            continue; 
                        }

                       
                        var productName = productLot.Product?.ProductName ?? "Không rõ sản phẩm";

            
                        string errorStatus = detail.Status switch
                        {
                            1 => "Đã hủy",
                            _ => "Đang xử lý" // 0, null hoặc các giá trị khác
                        };

                      
                        var errorProduct = new ErrorProductDTO
                        {
                            ProductName = productName,
                            ErrorQuantity = detail.ErrorQuantity.Value,
                            LotId = productLot.LotId?.ToString() ?? "Không rõ lô",
                            NoteCheckCode = noteCheck.NoteCheckCode ?? "Không rõ mã",
                            ErrorStatus = errorStatus,
                            NoteCheckDetailId = detail.NoteCheckDetailId
                        };

                        errorProducts.Add(errorProduct);
                    }
                }
            }

            if (!errorProducts.Any())
            {
                throw new Exception("Không có sản phẩm hỏng nào được tìm thấy.");
            }

            return errorProducts;
        }
       
        public async Task<bool> UpdateErrorProductCancelStatusAsync(int noteCheckDetailId)
        {
            // Lấy tất cả NoteCheck để tìm detail cụ thể
            var noteChecks = await _noteCheckRepository.GetAllWithDetailsAsync();
            if (noteChecks == null || !noteChecks.Any())
            {
                throw new Exception("Không có đơn kiểm kê nào.");
            }

            // Tìm NoteCheckDetail theo Id
            NoteCheckDetail detailToUpdate = null;
            NoteCheck noteCheckToUpdate = null;

            foreach (var noteCheck in noteChecks)
            {
                detailToUpdate = noteCheck.NoteCheckDetails
                    .FirstOrDefault(d => d.NoteCheckDetailId == noteCheckDetailId &&
                                       d.ErrorQuantity.HasValue &&
                                       d.ErrorQuantity.Value > 0);
                if (detailToUpdate != null)
                {
                    noteCheckToUpdate = noteCheck;
                    break;
                }
            }

            if (detailToUpdate == null)
            {
                throw new Exception("Không tìm thấy sản phẩm lỗi với Id: " + noteCheckDetailId);
            }

            if (detailToUpdate.Status == 1)
            {
                throw new Exception("Sản phẩm lỗi này đã được hủy trước đó.");
            }

        
            detailToUpdate.Status = 1;
            

          
            await _noteCheckRepository.UpdateAsync(noteCheckToUpdate);

            return true;
        }

        // Chức năng xem chi tiết của từng đơn kiểm kê
        public async Task<NoteCheckDTO> GetNoteCheckByIdAsync(int noteCheckId)
        {
            // Get the NoteCheck by its ID
            var noteCheck = await _noteCheckRepository.GetByIdAsync(noteCheckId);
            if (noteCheck == null)
            {
                throw new Exception("Không tìm thấy đơn kiểm kê.");
            }

            
            var noteCheckDetails = await _noteCheckRepository.GetDetailsByNoteCheckIdAsync(noteCheckId);

           
            var noteCheckDTO = _mapper.Map<NoteCheckDTO>(noteCheck);

            
            noteCheckDTO.NoteCheckDetails = _mapper.Map<List<NoteCheckDetailsDTO>>(noteCheckDetails);

            return noteCheckDTO;
        }


        //confirm notecheck
        public async Task<NoteCheckDTO> ApproveNoteCheckAsync(int noteCheckId)
        {
            var noteCheck = await _noteCheckRepository.GetNoteCheckByIdAsync(noteCheckId);
            if (noteCheck == null)
            {
                throw new Exception("Không tìm thấy đơn kiểm kê.");
            }

            
            if (noteCheck.Status == true)
            {
                throw new Exception("Đơn kiểm kê này đã được duyệt.");
            }

            noteCheck.Status = true;

        
            foreach (var detail in noteCheck.NoteCheckDetails)
            {
              
                var productLot = await _productLotRepository.GetSingleByConditionAsync(p => p.ProductLotId == detail.ProductLotId);
                if (productLot != null)
                {
                  
                    productLot.Quantity = detail.ActualQuantity.Value;

                    
                    await _productLotRepository.UpdateAsyncProductLot(productLot);
                }
                else
                {
                    throw new Exception($"Không tìm thấy lô sản phẩm với ID {detail.ProductLotId}.");
                }
            }

        
            await _noteCheckRepository.UpdateAsync(noteCheck);
            await _noteCheckRepository.SaveAsync();

            return _mapper.Map<NoteCheckDTO>(noteCheck);
        }

        // Thêm phương thức GetAllNoteChecksAsync
        public async Task<List<NoteCheckDTO>> GetAllNoteChecksAsync()
        {
            var noteChecks = await _noteCheckRepository.GetAllWithDetailsAsync();
            if (noteChecks == null || !noteChecks.Any())
            {
                throw new Exception("Không có đơn kiểm kê nào.");
            }

            var noteCheckDTOs = _mapper.Map<List<NoteCheckDTO>>(noteChecks);
            return noteCheckDTOs;
        }
    }
}
