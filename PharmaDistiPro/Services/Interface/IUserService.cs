using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;


namespace PharmaDistiPro.Services.Interface
{
    public interface IUserService
    {

      //  Task<LoginResponse> Login(LoginRequest loginModel);


        #region User and Customer Management
        Task<Response<IEnumerable<UserDTO>>> GetUserList();
        Task<Response<IEnumerable<UserDTO>>> GetCustomerList();

        Task<Response<UserDTO>> ActivateDeactivateUser(int userId, bool update);

        Task<Response<UserDTO>> CreateNewUserOrCustomer(UserInputRequest user);
        Task<Response<UserDTO>> GetUserById(int userId);
        Task<Response<UserDTO>> UpdateUser(UserInputRequest user);
        #endregion

    }
}
