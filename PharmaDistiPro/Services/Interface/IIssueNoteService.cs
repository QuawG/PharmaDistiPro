using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.IssueNoteDetails;
using PharmaDistiPro.Models;

namespace PharmaDistiPro.Services.Interface
{
    public interface IIssueNoteService
    {
        #region issue note
        public Task<Response<IssueNoteDto>> CreateIssueNote(int orderId);
        public Task<Response<IssueNoteDto>> CancelIssueNote(int issueNoteId);
        public Task<Response<IEnumerable<IssueNoteDto>>> GetIssueNoteByWarehouseId(int userId);
        public Task<Response<IEnumerable<IssueNoteDto>>> GetIssueNoteList();

        #endregion

        #region issue note detail
        public Task<Response<IEnumerable<IssueNoteDetailDto>>> GetIssueNoteDetailsList();

        public Task<Response<IEnumerable<IssueNoteDetailDto>>> GetIssueNoteDetailByIssueNoteId(int issueNoteId);
        #endregion
    }
}
