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

        public async Task<User> GetUser(string email, string password)
        {
            return await _context.Users.FirstAsync(u => u.Email == email && u.Password == password);
        }

        public async Task<User?> GetWarehouseManagerToConfirm()
        {
            var warehouseWithoutIssueNotes = await _context.Users
                .Where(x => x.RoleId == 2 && !x.IssueNoteCreatedByNavigations.Any()) // Chỉ lấy warehouse chưa có phiếu xuất kho
                .FirstOrDefaultAsync(); // Lấy warehouse đầu tiên nếu có

            if (warehouseWithoutIssueNotes != null)
            {
                return warehouseWithoutIssueNotes; // Nếu có warehouse chưa có phiếu xuất kho thì trả về nó
            }

            // Nếu tất cả warehouse đều có phiếu xuất kho, tìm warehouse có ít phiếu nhất
            var warehouseWithMinIssueNotes = await _context.Users
                .Where(x => x.RoleId == 2)
                .OrderBy(x => x.IssueNoteCreatedByNavigations.Count) // Sắp xếp theo số lượng phiếu xuất kho tăng dần
                .ThenBy(x => x.UserId) // Nếu số lượng bằng nhau, lấy warehouse có UserId nhỏ nhất
                .FirstOrDefaultAsync();

            return warehouseWithMinIssueNotes;
        }
    }
}
