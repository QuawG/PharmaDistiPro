using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        //Api get order by customer id
        [HttpGet("GetOrderByCustomerId/{customerId}")]
        public async Task<IActionResult> GetOrderByCustomerId(int customerId)
        {
            var response = await _orderService.GetOrderByCustomerId(customerId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }


        // api get order details cua order
        [HttpGet("GetOrdersDetailByOrderId/{orderId}")]
        public async Task<IActionResult> GetOrdersDetailByOrderId(int orderId)
        {
            var response = await _orderService.GetOrderDetailByOrderId(orderId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        // api get all order trong he thong
        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders([FromQuery] int[] status, DateTime? createdDateFrom, DateTime? createdDateTo)
        {
            var response = await _orderService.GetAllOrders(status, createdDateFrom, createdDateTo);

            if (!response.Success) return BadRequest(new { response.Message });

            return Ok(response);
        }


        //api get list order can confirm
        [HttpGet("GetOrderNeedConfirm")]
        public async Task<IActionResult> GetOrderNeedConfirm()
        {
            var response = await _orderService.GetOrderNeedConfirm();
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        // api create order
        [HttpPost("CheckOut")]
        public async Task<IActionResult> CheckOut([FromBody]OrderRequestDto orderRequestDto)
        {
            var response = await _orderService.CheckOut(orderRequestDto);

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (!response.Success)
            {
                return BadRequest(new { response.Message });
            }
            return Ok(response);
        }

        // api update order status
        [HttpPut("UpdateOrderStatus/{orderId}/{status}")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, int status)
        {
            var response = await _orderService.UpdateOrderStatus(orderId, status);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        //api confirm order
        [HttpPut("ConfirmOrder/{orderId}")]
        public async Task<IActionResult> ConfirmOrder(int orderId)
        {
            var response = await _orderService.ConfirmOrder(orderId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }


    }
}
