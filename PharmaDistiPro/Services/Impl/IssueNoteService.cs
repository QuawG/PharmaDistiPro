using AutoMapper;
using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.IssueNoteDetails;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using System.Linq;

namespace PharmaDistiPro.Services.Impl
{
    public class IssueNoteService : IIssueNoteService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrdersDetailRepository _ordersDetailRepository;
        private readonly IProductLotRepository _productLotRepository;
        private readonly IIssueNoteDetailsRepository _issueNoteDetailsRepository;
        private readonly IIssueNoteRepository _issueNoteRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IssueNoteService(IOrderRepository orderRepository,
            IIssueNoteRepository issuteNoteRepository,
            IIssueNoteDetailsRepository issueNoteDetailsRepository,
            IOrdersDetailRepository ordersDetailRepository,
            IProductLotRepository productLotRepository, IMapper mapper, IUserRepository userRepository,
            IHttpContextAccessor httpContextAccessor
            )
        {
            _issueNoteRepository = issuteNoteRepository;
            _issueNoteDetailsRepository = issueNoteDetailsRepository;
            _orderRepository = orderRepository;
            _ordersDetailRepository = ordersDetailRepository;
            _productLotRepository = productLotRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        #region IssueNote
        public async Task<Response<IssueNoteDto>> CancelIssueNote(int issueNoteId)
        {
            var response = new Response<IssueNoteDto>();
            try
            {
                // 1. Kiểm tra phiếu xuất kho có tồn tại không
                var issueNote = await _issueNoteRepository.GetByIdAsync(issueNoteId);
                if (issueNote == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy phiếu xuất kho";
                    return response;
                }

                // 2. Cập nhật trạng thái phiếu xuất kho thành HỦY
                issueNote.Status = (int)Common.Enums.IssueNotesStatus.HUY;
                issueNote.UpdatedStatusDate = DateTime.Now;

                // 3. Lấy danh sách chi tiết phiếu xuất kho
                var issueNoteDetails = await _issueNoteDetailsRepository.GetByConditionAsync(x => x.IssueNoteId == issueNoteId);

                if (!issueNoteDetails.Any())
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy chi tiết phiếu xuất kho";
                    return response;
                }

                // 4. Lấy danh sách ProductLotId từ IssueNoteDetail
                var productLotIds = issueNoteDetails
                    .Where(x => x.ProductLotId.HasValue)
                    .Select(x => x.ProductLotId.Value)
                    .ToList();

                // 5. Lấy danh sách ProductLot từ productLotIds
                var productLots = await _productLotRepository.GetByConditionAsync(x => productLotIds.Contains(x.ProductLotId));

                // 6. Cập nhật lại số lượng trong kho cho từng ProductLot
                foreach (var productLot in productLots)
                {
                    // Lọc các issueNoteDetail tương ứng với productLot hiện tại
                    var relatedIssueDetails = issueNoteDetails.Where(x => x.ProductLotId == productLot.ProductLotId);

                    foreach (var issueNoteDetail in relatedIssueDetails)
                    {
                        if (issueNoteDetail.Quantity.HasValue)
                        {
                            productLot.Quantity += issueNoteDetail.Quantity.Value;
                        }
                    }

                    await _productLotRepository.UpdateAsync(productLot);
                }

                // 7. Lưu thay đổi
                await _issueNoteRepository.SaveAsync();

                // 8. Trả về kết quả thành công
                response.Success = true;
                response.Data = _mapper.Map<IssueNoteDto>(issueNote);
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }

        public async Task<Response<IssueNoteDto>> CreateIssueNote(int orderId)
        {
            var response = new Response<IssueNoteDto>();

            try
            {
                IssueNoteRequestDto issueNoteRequestDto = new IssueNoteRequestDto();

                #region Update Order Status
                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy đơn hàng";
                    return response;
                }
                order.Status = (int)Common.Enums.OrderStatus.VAN_CHUYEN;
                order.UpdatedStatusDate = DateTime.Now;
                await _orderRepository.UpdateAsync(order);

                #endregion
                #region IssueNote

                //mapping order => issue note
                int issueNoteCount = await _issueNoteRepository.CountAsync(x => true);
                issueNoteRequestDto.OrderId = orderId;
               
                issueNoteRequestDto.CreatedDate = DateTime.Now;
                issueNoteRequestDto.UpdatedStatusDate = DateTime.Now;
                issueNoteRequestDto.Status = (int)Common.Enums.IssueNotesStatus.DA_XUAT;
                issueNoteRequestDto.CustomerId = order.CustomerId;
                issueNoteRequestDto.TotalAmount = order.TotalAmount;
                issueNoteRequestDto.UpdatedStatusDate = DateTime.Now;
                issueNoteRequestDto.CreatedBy = order.AssignTo;

                var issueNote = _mapper.Map<IssueNote>(issueNoteRequestDto);
                await _issueNoteRepository.CreateIssueNote(issueNote);

                #endregion

                #region IssueNoteDetail
                IEnumerable<OrdersDetail> listOrdersDetails = await _ordersDetailRepository.GetByConditionAsync(x => x.OrderId == orderId);

                List<int> productIds = listOrdersDetails.Where(x => x.ProductId.HasValue).Select(x => x.ProductId.Value).ToList();

                DateTime today = DateTime.Today;
                IEnumerable<ProductLot> productLots = (await _productLotRepository.GetProductLotsByProductIds(productIds));

                if (!productLots.Any())
                {
                    response.Success = false;
                    response.Message = "Không có hàng trong kho";
                    return response;
                }
                await _orderRepository.SaveAsync(); // Lưu để issueNote.Id có giá trị hợp lệ

                int issueNoteDetailCount = await _issueNoteDetailsRepository.CountAsync(x => true);
                List<IssueNoteDetail> issueNoteDetailsList = new List<IssueNoteDetail>();

                // Lặp qua từng sản phẩm trong đơn hàng
                foreach (var orderDetail in listOrdersDetails)
                {
                    int remainingQuantity = orderDetail.Quantity.Value; // Số lượng cần xuất
                    int productId = orderDetail.ProductId.Value;

                    foreach (var productLot in productLots.Where(p => p.ProductId == productId))
                    {
                        if (remainingQuantity <= 0) break; // Đã đủ số lượng, thoát vòng lặp

                        int takeQuantity = Math.Min(productLot.Quantity.Value, remainingQuantity); // Lấy tối đa có thể từ lô này
                        remainingQuantity -= takeQuantity; // Cập nhật số lượng còn lại

                        var issueNoteDetail = new IssueNoteDetail
                        {
                            IssueNoteId = issueNote.IssueNoteId,// Liên kết với issueNotDetail
                            ProductLotId = productLot.ProductLotId,
                            Quantity = takeQuantity // Cập nhật số lượng xuất kho từ lô này
                        };

                        issueNoteDetailsList.Add(issueNoteDetail);

                        // Cập nhật lại số lượng của lô hàng trong kho
                        productLot.Quantity -= takeQuantity;
                        await _productLotRepository.UpdateAsync(productLot);
                    }
                    if (remainingQuantity > 0)
                    {
                        response.Success = false;
                        response.Message = $"Không đủ hàng để xuất kho cho sản phẩm ID {productId}";
                        return response;
                    }
                }

                // Lưu danh sách chi tiết phiếu xuất kho
                await _issueNoteDetailsRepository.InsertRangeAsync(issueNoteDetailsList);
                 // Cập nhật tồn kho
                await _orderRepository.SaveAsync(); // Lưu tất cả thay đổi
                #endregion

                response.Success = true;
                response.Data = _mapper.Map<IssueNoteDto>(issueNote);
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }

        public async Task<Response<IEnumerable<IssueNoteDto>>> GetIssueNoteByWarehouseId(int[]? status)
        {
            var response = new Response<IEnumerable<IssueNoteDto>>();
            try
            {
                var userId = UserHelper.GetUserIdLogin(_httpContextAccessor.HttpContext);
                // Ensure status is not null before checking Contains
                var issueNotes = await _issueNoteRepository.GetByConditionAsync(
                    x => x.CreatedBy == userId && (!status.Any() || status.Contains(x.Status ?? 2)));

                if (!issueNotes.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                    return response;
                }

                response.Success = true;
                response.Data = _mapper.Map<IEnumerable<IssueNoteDto>>(issueNotes);
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
            }
            return response;
        }


        public async Task<Response<IEnumerable<IssueNoteDto>>> GetIssueNoteList()
        {
            var response = new Response<IEnumerable<IssueNoteDto>>();
            try
            {
                var issueNotes = await _issueNoteRepository.GetAllAsync();
                if (!issueNotes.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                response.Success = true;
                response.Data = _mapper.Map<IEnumerable<IssueNoteDto>>(issueNotes);
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }

        public async Task<Response<IssueNoteDto>> UpdateIssueNoteStatus(int issueNoteId, int status)
        {
            var response = new Response<IssueNoteDto>();
            try
            {
                var issueNote = await _issueNoteRepository.GetSingleByConditionAsync(x => x.IssueNoteId == issueNoteId);
                if (issueNote == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy phiếu xuất kho";
                    return response;
                } 
                // update issue status
                issueNote.Status = status;
                issueNote.UpdatedStatusDate = DateTime.Now;

                await _issueNoteRepository.UpdateAsync(issueNote);
                await _issueNoteRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<IssueNoteDto>(issueNote);
                return response;

            }catch(Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }

        #endregion

        #region IssueNoteDetail

        public async Task<Response<IEnumerable<IssueNoteDetailDto>>> GetIssueNoteDetailByIssueNoteId(int issueNoteId)
        {
            var response = new Response<IEnumerable<IssueNoteDetailDto>>();
            try
            {
                var issueNoteDetails = await _issueNoteDetailsRepository.GetByConditionAsync(x => x.IssueNoteId == issueNoteId,
                    includes: new string[] { "ProductLot", "ProductLot.Product" });

                if (!issueNoteDetails.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<IEnumerable<IssueNoteDetailDto>>(issueNoteDetails);  
                }
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }

        public async Task<Response<IEnumerable<IssueNoteDetailDto>>> GetIssueNoteDetailsList()
        {
            var response = new Response<IEnumerable<IssueNoteDetailDto>>();
            try
            {
                var issueNoteDetails = await _issueNoteDetailsRepository
                    .GetByConditionAsync(
                        x => true,
                        includes: new string[] { "ProductLot", "ProductLot.Product" } 
                    );
                if (!issueNoteDetails.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<IEnumerable<IssueNoteDetailDto>>(issueNoteDetails);
                }
                return response;

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }
        #endregion
    }
}
