using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface IProductLotRepository : IRepository<ProductLot>
    {

        Task<IEnumerable<ProductLot>> GetProductLotsByProductIds(List<int> productIds);
        
    }
}
