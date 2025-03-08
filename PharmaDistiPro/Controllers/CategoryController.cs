﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly SEP490_G74Context _context;


        public CategoryController(ICategoryService categoryService, SEP490_G74Context context)
        {
            _categoryService = categoryService;
            _context = context;
        }
        // 1. Lấy danh sách category theo cấu trúc cha-con
        [HttpGet("tree")]
        public async Task<IActionResult> GetCategoryTree()
        {
            var result = await _categoryService.GetCategoryTreeAsync();
            if (!result.Success)
            {
                return NotFound(result.Message); // Trả về NotFound với thông báo lỗi
            }
            return Ok(result);
        }

        // 2. Tạo mới category
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryInputRequest request)
        {
            var result = await _categoryService.CreateCategoryAsync(request);
            if (!result.Success)
            {
                return BadRequest(result); // Sử dụng BadRequest cho trường hợp tạo thất bại
            }
            return Ok(result);
        }

        // 3. Cập nhật category
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryInputRequest request)
        {
            request.Id = id; // Đảm bảo Id được gán từ route parameter

            var result = await _categoryService.UpdateCategoryAsync(request);
            if (!result.Success)
            {
                return BadRequest(result); // Sử dụng BadRequest thay vì NotFound cho trường hợp cập nhật thất bại
            }
            return Ok(result);
        }

        // 4. Lọc danh mục
        [HttpGet("filter")]
        public async Task<IActionResult> FilterCategories([FromQuery] string? searchTerm)
        {
            var result = await _categoryService.FilterCategoriesAsync(searchTerm);
            if (!result.Success)
            {
                return NotFound(result.Message); // Trả về NotFound với thông báo lỗi
            }
            return Ok(result);
        }

     

    }
}
