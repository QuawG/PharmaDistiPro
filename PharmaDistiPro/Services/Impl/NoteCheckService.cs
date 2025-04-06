using AutoMapper;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{
    public class NoteCheckService : INoteCheckService

    {
        private readonly INoteCheckRepository _noteCheckRepository;
        private readonly IMapper _mapper;
        private readonly IProductLotRepository _productLotRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;

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
                    throw new Exception($"ProductLotId {detailDto.ProductLotId} không tồn tại.");
                }

                var detail = _mapper.Map<NoteCheckDetail>(detailDto);
                detail.StorageQuantity = productLot.Quantity;
                detail.ErrorQuantity ??= 0;

                int difference = detail.StorageQuantity.Value - detail.ActualQuantity.Value;
                totalDifference += difference;

                int actualShortage = difference - detail.ErrorQuantity.Value;
                string shortageText = actualShortage >= 0 ? $"thiếu {actualShortage}" : $"thừa {Math.Abs(actualShortage)}";
                resultDetails.Add($"Lô {productLot.LotId} {shortageText} (hỏng {detail.ErrorQuantity})");

                detail.Status = (detail.ErrorQuantity > 0) ? 0 : null;
                details.Add(detail);
            }

            noteCheck.NoteCheckDetails = details;
            noteCheck.DifferenceQuatity = totalDifference;
            noteCheck.Result = string.Join(", ", resultDetails);

            await _noteCheckRepository.InsertNoteCheckAsync(noteCheck);
            return _mapper.Map<NoteCheckDTO>(noteCheck);
        }

        public async Task<NoteCheckDetailsDTO> MarkDamagedItemProcessedAsync(int noteCheckDetailId)
        {
            var noteCheckDetail = await _noteCheckRepository.GetDetailByIdAsync(noteCheckDetailId);
            if (noteCheckDetail == null)
                throw new Exception("NoteCheckDetail not found");

            if (noteCheckDetail.Status != 0)
                throw new Exception("Item is not marked as damaged or already processed");

            noteCheckDetail.Status = 1;
            await _noteCheckRepository.UpdateDetailAsync(noteCheckDetail);

            return _mapper.Map<NoteCheckDetailsDTO>(noteCheckDetail);
        }

        public async Task<List<NoteCheckDetailsDTO>> GetUnprocessedDamagedItemsAsync(int noteCheckId)
        {
            var noteCheck = await _noteCheckRepository.GetByIdAsync(noteCheckId);
            if (noteCheck == null)
                throw new Exception("NoteCheck not found");

            var unprocessedItems = noteCheck.NoteCheckDetails
                .Where(d => d.Status == 0)
                .ToList();

            return _mapper.Map<List<NoteCheckDetailsDTO>>(unprocessedItems);
        }

        // Phương thức mới: Lấy danh sách tất cả hàng hỏng từ các lần kiểm kho
        public async Task<List<NoteCheckDetailsDTO>> GetAllDamagedItemsAsync()
        {
            // Lấy tất cả NoteCheck từ repository
            var allNoteChecks = await _noteCheckRepository.GetAllAsync();
            if (allNoteChecks == null || !allNoteChecks.Any())
                throw new Exception("No NoteChecks found");

            // Lọc tất cả NoteCheckDetails có ErrorQuantity > 0
            var damagedItems = allNoteChecks
                .SelectMany(nc => nc.NoteCheckDetails)
                .Where(d => d.ErrorQuantity > 0)
                .ToList();

            return _mapper.Map<List<NoteCheckDetailsDTO>>(damagedItems);
        }


    }
}
