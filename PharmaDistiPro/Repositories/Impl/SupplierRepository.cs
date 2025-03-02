using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class SupplierRepository : RepositoryBase<Supplier>  ,ISupplierRepository
    {
        public SupplierRepository(SEP490_G74Context context) : base(context)
        {
        }
        public async Task<Supplier> GetSupplier(string SupplierName, string SupplierCode, string SupplierAddress, string SupplierPhone)
        {
            return await _context.Suppliers.FirstAsync(u => u.SupplierName == SupplierName && u.SupplierCode == SupplierCode && u.SupplierAddress == SupplierAddress && u.SupplierPhone == SupplierPhone);
        }
    }
}
