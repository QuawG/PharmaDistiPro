using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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


    }
}
