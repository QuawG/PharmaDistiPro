using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly SEP490_G74Context _context;
        public UserController(IUserService userService, SEP490_G74Context context)
        {
            _userService = userService;
            _context = context;
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

        // Api create user và customer
        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromForm] UserInputRequest user)
        {
            var response = await _userService.CreateNewUserOrCustomer(user);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        //Api update user
        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromForm] UserInputRequest user)
        {
            var response = await _userService.UpdateUser(user);

            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        //Api deactivate user
        [HttpPut("ActivateDeactivateUser/{userId}/{status}")]
        public async Task<IActionResult> ActivateDeactivateUser(int userId, bool status)
        {
            var response = await _userService.ActivateDeactivateUser(userId, status);
            if (!response.Success) return BadRequest(new { response.Message });
            return Ok(response);
        }
    }
}
