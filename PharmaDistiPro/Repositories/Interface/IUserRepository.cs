using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> GetUser(string email, string password);
    }
}
