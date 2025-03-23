using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.Users;

using PharmaDistiPro.Services;
using PharmaDistiPro.Services.Interface;
using System.Security.Cryptography;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;

        public UserController(IUserService userService, IEmailService emailService)
        {
            _userService = userService;
            _emailService = emailService;
        }


        #region login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest login)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _userService.Login(login);

            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, new { response.Message,  response.Data });
        }
        #endregion
        #region refreshToken
        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken(TokenModel tokenModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _userService.RefreshToken(tokenModel);

            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, response.Message);
        }
        #endregion
        #region logout
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout([FromBody] String refreshToken)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _userService.Logout(refreshToken);

            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, response.Message);
        }
        #endregion
        #region ResetPassword
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            var response = await _userService.ResetPassword(request);

            if (!response.Success)
            {
                return StatusCode(response.StatusCode, new { response.Message, response.Errors, response.Data });
            }
            return StatusCode(response.StatusCode, response.Message);
        }
        #endregion
        #region send OTP

        [HttpPost("SentOTP")]
        public async Task<IActionResult> SendOTP([FromBody] string email)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { Message = "Invalid model state", Errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }
            var response = new Services.Response<ResetPasswordResponse>();
            var user = await _userService.getUserByEmail(email);
            if (user == null)
            {
                response = new Services.Response<ResetPasswordResponse>
                {
                    StatusCode = 404,
                    Message = "User not found"
                };
                return StatusCode(response.StatusCode, response.Message);
            }
            string OTP = CreateRandomOTP();
            user.ResetPasswordOtp = OTP;
            user.ResetpasswordOtpexpriedTime = DateTime.UtcNow.AddDays(1); ;
            _userService.UpdateUser(user);
            //send email with OTP
            var emailSent = await _emailService.SendEmailAsync(email, "Your OTP Code", $"Your OTP is: {OTP}. It expires in 1 days.");

            if (!emailSent)
            {
                response = new Services.Response<ResetPasswordResponse>
                {
                    StatusCode = 500,
                    Message = "Failed to send OTP email"
                };
                return StatusCode(response.StatusCode, response.Message);
            }
            // end send email
            response = new Services.Response<ResetPasswordResponse>
            {
                StatusCode = 200,
                Message = "OTP sent successfully"
            };

            return StatusCode(response.StatusCode, response.Message);
        }
        #endregion

        private String CreateRandomOTP()
        {
            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                byte[] bytes = new byte[4];
                rng.GetBytes(bytes);
                int number = BitConverter.ToInt32(bytes, 0) & 0x7FFFFFFF;
                return (number % 1000000).ToString("D6");
            }
        }

    }
}
