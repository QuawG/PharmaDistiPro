using AutoMapper;
using CloudinaryDotNet;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

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
        public async Task<Response<OrderDto>> GetOrderByCustomerId(int customerId)
        {
            Response<OrderDto> response = new Response<OrderDto>();
            try
            {
                var orders = await _orderRepository.GetSingleByConditionAsync(o => o.CustomerId == customerId);
                if (orders== null)
                {
                    response.Success = false;
                    response.Message = "Không có dữ liệu";
                }
                else
                {
                    response.Data = _mapper.Map<OrderDto>(orders);
                    response.Success = true;
                    return response;
                }
            }
            catch(Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }
            return response;

        }

        public async Task<Response<IEnumerable<OrdersDetail>>> GetOrderDetailByOrderId(int orderId)
        {
            var response = new Response<IEnumerable<OrdersDetail>>();
            try
            {
                var ordersDetails = await _ordersDetailRepository.GetByConditionAsync(o => o.OrderId == orderId);
                if(ordersDetails.Count() == 0) {
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
            catch(Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }
    }
}
