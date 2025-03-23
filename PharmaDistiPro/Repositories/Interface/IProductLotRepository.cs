using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Models;
namespace PharmaDistiPro.Repositories.Interface
{
    public interface IProductLotRepository : IRepository<ProductLot>
    {

        Task<List<ProductLot>> GetProductLotList();
        Task<ProductLot> GetProductLotById(int id);
        Task<ProductLot> CreateProductLot(ProductLot ProductLot);
        Task<ProductLot> UpdateProductLot(ProductLot ProductLot);
        Task<Lot> GetLotById(int id);
    }
}
