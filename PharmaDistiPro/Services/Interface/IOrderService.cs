using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IOrderService
    {
        //List order cua customer
        Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId);

        //List ra orderDetail theo orderId
        Task<Response<IEnumerable<OrdersDetailDto>>> GetOrderDetailByOrderId(int orderId);

        //List all orders
        Task<Response<IEnumerable<OrderDto>>> GetAllOrders(int[] status, DateTime? dateCreatedFrom, DateTime? dateCreatedTo);

        //Create order checkout
        Task<Response<OrderDto>> CheckOut(OrderRequestDto orderRequestDto);


        //Update order status
        Task<Response<OrderDto>> UpdateOrderStatus(int orderId, int status);

        //confirm order status
        Task<Response<IssueNoteRequestDto>> ConfirmOrder(int orderId);
        //List order dang can confirm
        Task<Response<IEnumerable<OrderDto>>> GetOrderNeedConfirm();


    }
}
