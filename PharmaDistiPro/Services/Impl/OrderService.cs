using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using PharmaDistiPro.Common.Enums;
using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using System.Collections;
using System.Linq;

namespace PharmaDistiPro.Services.Impl
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IOrdersDetailRepository _ordersDetailRepository;
        private readonly IProductLotRepository _productLotRepository;
        private readonly IIssueNoteDetailsRepository _issueNoteDetailsRepository;
        private readonly IIssueNoteRepository _issueNoteRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository,
            IIssueNoteRepository issuteNoteRepository,
           IIssueNoteDetailsRepository issueNoteDetailsRepository, 
           IOrdersDetailRepository ordersDetailRepository,
            IProductLotRepository productLotRepository, IMapper mapper, IUserRepository userRepository)
        {
            _issueNoteRepository = issuteNoteRepository;
            _issueNoteDetailsRepository = issueNoteDetailsRepository;
            _orderRepository = orderRepository;
            _ordersDetailRepository = ordersDetailRepository;
            _productLotRepository = productLotRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        // get order cua customer
        public async Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId)
        {
            Response<IEnumerable<OrderDto>> response = new Response<IEnumerable<OrderDto>>();
            try
            {
                var orders = await _orderRepository.GetByConditionAsync(o => o.CustomerId == customerId, includes : new string[] { "ConfirmedByNavigation", "Customer" });
                if (orders == null)
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Data = _mapper.Map<IEnumerable<OrderDto>>(orders);
                    response.Success = true;
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;

        }

        //get order detail theo orderId
        public async Task<Response<IEnumerable<OrdersDetailDto>>> GetOrderDetailByOrderId(int orderId)
        {
            var response = new Response<IEnumerable<OrdersDetailDto>>();
            try
            {
                var ordersDetails = await _ordersDetailRepository.GetByConditionAsync(o => o.OrderId == orderId, includes: new string[] { "Product" });
                var orderDto = _mapper.Map<IEnumerable<OrdersDetailDto>>(ordersDetails);
                if (!ordersDetails.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Data = orderDto;
                    response.Success = true;
                }
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // get all order trong he thong
        public async Task<Response<IEnumerable<OrderDto>>> GetAllOrders(int[] status, DateTime? dateCreatedFrom, DateTime? dateCreatedTo)
        {
            var response = new Response<IEnumerable<OrderDto>>();
            try
            {
                IEnumerable<Models.Order> ordersList = await _orderRepository.GetByConditionAsync(
                 x => (!status.Any() || status.Contains(x.Status ?? -1)) &&
                (!dateCreatedFrom.HasValue || x.CreatedDate >= dateCreatedFrom.Value) &&
                (!dateCreatedTo.HasValue || x.CreatedDate <= dateCreatedTo.Value),
                includes: new string[] { "ConfirmedByNavigation", "Customer" });

                if (!ordersList.Any())
                {
                    return new Response<IEnumerable<OrderDto>>
                    {
                        Success = false,
                        Message = "Không có dữ liệu"

                    };
                }

                response.Data = _mapper.Map<IEnumerable<OrderDto>>(ordersList);
                response.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                return new Response<IEnumerable<OrderDto>>
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }


        // check out  sau khi add to cart
        public async Task<Response<OrderDto>> CheckOut(OrderRequestDto orderRequestDto)
        {
            var response = new Response<OrderDto>();
            try
            {
                #region Create Order
                var order = _mapper.Map<Models.Order>(orderRequestDto);
                order.CreatedDate = DateTime.Now;
                order.StockReleaseDate = null;
                order.ConfirmedBy = null;
                order.Date = null;
                order.Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN;

                // Tạo OrderCode an toàn bằng cách lấy OrderId lớn nhất
                var maxOrderId = await _orderRepository.GetMaxOrderId();
                order.OrderCode = ConstantStringHelper.OrderCode + (maxOrderId + 1);

                await _orderRepository.InsertAsync(order);
                await _orderRepository.SaveAsync();
                #endregion

                #region Create Order Details

                
                // Thực hiện mapping
                List<OrdersDetail> ordersDetails = _mapper.Map<List<OrdersDetail>>(orderRequestDto.OrdersDetails);
                ordersDetails.ForEach(x => x.OrderId = order.OrderId);

                await _ordersDetailRepository.AddOrdersDetails(ordersDetails);
                await _ordersDetailRepository.SaveAsync(); // Save toàn bộ OrderDetails
                #endregion

                response.Success = true;
                response.Data = _mapper.Map<OrderDto>(order);
                return response;
            }
            catch (Exception ex)
            {
                return new Response<OrderDto>
                {
                    Success = false,
                    Message = $"Lỗi khi tạo đơn hàng: {ex.Message}"
                };
            }
        }

        //Update trang thai order

        public async Task<Response<OrderDto>> UpdateOrderStatus(int orderId, int status)
        {
            var response = new Response<OrderDto>();
            try
            {
                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy đơn hàng";
                    return response;
                }
                order.Status = status;
                order.Date = DateTime.Now;

                await _orderRepository.UpdateAsync(order);
                await _orderRepository.SaveAsync();
                response.Success = true;
                response.Data = _mapper.Map<OrderDto>(order);
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        //list order can confirm
        public async Task<Response<IEnumerable<OrderDto>>> GetOrderNeedConfirm()
        {
            var response = new Response<IEnumerable<OrderDto>>();
            try
            {
                var orders = await _orderRepository.GetByConditionAsync(o => o.Status == (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                    includes: new string[] { "ConfirmedByNavigation", "Customer" });
                if (!orders.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Data = _mapper.Map<IEnumerable<OrderDto>>(orders);
                    response.Success = true;
                    return response;
                }

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }

        }

        //confirm order
        public async Task<Response<IssueNoteRequestDto>> ConfirmOrder(int orderId)
        {
            var response = new Response<IssueNoteRequestDto>();
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
                order.Status = (int)Common.Enums.OrderStatus.DA_DUYET;
                order.Date = DateTime.Now;
                await _orderRepository.UpdateAsync(order); // Lưu trạng thái mới của đơn hàng trước
                #endregion

                #region IssueNote
                int issueNoteCount = await _issueNoteRepository.CountAsync(x => true);
                issueNoteRequestDto.OrderId = orderId;
                issueNoteRequestDto.IssueNotesCode = ConstantStringHelper.IssueNoteCode + (issueNoteCount + 1);
                issueNoteRequestDto.CreatedDate = DateTime.Now;
                issueNoteRequestDto.Status = (int)Common.Enums.IssueNotesStatus.DANG_XU_LY;
                issueNoteRequestDto.CustomerId = order.CustomerId;
                issueNoteRequestDto.TotalAmount = order.TotalAmount;

                User? warehouseManager = await _userRepository.GetWarehouseManagerToConfirm();

                issueNoteRequestDto.CreatedBy = warehouseManager.UserId;

                var issueNote = _mapper.Map<IssueNote>(issueNoteRequestDto);
                await _issueNoteRepository.InsertAsync(issueNote);
                await _orderRepository.SaveAsync(); // Lưu để issueNote.Id có giá trị hợp lệ
                #endregion

                #region IssueNoteDetail
                List<int> productIds = await _ordersDetailRepository.GetProductIdByOrderId(order.OrderId);

                List<ProductLot> productLots = (await _productLotRepository.GetProductLotsByProductIds(productIds)).ToList();
                if (productLots == null || productLots.Count == 0)
                {
                    response.Success = false;
                    response.Message = "Không có hàng trong kho";
                    return response;
                }

                int issueNoteDetailCount = await _issueNoteDetailsRepository.CountAsync(x => true);
                List<IssueNoteDetail> issueNoteDetailsList = new List<IssueNoteDetail>();

                foreach (ProductLot productLot in productLots)
                {
                    var issueNoteDetail = new IssueNoteDetail
                    {
                        IssueNoteId = issueNote.Id, // Đảm bảo issueNote.Id hợp lệ
                        NoteNumber = ConstantStringHelper.IssueNotesDetailsCode + (++issueNoteDetailCount),
                        ProductLotId = productLot.ProductLotId
                    };
                    await _issueNoteDetailsRepository.InsertAsync(issueNoteDetail);
                }

                await _orderRepository.SaveAsync(); // Lưu tất cả thay đổi
                #endregion

                response.Success = true;
                response.Data = issueNoteRequestDto;
                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.InnerException?.Message ?? ex.Message;
                return response;
            }
        }



    }
}
