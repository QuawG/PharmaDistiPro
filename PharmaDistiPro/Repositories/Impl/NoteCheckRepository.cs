using Microsoft.EntityFrameworkCore;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Infrastructures;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.Repositories.Impl
{
    public class NoteCheckRepository : RepositoryBase<NoteCheck>, INoteCheckRepository
    {

        public NoteCheckRepository(SEP490_G74Context context) : base(context)
        {

        }

        public async Task UpdateDetailAsync(NoteCheckDetail noteCheckDetail)
        {
            _context.NoteCheckDetails.Update(noteCheckDetail);
            await _context.SaveChangesAsync();
        }
        public async Task<NoteCheckDetail> GetDetailByIdAsync(int noteCheckDetailId)
        {
            return await _context.NoteCheckDetails
                .Include(ncd => ncd.ProductLot)
                .FirstOrDefaultAsync(ncd => ncd.NoteCheckDetailId == noteCheckDetailId);
        }
        public async Task InsertNoteCheckAsync(NoteCheck notecheck)
        {
            // Lấy ngày từ CreatedDate (nếu null thì lấy ngày hiện tại)
            var createdDate = notecheck.CreatedDate ?? DateTime.Now;

            // Lấy số thứ tự lớn nhất trong ngày hiện tại
            var maxNoteCheckNumber = await GetMaxNoteCheckNumberByDate(createdDate);

            // Tạo số thứ tự tiếp theo
            var nextNoteCheckNumber = (maxNoteCheckNumber + 1).ToString();

            // Nếu số thứ tự nhỏ hơn 100, đảm bảo có ít nhất 3 chữ số (001 -> 099, 100 giữ nguyên)
            if (maxNoteCheckNumber + 1 < 100)
            {
                nextNoteCheckNumber = nextNoteCheckNumber.PadLeft(3, '0');
            }

            //Tạo mã đơn hàng theo format mong muốn
            notecheck.NoteCheckCode = $"{ConstantStringHelper.OrderCode}{createdDate:ddMMyyyy}{nextNoteCheckNumber}";

            // Chèn vào DB
            await _context.NoteChecks.AddAsync(notecheck);
            await _context.SaveChangesAsync();
        }

        // Lấy số thứ tự lớn nhất trong ngày hiện tại
        public async Task<int> GetMaxNoteCheckNumberByDate(DateTime createdDate)
        {
            // Tạo prefix chính xác dựa trên ngày tạo
            var noteCheckCodePattern = $"{ConstantStringHelper.NoteCheckCode}{createdDate:ddMMyyyy}";

            // Lọc các đơn kiểm hàng theo ngày tháng năm, bỏ qua giờ phút giây
            var latestNoteCheck = await _context.NoteChecks
                .Where(o => o.CreatedDate.HasValue &&
                            o.CreatedDate.Value.Year == createdDate.Year &&
                            o.CreatedDate.Value.Month == createdDate.Month &&
                            o.CreatedDate.Value.Day == createdDate.Day &&
                            o.NoteCheckCode.StartsWith(noteCheckCodePattern)) // Chỉ lấy các NoteCheckCode hợp lệ
                .OrderByDescending(o => o.NoteCheckCode)
                .FirstOrDefaultAsync();

            // Nếu không có đơn kiểm nào trong ngày, bắt đầu từ 0
            if (latestNoteCheck == null)
                return 0;

            // Lấy phần số thứ tự của NoteCheckCode
            var lastNoteCheckNumberStr = latestNoteCheck.NoteCheckCode.Substring(noteCheckCodePattern.Length);

            // Kiểm tra nếu không thể chuyển đổi thành số thì reset về 0
            return int.TryParse(lastNoteCheckNumberStr, out int noteCheckNumber) ? noteCheckNumber : 0;
        }



    }
}
