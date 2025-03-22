using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class PurchaseOrderRepository : RepositoryBase<PurchaseOrder>, IPurchaseOrderRepository
    {
        public PurchaseOrderRepository(SEP490_G74Context context) : base(context)
        {
        }
        public async Task<int> GetMaxOrderId()
        {
            return await _context.PurchaseOrders.MaxAsync(o => (int?)o.PurchaseOrderId) ?? 0;
        }
    }
}
