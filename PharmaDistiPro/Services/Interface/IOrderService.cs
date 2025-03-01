using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IOrderService
    {
        Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId);


        //List ra orderDetail theo orderId
        Task<Response<IEnumerable<OrdersDetail>>> GetOrderDetailByOrderId(int orderId);
    }
}
