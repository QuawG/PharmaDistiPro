using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IOrderService
    {
        //List order cua customer
        Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId);


        //List ra orderDetail theo orderId
        Task<Response<IEnumerable<OrdersDetail>>> GetOrderDetailByOrderId(int orderId);

        //List all orders
        Task<Response<IEnumerable<OrderDto>>> GetAllOrders(int[] status, DateTime? dateCreatedFrom, DateTime? dateCreatedTo);
    }
}
