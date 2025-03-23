using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.DTO.ReceivedNotes;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Interface;
using System.Net.WebSockets;

namespace PharmaDistiPro.Services.Impl
{
    public class ReceivedNoteService : IReceivedNoteService
    {
        private readonly IReceivedNoteRepository _receivedNoteRepository;

        public ReceivedNoteService(IReceivedNoteRepository receivedNoteRepository)
        {
            _receivedNoteRepository = receivedNoteRepository;
        }

        public async Task<Response<ReceivedNote>> CreateReceiveNote(ReceivedNoteRequest ReceiveNote)
        {
            var purchaseOrder = await _receivedNoteRepository.GetPurchaseOrderById(ReceiveNote.PurchaseOrderId);
            if (purchaseOrder == null)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Không tìm thấy đơn đặt hàng!",
                    StatusCode = 404
                };
            }
            ReceivedNote receiveNoteNew = new ReceivedNote
            {
                ReceiveNotesCode = ReceiveNote.ReceiveNotesCode,
                CreatedDate = ReceiveNote.CreatedDate,
                PurchaseOrderId = ReceiveNote.PurchaseOrderId,
                CreatedBy = ReceiveNote.CreatedBy,
                Status = ReceiveNote.Status,
                DeliveryPerson = ReceiveNote.DeliveryPerson
            };
            receiveNoteNew = await _receivedNoteRepository.CreateReceivedNote(receiveNoteNew);
            if(receiveNoteNew == null)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Lỗi khi tạo phiếu nhập!",
                    StatusCode = 500
                };
            }

            foreach (var item in ReceiveNote.ReceivedNoteDetail)
            {
                ProductLot productLotUpdate = await _receivedNoteRepository.GetProductLotById(item.ProductLotId);
                if (productLotUpdate == null)
                {
                    return new Response<ReceivedNote>
                    {
                        Success = false,
                        Message = "Không tìm thấy lô hàng!",
                        StatusCode = 404
                    };
                }

                productLotUpdate.Quantity = productLotUpdate.Quantity + item.ActualReceived;
                productLotUpdate = await _receivedNoteRepository.UpdateProductLot(productLotUpdate);
                if (productLotUpdate == null)
                {
                    return new Response<ReceivedNote>
                    {
                        Success = false,
                        Message = "Lỗi khi cập nhật lô hàng!",
                        StatusCode = 500
                    };
                }
                ReceivedNoteDetail receivedNoteDetail = new ReceivedNoteDetail
                {
                    ReceiveNoteId = receiveNoteNew.ReceiveNoteId,
                    ProductLotId = item.ProductLotId,
                    ActualReceived = item.ActualReceived
                };
                receivedNoteDetail = await _receivedNoteRepository.CreateReceivedNoteDetail(receivedNoteDetail);
                if (receivedNoteDetail == null)
                {
                    return new Response<ReceivedNote>
                    {
                        Success = false,
                        Message = "Lỗi khi tạo chi tiết phiếu nhập!",
                        StatusCode = 500
                    };
                }
                
            }

            return new Response<ReceivedNote>
            {
                Success = true,
                Message = "Tạo phiếu nhập thành công!",
                Data = receiveNoteNew,
                StatusCode = 200
            };
        }

        //public async Task<List<ProductShortage>> CheckReceivedStockStatus(int purchaseOrderId)
        //{
        //    var purchaseOrder = await _context.PurchaseOrders
        //        .Include(po => po.PurchaseOrdersDetails)
        //        .ThenInclude(pod => pod.Product)
        //        .Include(po => po.ReceivedNotes)
        //        .ThenInclude(rn => rn.ReceivedNoteDetails)
        //        .ThenInclude(rnd => rnd.ProductLot) // Để lấy thông tin ProductId từ ProductLot
        //        .FirstOrDefaultAsync(po => po.PurchaseOrderId == purchaseOrderId);

        //    if (purchaseOrder == null)
        //        return null;

        //    var shortages = new List<ProductShortage>();

        //    // Tổng hợp số lượng đặt hàng theo sản phẩm
        //    var orderedProducts = purchaseOrder.PurchaseOrdersDetails
        //        .GroupBy(pod => pod.ProductId)
        //        .ToDictionary(g => g.Key, g => g.Sum(pod => pod.Quantity ?? 0));

        //    // Tổng hợp số lượng thực nhận theo sản phẩm từ tất cả phiếu nhập kho
        //    var receivedProducts = purchaseOrder.ReceivedNotes
        //        .SelectMany(rn => rn.ReceivedNoteDetails)
        //        .Where(rnd => rnd.ProductLot != null) // Đảm bảo ProductLot tồn tại
        //        .GroupBy(rnd => rnd.ProductLot.ProductId)
        //        .ToDictionary(g => g.Key, g => g.Sum(rnd => rnd.ActualReceived ?? 0));

        //    // Kiểm tra từng sản phẩm xem có thiếu hàng hay không
        //    foreach (var kvp in orderedProducts)
        //    {
        //        int productId = kvp.Key;
        //        int orderedQty = kvp.Value;
        //        int receivedQty = receivedProducts.ContainsKey(productId) ? receivedProducts[productId] : 0;
        //        int shortage = orderedQty - receivedQty;

        //        if (shortage > 0)
        //        {
        //            shortages.Add(new ProductShortage
        //            {
        //                ProductId = productId,
        //                ProductName = purchaseOrder.PurchaseOrdersDetails
        //                                .First(pod => pod.ProductId == productId).Product.ProductName,
        //                OrderedQuantity = orderedQty,
        //                ReceivedQuantity = receivedQty,
        //                ShortageQuantity = shortage
        //            });
        //        }
        //    }

        //    return shortages;
        //}



        public async Task<Response<ReceivedNote>> GetReceiveNoteById(int id)
        {
            if (id <= 0)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Id không hợp lệ!",
                    StatusCode = 400
                };
            }
            var receiveNote = await _receivedNoteRepository.GetReceivedNoteById(id);
            if (receiveNote == null)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Không tìm thấy phiếu nhập!",
                    StatusCode = 404
                };
            }
            return new Response<ReceivedNote>
            {
                Success = true,
                Message = "Lấy phiếu nhập thành công!",
                Data = receiveNote,
                StatusCode = 200
            };
        }

        public async Task<Response<List<ReceivedNote>>> GetReceiveNoteList()
        {
            var receiveNoteList = await _receivedNoteRepository.GetReceivedNoteList();
            if (receiveNoteList == null)
            {
                return new Response<List<ReceivedNote>>
                {
                    Success = false,
                    Message = "Không tìm thấy danh sách phiếu nhập!",
                    StatusCode = 404
                };
            }
            if(receiveNoteList.Count <= 0)
            {
                return new Response<List<ReceivedNote>>
                {
                    Success = false,
                    Message = "Danh sách phiếu nhập rỗng!",
                    StatusCode = 404
                };
            }
            return new Response<List<ReceivedNote>>
            {
                Success = true,
                Message = "Lấy danh sách phiếu nhập thành công!",
                Data = receiveNoteList,
                StatusCode = 200
            };
        }

        public async Task<Response<ReceivedNote>> CancelReceiveNote(int? ReceivedNoteId)
        {
            if (ReceivedNoteId <= 0)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Id không hợp lệ!",
                    StatusCode = 400
                };
            }
            ReceivedNote receiveNoteUpdate = await _receivedNoteRepository.GetReceivedNoteById(ReceivedNoteId);
            if (receiveNoteUpdate == null)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Không tìm thấy phiếu nhập!",
                    StatusCode = 404
                };
            }
            
            

            receiveNoteUpdate.Status = -1;

            receiveNoteUpdate = await _receivedNoteRepository.UpdateReceivedNote(receiveNoteUpdate);
            if (receiveNoteUpdate == null)
            {
                return new Response<ReceivedNote>
                {
                    Success = false,
                    Message = "Lỗi khi cập nhật phiếu nhập!",
                    StatusCode = 500
                };
            }
            return new Response<ReceivedNote>
            {
                Success = true,
                Message = "Cập nhật phiếu nhập thành công!",
                Data = receiveNoteUpdate,
                StatusCode = 200
            };

        }
    }
}
