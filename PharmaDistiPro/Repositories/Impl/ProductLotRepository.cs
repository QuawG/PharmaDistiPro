using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;
using System.Linq;

namespace PharmaDistiPro.Repositories.Impl
{
    public class ProductLotRepository : RepositoryBase<ProductLot>, IProductLotRepository
    {
        public ProductLotRepository(SEP490_G74Context context) : base(context)
        {
        }
        public async Task<IEnumerable<ProductLot>> GetProductLotsByProductIds(List<int> productIds)
        {
            return await _context.ProductLots
                .Where(p => p.ProductId.HasValue && productIds.Contains(p.ProductId.Value) && p.ExpiredDate >= DateTime.Now)
                .OrderBy(p => p.ExpiredDate)
                .ToListAsync();
        }
    }
}
