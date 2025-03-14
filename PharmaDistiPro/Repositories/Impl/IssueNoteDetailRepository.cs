using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class IssueNoteDetailRepository : RepositoryBase<IssueNoteDetail> , IIssueNoteDetailsRepository
    {
        public IssueNoteDetailRepository(SEP490_G74Context context) : base(context)
        {
        }
    }
}
