using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductLotController : ControllerBase
    {
        private readonly IProductLotService _productLotService;

        public ProductLotController(IProductLotService productLotService)
        {
            _productLotService = productLotService;
        }
        [HttpGet]
        public async Task<ActionResult<List<ProductLotResponse>>> GetProductLots()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }
            var response = await _productLotService.GetProductLotList();
            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductLotById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }
            var response = await _productLotService.GetProductLotById(id);
            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
        }
        [HttpPost]
        public async Task<IActionResult> CreateProductLot([FromBody] ProductLotRequest productLot)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }
            var response = await _productLotService.CreateProductLot(productLot);
            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
        }
        [HttpPut]
        public async Task<IActionResult> UpdateProductLot([FromBody] ProductLotRequest productLot)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }
            var response = await _productLotService.UpdateProductLot(productLot);
            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
        }
    }
}
