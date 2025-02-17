using PharmaDistiPro.DTO.Users;

namespace PharmaDistiPro.Services.Interface
{
    public interface IUserService
    {

        Task<LoginResponse> Login(LoginRequest loginModel);
    }
}
