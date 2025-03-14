using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class IssueNoteRepository : RepositoryBase<IssueNote> , IIssueNoteRepository
    {
        public IssueNoteRepository(SEP490_G74Context context) : base(context)
        {
        }
    }
}
