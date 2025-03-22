using AutoMapper;
using PharmaDistiPro.DTO.PurchaseOrders;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Services.Impl
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly IPurchaseOrdersDetailRepository _purchaseOrdersDetailRepository;
        private readonly IMapper _mapper;

        public PurchaseOrderService(IPurchaseOrderRepository purchaseOrderRepository, IPurchaseOrdersDetailRepository purchaseOrdersDetailRepository, IMapper mapper)
        {
            _purchaseOrderRepository = purchaseOrderRepository;
            _purchaseOrdersDetailRepository = purchaseOrdersDetailRepository;
            _mapper = mapper;
        }

        public async Task<Response<PurchaseOrdersDto>> CreatePurchaseOrder(PurchaseOrdersRequestDto purchaseOrdersRequestDto)
        {
            var response = new Response<PurchaseOrdersDto>();
            try
            {
                // Tạo PurchaseOrder
                var purchaseOrder = _mapper.Map<PurchaseOrder>(purchaseOrdersRequestDto);
                purchaseOrder.UpdatedStatusDate = DateTime.Now;
                purchaseOrder.Status = (int)PurchaseOrderStatus.DANG_XU_LY;
                purchaseOrder.CreateDate = DateTime.Now;
                purchaseOrder.PurchaseOrderCode = ConstantStringHelper.PurchaseOrderCode + (await _purchaseOrderRepository.GetMaxOrderId()+1);

                await _purchaseOrderRepository.InsertAsync(purchaseOrder);
                await _purchaseOrderRepository.SaveAsync(); // Lưu đơn hàng trước khi tạo chi tiết đơn hàng

                // Chuẩn bị danh sách PurchaseOrderDetails
                var purchaseOrderDetails = purchaseOrdersRequestDto.PurchaseOrdersDetails
                    .Select(item =>
                    {
                        var detail = _mapper.Map<PurchaseOrdersDetail>(item);
                        detail.PurchaseOrderId = purchaseOrder.PurchaseOrderId;
                        return detail;
                    }).ToList();

                // Thêm danh sách chi tiết đơn hàng cùng lúc
                await _purchaseOrdersDetailRepository.InsertRangeAsync(purchaseOrderDetails);
                await _purchaseOrdersDetailRepository.SaveAsync();

                response.Data = _mapper.Map<PurchaseOrdersDto>(purchaseOrder);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
            }

            return response;
        }

        public async Task<Response<PurchaseOrdersDto>> UpdatePurchaseOrderStatus(int poId, int status)
        {
            var response = new Response<PurchaseOrdersDto>();
            try
            {
                var purchaseOrder = await _purchaseOrderRepository.GetByIdAsync(poId);
                if (purchaseOrder == null)
                {
                    response.Message = "Không có dữ liệu";
                    response.Success = false;
                    return response;
                }

                purchaseOrder.Status = status;
                purchaseOrder.UpdatedStatusDate = DateTime.Now;

                await _purchaseOrderRepository.UpdateAsync(purchaseOrder);
                await _purchaseOrderRepository.SaveAsync();

                response.Data = _mapper.Map<PurchaseOrdersDto>(purchaseOrder);
                response.Success = true;
                return response;

            }
            catch (Exception ex)
            {
                response.Message = ex.Message;
                response.Success = false;
                return response;
            }
        }
    }
}
