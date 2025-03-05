using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUser(string email, string password);
        Task<User> GetUserByEmail(string email);

        Task<User> UpdateUser(User user);
        Task<User> GetUserByRefreshToken(string refreshToken);
    }
}
