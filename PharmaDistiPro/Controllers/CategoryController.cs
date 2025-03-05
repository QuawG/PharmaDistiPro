using Microsoft.AspNetCore.Http;
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
        [HttpGet("tree")]
        public async Task<IActionResult> GetCategoryTree()
        {
            var result = await _categoryService.GetCategoryTree();
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewCategory([FromBody] CategoryInputRequest request)
        {
            var result = await _categoryService.CreateNewCategory(request);
            if (!result.Success)
            {
               
                return BadRequest(result);
            }
            return Ok(result);
        }

   
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryInputRequest request)
        {
            
            request.Id = id;

            var result = await _categoryService.UpdateCategory(request);
            if (!result.Success)
            {
                return NotFound(result);
            }
            return Ok(result);
        }

    }
}
