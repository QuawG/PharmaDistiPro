using PharmaDistiPro.DTO.ReceivedNotes;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IReceivedNoteService
    {
        Task<Services.Response<List<ReceivedNote>>> GetReceiveNoteList();
        Task<Services.Response<ReceivedNote>> GetReceiveNoteById(int id);

        Task<Services.Response<ReceivedNote>> CreateReceiveNote(ReceivedNoteRequest ReceiveNote);
        Task<Services.Response<ReceivedNote>> CancelReceiveNote(int? ReceivedNoteId);

    }
}
