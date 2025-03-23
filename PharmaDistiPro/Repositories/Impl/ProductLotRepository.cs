using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class ProductLotRepository : RepositoryBase<ProductLot>, IProductLotRepository
    {
        public ProductLotRepository(SEP490_G74Context context) : base(context)
        {
        }

        public async Task<ProductLot> CreateProductLot(ProductLot ProductLot)
        {
            _context.ProductLots.Add(ProductLot);
            int rowAffected = await _context.SaveChangesAsync();
            
            return await GetProductLotById(ProductLot.ProductLotId);
        }

        public async Task<Lot> GetLotById(int id)
        {
            return await _context.Lots.FirstOrDefaultAsync(x => x.LotId == id);
        }

        public async Task<ProductLot> GetProductLotById(int id)
        {
            return await _context.ProductLots.Include(pl => pl.Product).Include(pl => pl.Lot).FirstOrDefaultAsync(x => x.ProductLotId == id);
        }

        public async Task<List<ProductLot>> GetProductLotList()
        {
            return await _context.ProductLots.Include(pl => pl.Product).Include(pl => pl.Lot).ToListAsync();
        }

        public  async Task<ProductLot> UpdateProductLot(ProductLot ProductLot)
        {
            _context.ProductLots.Update(ProductLot);
            int rowAffected = await _context.SaveChangesAsync();
            return await GetProductLotById(ProductLot.ProductLotId);
        }
    }
}
