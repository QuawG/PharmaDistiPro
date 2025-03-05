using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IUserService
    {
        Task<Services.Response<LoginResponse>> Logout([FromBody] string refreshToken);
        Task<Services.Response<LoginResponse>> RefreshToken(TokenModel tokenModel);
        Task<User> getUserByEmail(string email);
        Task<Services.Response<LoginResponse>> Login(LoginRequest loginModel);
        Task<Services.Response<ResetPasswordResponse>> ResetPassword(ResetPasswordRequest resetPasswordRequest);
    }
}
