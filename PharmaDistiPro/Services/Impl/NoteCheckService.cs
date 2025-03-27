//using AutoMapper;
//using PharmaDistiPro.DTO.NoteChecks;
//using PharmaDistiPro.Models;
//using PharmaDistiPro.Repositories.Interface;
//using PharmaDistiPro.Services.Interface;

//namespace PharmaDistiPro.Services.Impl
//{
//    public class NoteCheckService : INoteCheckService

//    {
//        private readonly INoteCheckRepository _noteCheckRepository;
//        private readonly IMapper _mapper;

//        public NoteCheckService(INoteCheckRepository noteCheckRepository, IMapper mapper)
//        {
//            _noteCheckRepository = noteCheckRepository;
//            _mapper = mapper;
//        }


//        public async Task<CheckNoteResponseDTO> CreateCheckNote(CheckNoteRequestDTO request, int userId)
//        {
//            // Kiểm tra StorageRoomId có tồn tại không
//            if (!await _noteCheckRepository.StorageRoomExists(request.StorageRoomId))
//            {
//                throw new Exception($"StorageRoom with ID {request.StorageRoomId} does not exist.");
//            }

//            // Tính tổng số lượng chênh lệch
//            int totalDifference = 0;
//            var checkDetails = new List<NoteCheckDetail>();

//            foreach (var detailDto in request.CheckDetails)
//            {
//                var productLot = await _noteCheckRepository.GetProductLotById(detailDto.ProductLotId);
//                if (productLot == null)
//                {
//                    throw new Exception($"ProductLot with ID {detailDto.ProductLotId} not found.");
//                }

//                int storageQuantity = productLot.Quantity;
//                int actualQuantity = detailDto.ActualQuantity;
//                int errorQuantity = Math.Abs(storageQuantity - actualQuantity);
//                totalDifference += errorQuantity;

//                var detail = _mapper.Map<NoteCheckDetail>(detailDto);
//                detail.StorageQuantity = storageQuantity;
//                detail.ErrorQuantity = errorQuantity;
//                detail.Status = (int)CheckStatus.Pending; // Trạng thái mặc định: Đang Duyệt
//                checkDetails.Add(detail);
//            }

//            // Tạo phiếu kiểm tra
//            var noteCheck = _mapper.Map<NoteCheck>(request);
//            noteCheck.DifferenceQuatity = totalDifference;
//            noteCheck.Result = totalDifference == 0 ? "Pass" : "Fail";
//            noteCheck.CreatedBy = userId;
//            noteCheck.CreatedDate = DateTime.Now;
//            noteCheck.Status = CheckStatus.Pending.ToString(); // Trạng thái mặc định: Đang Duyệt

//            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
//            using (var transaction = await _noteCheckRepository.BeginTransactionAsync())
//            {
//                try
//                {
//                    // Lưu phiếu kiểm tra và lấy ID
//                    int noteCheckId = await _noteCheckRepository.CreateCheckNote(noteCheck);

//                    // Gán NoteCheckId cho các chi tiết kiểm tra
//                    foreach (var detail in checkDetails)
//                    {
//                        detail.NoteCheckId = noteCheckId;
//                    }

//                    // Lưu chi tiết kiểm tra
//                    await _noteCheckRepository.CreateCheckNoteDetails(checkDetails);

//                    await transaction.CommitAsync();

//                    // Tạo response
//                    return _mapper.Map<CheckNoteResponseDTO>(noteCheck);
//                }
//                catch
//                {
//                    await transaction.RollbackAsync();
//                    throw;
//                }
//            }
//        }

//        public async Task<ApproveCheckNoteResponseDTO> ApproveCheckNote(ApproveCheckNoteRequestDTO request)
//        {
//            // Lấy thông tin phiếu kiểm tra
//            var noteCheck = await _noteCheckRepository.GetCheckNoteById(request.NoteCheckId);
//            if (noteCheck == null)
//            {
//                throw new Exception($"CheckNote with ID {request.NoteCheckId} not found.");
//            }

//            // Kiểm tra trạng thái hiện tại
//            if (noteCheck.Status != CheckStatus.Pending.ToString())
//            {
//                throw new Exception($"CheckNote with ID {request.NoteCheckId} is not in Pending status.");
//            }

//            // Lấy chi tiết kiểm tra
//            var checkDetails = await _noteCheckRepository.GetCheckNoteDetailsByCheckNoteId(request.NoteCheckId);
//            if (checkDetails == null || !checkDetails.Any())
//            {
//                throw new Exception($"No details found for CheckNote with ID {request.NoteCheckId}.");
//            }

//            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
//            using (var transaction = await _noteCheckRepository.BeginTransactionAsync())
//            {
//                try
//                {
//                    // Cập nhật số lượng thực tế trong ProductLot
//                    foreach (var detail in checkDetails)
//                    {
//                        var productLot = await _noteCheckRepository.GetProductLotById(detail.ProductLotId.Value);
//                        if (productLot == null)
//                        {
//                            throw new Exception($"ProductLot with ID {detail.ProductLotId} not found.");
//                        }

//                        // Cập nhật số lượng thực tế
//                        productLot.Quantity = detail.ActualQuantity.Value;
//                        await _noteCheckRepository.UpdateProductLot(productLot);

//                        // Cập nhật trạng thái của chi tiết kiểm tra
//                        detail.Status = (int)CheckStatus.Approved;
//                    }

//                    // Cập nhật trạng thái của CheckNote
//                    noteCheck.Status = CheckStatus.Approved.ToString();
//                    await _noteCheckRepository.UpdateCheckNote(noteCheck);

//                    // Cập nhật trạng thái của các chi tiết kiểm tra
//                    await _noteCheckRepository.UpdateCheckNoteDetails(checkDetails);

//                    await transaction.CommitAsync();

//                    // Tạo response
//                    return _mapper.Map<ApproveCheckNoteResponseDTO>(noteCheck);
//                }
//                catch
//                {
//                    await transaction.RollbackAsync();
//                    throw;
//                }
//            }
//        }


//    }
//}
