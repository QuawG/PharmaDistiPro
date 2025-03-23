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
                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();

                //Lưu refresh token vào database
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpriedTime = DateTime.UtcNow.AddDays(7); // Refresh token sống 7 ngày
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
                Message = "User does not exist"
            };
        }
        #endregion
        private string GenerateAccessToken(User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.UserName),
        new Claim(ClaimTypes.Role, user.Role.RoleName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName),
        new Claim("UserId", user.UserId.ToString())
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

            if (user == null || user.RefreshTokenExpriedTime <= DateTime.UtcNow)
            {
                response = new Response<LoginResponse>
                {
                    StatusCode = 401,
                    Message = "Invalid refresh token"
                };
                return response;
            }

            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Cập nhật refresh token mới
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpriedTime = DateTime.UtcNow.AddDays(7);
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
            if (user.ResetPasswordOtp != resetPasswordRequest.OTP)
            {
                response = new Response<ResetPasswordResponse>
                {
                    StatusCode = 400,
                    Message = "Invalid OTP"
                };
                return response;
            }
            if (user.ResetpasswordOtpexpriedTime < DateTime.Now)
            {
                response = new Response<ResetPasswordResponse>
                {
                    StatusCode = 400,
                    Message = "OTP expired"
                };
                return response;
            }
            user.Password = resetPasswordRequest.Password;
            user.ResetPasswordOtp = null;
            user.ResetpasswordOtpexpriedTime = null;
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

        public async Task<User> UpdateUser(User user)
        {
            return await _userRepository.UpdateUser(user);
        }
    }
}
