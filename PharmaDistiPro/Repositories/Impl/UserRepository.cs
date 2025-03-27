using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Common.Enums;
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

        public async Task<User?> GetWarehouseManagerToConfirm()
        {
            // Lấy warehouse chưa có order nào, ưu tiên warehouse có UserId nhỏ nhất
            var warehouseWithoutOrders = await _context.Users
                .Where(x => x.RoleId == 2 && !x.OrderAssignToNavigations.Any() && x.Status==true) // Warehouse chưa có order nào
                .OrderBy(x => x.UserId) // Sắp xếp theo UserId
                .FirstOrDefaultAsync();

            if (warehouseWithoutOrders != null)
            {
                return warehouseWithoutOrders; // Nếu có warehouse chưa có order, trả về nó
            }

            // Nếu tất cả warehouse đã có order, tìm warehouse có ít order nhất, nếu bằng nhau thì lấy warehouse có UserId nhỏ nhất
            var warehouseWithMinOrders = await _context.Users
                .Where(x => x.RoleId == 2)
                .OrderBy(x => x.OrderAssignToNavigations.Count) // Sắp xếp theo số lượng order tăng dần
                .ThenBy(x => x.UserId) // Nếu số lượng order bằng nhau, lấy warehouse có UserId nhỏ nhất
                .FirstOrDefaultAsync();

            return warehouseWithMinOrders;
        }
        public async Task<User> GetUser(string username, string password)
        {
            return await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.UserName.Equals(username) && u.Password.Equals(password));
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
