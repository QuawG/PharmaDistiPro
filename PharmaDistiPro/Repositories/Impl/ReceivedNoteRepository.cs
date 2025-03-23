using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Repositories.Impl
{
    public class ReceivedNoteRepository : RepositoryBase<ReceivedNote>, IReceivedNoteRepository
    {
        public ReceivedNoteRepository(SEP490_G74Context context) : base(context)
        {
        }

        public async Task<ReceivedNote> CreateReceivedNote(ReceivedNote ReceiveNote)
        {
            _context.ReceivedNotes.Add(ReceiveNote);
            int rowAffected = _context.SaveChanges();
            return await GetReceivedNoteById(ReceiveNote.ReceiveNoteId);
        }
        public Task<PurchaseOrder> GetPurchaseOrderById(int? id)
        {
            return _context.PurchaseOrders.FirstOrDefaultAsync(x => x.PurchaseOrderId == id);
        }

        public async Task<ReceivedNote> GetReceivedNoteById(int? id)
        {
            return await _context.ReceivedNotes.FirstOrDefaultAsync(x => x.ReceiveNoteId == id);
        }
        
        public Task<List<ReceivedNote>> GetReceivedNoteList()
        {
            return _context.ReceivedNotes.ToListAsync();
        }

        public Task<ReceivedNote> UpdateReceivedNote(ReceivedNote ReceiveNote)
        {
            _context.ReceivedNotes.Update(ReceiveNote);
            int rowAffected = _context.SaveChanges();
            return GetReceivedNoteById(ReceiveNote.ReceiveNoteId);
        }

        public async Task<ReceivedNoteDetail> CreateReceivedNoteDetail(ReceivedNoteDetail ReceiveNoteDetail)
        {
            _context.ReceivedNoteDetails.Add(ReceiveNoteDetail);
            int rowAffected = await _context.SaveChangesAsync();
            return ReceiveNoteDetail;
        }

        public async Task<ProductLot> GetProductLotById(int? id)
        {
            return await _context.ProductLots.FirstOrDefaultAsync(x => x.ProductLotId == id);
        }

        public async Task<ProductLot> UpdateProductLot(ProductLot ProductLot)
        {
            _context.ProductLots.Update(ProductLot);
            int rowAffected = await _context.SaveChangesAsync();
            return ProductLot;
        }
    }
    
}
