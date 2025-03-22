using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.PurchaseOrders;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IPurchaseOrderService _purchaseOrderService;
        public PurchaseOrdersController(IPurchaseOrderService purchaseOrderService)
        {
            _purchaseOrderService = purchaseOrderService;
        }

        [HttpPost("CreatePurchaseOrders")]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody]PurchaseOrdersRequestDto purchaseOrdersRequestDto)
        {
            var response = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrdersRequestDto);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }

        [HttpPut("UpdatePurchaseOrderStatus/{poId}/{status}")]
        public async Task<IActionResult> UpdatePurchaseOrderStatus(int poId, int status)
        {
            var response = await _purchaseOrderService.UpdatePurchaseOrderStatus(poId, status);
            if (response.Success)
            {
                return Ok(response);
            }
            return BadRequest(response);
        }
    }
}
