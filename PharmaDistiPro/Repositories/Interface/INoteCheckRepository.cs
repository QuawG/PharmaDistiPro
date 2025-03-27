using PharmaDistiPro.Models;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface INoteCheckRepository
    {
        Task<int> CreateCheckNote(NoteCheck noteCheck);
        Task CreateCheckNoteDetails(List<NoteCheckDetail> details);
        Task<ProductLot> GetProductLotById(int productLotId);
        Task<bool> StorageRoomExists(int storageRoomId);
        Task<NoteCheck> GetCheckNoteById(int noteCheckId);
        Task<List<NoteCheckDetail>> GetCheckNoteDetailsByCheckNoteId(int noteCheckId);
        Task UpdateProductLot(ProductLot productLot);
        Task UpdateCheckNote(NoteCheck noteCheck);
        Task UpdateCheckNoteDetails(List<NoteCheckDetail> details);
    }
}
