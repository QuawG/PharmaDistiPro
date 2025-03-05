using AutoMapper;
using CloudinaryDotNet;
using PharmaDistiPro.DTO.Orders;
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
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepository, IOrdersDetailRepository ordersDetailRepository, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _ordersDetailRepository = ordersDetailRepository;
            _mapper = mapper;
        }

        // get order cua customer
        public async Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId)
        {
            Response<IEnumerable<OrderDto>> response = new Response<IEnumerable<OrderDto>>();
            try
            {
                var orders = await _orderRepository.GetByConditionAsync(o => o.CustomerId == customerId);
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
        public async Task<Response<IEnumerable<OrdersDetail>>> GetOrderDetailByOrderId(int orderId)
        {
            var response = new Response<IEnumerable<OrdersDetail>>();
            try
            {
                var ordersDetails = await _ordersDetailRepository.GetByConditionAsync(o => o.OrderId == orderId);
                if (!ordersDetails.Any())
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Data = ordersDetails;
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
                IEnumerable<Order> ordersList = await _orderRepository.GetByConditionAsync(x =>
                             (!status.Any() || status.Contains(x.Status ?? -1))&&
                             (!dateCreatedFrom.HasValue || x.CreatedDate >= dateCreatedFrom.Value) &&
                             (!dateCreatedTo.HasValue || x.CreatedDate <= dateCreatedTo.Value));

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

    }
}
