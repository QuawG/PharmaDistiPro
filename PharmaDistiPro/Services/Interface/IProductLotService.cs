using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IProductLotService
    {
        Task<Services.Response<List<ProductLotResponse>>> GetProductLotList();
        Task<Services.Response<ProductLotResponse>> CreateProductLot(ProductLotRequest ProductLot);

        Task<Services.Response<ProductLotResponse>> UpdateProductLot(ProductLotRequest ProductLot);

        Task<Services.Response<ProductLotResponse>> GetProductLotById(int id);

    }
}
