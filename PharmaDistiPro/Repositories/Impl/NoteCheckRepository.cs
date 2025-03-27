using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class NoteCheckRepository : RepositoryBase<NoteCheck>, INoteCheckRepository
    {
    
        public NoteCheckRepository(SEP490_G74Context context) : base(context)
        {
            _context = context;
        }
        public async Task<int> CreateCheckNote(NoteCheck noteCheck)
        {
            await InsertAsync(noteCheck);
            await SaveAsync();
            return noteCheck.NoteCheckId;
        }

        public async Task CreateCheckNoteDetails(List<NoteCheckDetail> details)
        {
            await _context.NoteCheckDetails.AddRangeAsync(details);
            await _context.SaveChangesAsync();
        }

        public async Task<ProductLot> GetProductLotById(int productLotId)
        {
            return await _context.ProductLots.FindAsync(productLotId);
        }

        public async Task<bool> StorageRoomExists(int storageRoomId)
        {
            return await _context.StorageRooms.AnyAsync(sr => sr.StorageRoomId == storageRoomId);
        }

        public async Task<NoteCheck> GetCheckNoteById(int noteCheckId)
        {
            return await GetByIdAsync(noteCheckId);
        }

        public async Task<List<NoteCheckDetail>> GetCheckNoteDetailsByCheckNoteId(int noteCheckId)
        {
            return await _context.NoteCheckDetails
                .Where(ncd => ncd.NoteCheckId == noteCheckId)
                .ToListAsync();
        }

        public async Task UpdateProductLot(ProductLot productLot)
        {
            _context.ProductLots.Update(productLot);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCheckNote(NoteCheck noteCheck)
        {
            await UpdateAsync(noteCheck);
            await SaveAsync();
        }

        public async Task UpdateCheckNoteDetails(List<NoteCheckDetail> details)
        {
            _context.NoteCheckDetails.UpdateRange(details);
            await _context.SaveChangesAsync();
        }
    }
}
