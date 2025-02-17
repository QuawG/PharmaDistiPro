using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(SEP490_G74Context context) : base(context)
        {
        }

        public async Task<User> GetUser(string email, string password)
        {
            return await _context.Users.FirstAsync(u => u.Email == email && u.Password == password);
        }
    }
}
