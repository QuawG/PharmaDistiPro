using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface IPurchaseOrderRepository : IRepository<PurchaseOrder>
    {
        Task<int> GetMaxOrderId();
    }
}
