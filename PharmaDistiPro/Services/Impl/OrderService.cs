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

        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository,
           IIssueNoteRepository issuteNoteRepository,
           IOrdersDetailRepository ordersDetailRepository,
           IMapper mapper, IUserRepository userRepository)
        {
            _orderRepository = orderRepository;
            _ordersDetailRepository = ordersDetailRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        // get order cua customer
        public async Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId)
        {
            Response<IEnumerable<OrderDto>> response = new Response<IEnumerable<OrderDto>>();
            try
            {
                var orders = await _orderRepository.GetByConditionAsync(o => o.CustomerId == customerId, includes: new string[] { "ConfirmedByNavigation", "Customer" });
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
                ordersDetails = ordersDetails.OrderByDescending(o => o.OrderDetailId);

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
                order.Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN;
                order.UpdatedStatusDate = DateTime.Now;
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
                order.UpdatedStatusDate = DateTime.Now;

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

                orders = orders.OrderByDescending(o => o.OrderId).ToList();
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
        public async Task<Response<OrderDto>> ConfirmOrder(int orderId)
        {
            var response = new Response<OrderDto>();
            try
            {
                #region Update Order Status
                var order = await _orderRepository.GetByIdAsync(orderId);
                if (order == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy đơn hàng";
                    return response;
                }
                order.Status = (int)Common.Enums.OrderStatus.DA_DUYET;
                order.UpdatedStatusDate = DateTime.Now;
                await _orderRepository.UpdateAsync(order); // Lưu trạng thái mới của đơn hàng trước
                await _orderRepository.SaveAsync();
                #endregion


                response.Success = true;
                response.Data = _mapper.Map<OrderDto>(order);
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
