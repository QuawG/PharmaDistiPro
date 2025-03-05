using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PharmaDistiPro.Services.Impl
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public UserService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        #region login
        public async Task<Response<LoginResponse>> Login(LoginRequest loginModel)
        {
            var response = new Response<LoginResponse>();
            var user = await _userRepository.GetUser(loginModel.Username, loginModel.Password);

            if (user != null)
            {
                var accessToken = GenerateAccessToken();
                var refreshToken = GenerateRefreshToken();

                // Lưu refresh token vào database
                //user.RefreshToken = refreshToken;
                //user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Refresh token sống 7 ngày
                await _userRepository.UpdateUser(user);

                var loginResponse = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };

                response = new Response<LoginResponse>
                {
                    StatusCode = 200,
                    Data = loginResponse
                };
                return response;
            }

            return new Response<LoginResponse>
            {
                StatusCode = 404,
                Message = "NOT FOUND"
            };
        }
        #endregion
        private string GenerateAccessToken()
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, "admin"),
        new Claim(ClaimTypes.Role, "admin")
    };

            var token = new JwtSecurityToken
            (
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Access token chỉ sống 15 phút
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:key"])),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
        #region refresh Token
        public async Task<Response<LoginResponse>> RefreshToken(TokenModel tokenModel)
        {
            var response = new Response<LoginResponse>();
            var user = await _userRepository.GetUserByRefreshToken(tokenModel.RefreshToken);

            //if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            //{
            //    response = new Response<LoginResponse>
            //    {
            //        StatusCode = 401,
            //        Message = "Invalid refresh token"
            //    };
            //    return response;
            //}

            var newAccessToken = GenerateAccessToken();
            var newRefreshToken = GenerateRefreshToken();

            //// Cập nhật refresh token mới
            //user.RefreshToken = newRefreshToken;
            //user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateUser(user);
            response = new Response<LoginResponse>
            {
                StatusCode = 200,
                Data = new LoginResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                }
            };
            return response;
        }
        #endregion
        #region resetpassword
        public async Task<Response<ResetPasswordResponse>> ResetPassword(ResetPasswordRequest resetPasswordRequest)
        {
            var response = new Response<ResetPasswordResponse>();
            var user = await _userRepository.GetUserByEmail(resetPasswordRequest.Email);
            if (user == null)
            {
                response = new Response<ResetPasswordResponse>
                {
                    StatusCode = 404,
                    Message = "User not found"
                };
                return response;
            }
            //if (user.ResetPasswordOTP != resetPasswordRequest.OTP)
            //{
            //    response = new Response<ResetPasswordResponse>
            //    {
            //        StatusCode = 400,
            //        Message = "Invalid OTP"
            //    };
            //    return response;
            //}
            //if (user.ResetPasswordOTPExpiry < DateTime.Now)
            //{
            //    response = new Response<ResetPasswordResponse>
            //    {
            //        StatusCode = 400,
            //        Message = "OTP expired"
            //    };
            //    return response;
            //}
            //user.Password = resetPasswordRequest.Password;
            //user.ResetPasswordOTP = null;
            //user.ResetPasswordOTPExpiry = null;
            await _userRepository.UpdateUser(user);
            response = new Response<ResetPasswordResponse>
            {
                StatusCode = 200,
                Message = "Password reset successfully"
            };
            return response;
        }
        #endregion
        #region logout

        public async Task<Response<LoginResponse>> Logout([FromBody] String refreshToken)
        {
            var response = new Response<LoginResponse>();
            var user = await _userRepository.GetUserByRefreshToken(refreshToken);
            if (user == null)
            {
                response = new Response<LoginResponse>
                {
                    StatusCode = 400,
                    Message = "Invalid request"
                };
                return response;
            }


            //user.RefreshToken = null;
            //user.RefreshTokenExpiryTime = null;
            await _userRepository.UpdateUser(user);
            response = new Response<LoginResponse>
            {
                StatusCode = 200,
                Message = "Logged out successfully"
            };
            return response;
        }

        #endregion
        public async Task<User> getUserByEmail(string email)
        {
            return await _userRepository.GetUserByEmail(email);
        }



    }
}
