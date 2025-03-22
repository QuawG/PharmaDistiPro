using PharmaDistiPro.DTO.PurchaseOrders;

namespace PharmaDistiPro.Services.Interface
{
    public interface IPurchaseOrderService
    {
        #region purchase order
        Task<Response<PurchaseOrdersDto>> CreatePurchaseOrder(PurchaseOrdersRequestDto purchaseOrdersRequestDto);
        Task<Response<PurchaseOrdersDto>> UpdatePurchaseOrderStatus(int poId, int status);

        #endregion
    }
}
