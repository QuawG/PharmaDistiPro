using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;

namespace PharmaDistiPro.Repositories.Interface
{
    public interface INoteCheckRepository : IRepository<NoteCheck>
    {
        Task<NoteCheckDetail> GetDetailByIdAsync(int noteCheckDetailId);
        Task InsertNoteCheckAsync(NoteCheck notecheck);
        Task UpdateDetailAsync(NoteCheckDetail noteCheckDetail);
    }
}
