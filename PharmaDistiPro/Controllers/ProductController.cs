﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {

        private readonly IProductService _productService;
        private readonly SEP490_G74Context _context;


        public ProductController(IProductService productService, SEP490_G74Context context)
        {
            _productService = productService;
            _context = context;
        }


        // GET: api/product
        // Lấy danh sách sản phẩm với phân trang và tìm kiếm
        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] int pageNumber = 1, [FromQuery] string? searchTerm = null)
        {
            var response = await _productService.GetProductList(pageNumber, searchTerm);
            if (!response.Success)
            {
                return NotFound(new { success = response.Success, message = response.Message });
            }
            return Ok(response);
        }

        // GET: api/product/{productId}
        // Lấy thông tin sản phẩm theo ID
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProduct(int productId)
        {
            var response = await _productService.GetProductById(productId);
            if (!response.Success)
            {
                return NotFound(new { success = response.Success, message = response.Message });
            }
            return Ok(response);
        }

        // POST: api/product
        // Tạo sản phẩm mới
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductInputRequest productInputRequest)
        {
            var response = await _productService.CreateNewProduct(productInputRequest);
            if (!response.Success)
            {
                return BadRequest(new { success = response.Success, message = response.Message });
            }
            return CreatedAtAction(nameof(GetProduct), new { productId = response.Data.ProductId }, response);
        }

        // PUT: api/product/activate/{productId}
        // Kích hoạt/Tắt sản phẩm
        [HttpPut("activate/{productId}")]
        public async Task<IActionResult> ActivateDeactivateProduct(int productId, [FromQuery] bool update)
        {
            var response = await _productService.ActivateDeactivateProduct(productId, update);
            if (!response.Success)
            {
                return NotFound(new { success = response.Success, message = response.Message });
            }
            return Ok(response);
        }

        // PUT: api/product/{productId}
        // Cập nhật sản phẩm
        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateProduct(int productId, [FromForm] ProductInputRequest productUpdateRequest)
        {
            productUpdateRequest.ProductId = productId; // Gán ID từ route vào request
            var response = await _productService.UpdateProduct(productUpdateRequest);
            if (!response.Success)
            {
                return NotFound(new { success = response.Success, message = response.Message });
            }
            return Ok(response);
        }
    }
}
