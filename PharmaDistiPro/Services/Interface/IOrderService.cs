using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IOrderService
    {
        #region orders

        //List all orders
        Task<Response<IEnumerable<OrderDto>>> GetAllOrders(int[] status, DateTime? dateCreatedFrom, DateTime? dateCreatedTo);

        //Create order checkout
        Task<Response<OrderDto>> CheckOut(OrderRequestDto orderRequestDto);

        //Update order status
        Task<Response<OrderDto>> UpdateOrderStatus(int orderId, int status);

        //confirm order status
        Task<Response<OrderDto>> ConfirmOrder(int orderId);
        //List order dang can confirm
        Task<Response<IEnumerable<OrderDto>>> GetOrderNeedConfirm();

        //List all orders revenue
        Task<Response<IEnumerable<OrderDto>>> GetOrdersRevenueList(DateTime? dateCreatedFrom, DateTime? dateCreatedTo);

        #endregion

        #region order details
        //List order cua customer
        Task<Response<IEnumerable<OrderDto>>> GetOrderByCustomerId(int customerId);

        //List ra orderDetail theo orderId
        Task<Response<IEnumerable<OrdersDetailDto>>> GetOrderDetailByOrderId(int orderId);

        // list full order details
        Task<Response<IEnumerable<OrdersDetailDto>>> GetAllOrderDetails(DateTime? dateFrom, DateTime? dateTo, int? topProduct);
        #endregion

    }
}
