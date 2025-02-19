using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }   

        //get user list
        [HttpGet("GetUserList")]
        public async Task<IActionResult> GetUserList()
        {
            var response = await _userService.GetUserList();
            if (!response.Success)
            {
                return Conflict(new { response.Message }); 
            }
            return Ok(response);
        }

        //Get Customer list
        [HttpGet("GetCustomerList")]
        public async Task<IActionResult> GetCustomerList()
        {
            var response = await _userService.GetCustomerList(); 

            if (!response.Success)
            {
                return Conflict(new { response.Message }); 
            }

            return Ok(response);
        }

        // API lấy thông tin User theo Id
        [HttpGet("GetUserById/{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var response = await _userService.GetUserById(userId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }
    }
}
