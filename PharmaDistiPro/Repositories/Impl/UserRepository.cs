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

        public async Task<User> GetUser(string username, string password)
        {
            return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName == username && u.Password == password);
        }

        public async Task<User> GetUserByRefreshToken(string refreshToken)
        {
            return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
        public async Task<User> GetUserByEmail(string email)
        {
            return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);

        }       
        public async Task<User> UpdateUser(User user)
        {

            _context.Users.Update(user);
            int rowAffected = await _context.SaveChangesAsync();
            return user;
        }
    }
}
