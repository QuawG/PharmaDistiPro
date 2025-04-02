using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class ProductRepository : RepositoryBase<Product>, IProductRepository
    {
        public ProductRepository(SEP490_G74Context context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetAllAsyncProduct()
        {
            return await _context.Products
                .Include(p => p.Category) // Bảo đảm load thông tin Category
                .ToListAsync();
        }


        public async Task<Product> GetByIdAsyncProduct(object id)
        {
            if (id == null)
            {
                return null; // Or handle the error as per your requirement
            }

            return await _context.Products
                                  .Include(p => p.Category)  // Ensure Category is included
                                  .FirstOrDefaultAsync(p => p.ProductId == (int)id);  // Using FirstOrDefaultAsync for more explicit control
        }
    }

}
