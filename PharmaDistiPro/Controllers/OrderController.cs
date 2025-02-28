using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService orderService;
        public OrderController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        //Api get order by customer id
        [HttpGet("GetOrderByCustomerId/{customerId}")]
            public async Task<IActionResult> GetOrderByCustomerId(int customerId)
        {
            var response = await orderService.GetOrderByCustomerId(customerId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        [HttpGet("GetOrdersDetailByOrderId/{orderId}")]
        public async Task<IActionResult> GetOrdersDetailByOrderId(int orderId)
        {
            var response = await orderService.GetOrderDetailByOrderId(orderId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }
    }
}
