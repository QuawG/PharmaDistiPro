using PharmaDistiPro.DTO.Suppliers;

namespace PharmaDistiPro.Services.Interface
{
    public interface ISupplierService
    {
        Task<Services.Response<SupplierDTO>> GetSupplierById(int supplierId);
        #region Supplier Management

        Task<Services.Response<IEnumerable<SupplierDTO>>> GetSupplierList();
        //Task<Response<SupplierDTO>> ActivateDeactivateSupplier(int supplierId, bool update);

        //Task<Response<SupplierDTO>> CreateNewSupplier(SupplierInputRequest supplier);
        //Task<Response<SupplierDTO>> GetSupplierById(int supplierId);
        //Task<Response<SupplierDTO>> UpdateSupplier(SupplierInputRequest supplier);


        #endregion

    }
}
