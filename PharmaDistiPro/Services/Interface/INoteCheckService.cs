using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.DTO.NoteChecks;

namespace PharmaDistiPro.Services.Interface
{
    public interface INoteCheckService
    {
        Task<NoteCheckDTO> CreateNoteCheckAsync(NoteCheckRequestDTO request);
        Task<List<NoteCheckDetailsDTO>> GetAllDamagedItemsAsync();
        Task<List<NoteCheckDetailsDTO>> GetUnprocessedDamagedItemsAsync(int noteCheckId);
        Task<NoteCheckDetailsDTO> MarkDamagedItemProcessedAsync(int noteCheckDetailId);
    }
}
