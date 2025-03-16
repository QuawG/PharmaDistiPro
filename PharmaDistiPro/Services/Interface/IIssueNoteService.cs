using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IIssueNoteService
    {
        public Task<Response<IssueNoteDto>> CreateIssueNote(int orderId);
        public Task<Response<IssueNoteDto>> CancelIssueNote(int issueNoteId);

        public Task<Response<IEnumerable<IssueNoteDto>>> GetIssueNoteByWarehouseId(int userId);

        public Task<Response<IEnumerable<IssueNoteDto>>> GetIssueNoteList();
    }
}
