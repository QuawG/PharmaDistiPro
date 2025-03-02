using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface ISupplierRepository : IRepository<Supplier>
    {
        Task<Supplier> GetSupplier(string SupplierName, string SupplierCode, string SupplierAddress, string SupplierPhone);
    }
}
