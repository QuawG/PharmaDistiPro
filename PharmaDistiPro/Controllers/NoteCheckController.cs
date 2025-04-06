using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteCheckController : ControllerBase
    {
        private readonly INoteCheckService _noteCheckService;

        public NoteCheckController(INoteCheckService noteCheckService)
        {
            _noteCheckService = noteCheckService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateNoteCheck([FromBody] NoteCheckRequestDTO request)
        {
            if (request == null)
            {
                return BadRequest("Dữ liệu không hợp lệ.");
            }

            try
            {
                var result = await _noteCheckService.CreateNoteCheckAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }





        /// <summary>
        /// Đánh dấu một mục hàng hỏng đã được xử lý.
        /// </summary>
        /// <param name="noteCheckDetailId">ID của chi tiết kiểm kho</param>
        /// <returns>Thông tin chi tiết kiểm kho đã cập nhật</returns>
        [HttpPut("mark-damaged-processed/{noteCheckDetailId}")]
        public async Task<IActionResult> MarkDamagedItemProcessed(int noteCheckDetailId)
        {
            try
            {
                var result = await _noteCheckService.MarkDamagedItemProcessedAsync(noteCheckDetailId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy danh sách hàng hỏng chưa xử lý trong một lần kiểm kho.
        /// </summary>
        /// <param name="noteCheckId">ID của phiếu kiểm kho</param>
        /// <returns>Danh sách các mục hàng hỏng chưa xử lý</returns>
        [HttpGet("unprocessed-damaged-items/{noteCheckId}")]
        public async Task<IActionResult> GetUnprocessedDamagedItems(int noteCheckId)
        {
            try
            {
                var result = await _noteCheckService.GetUnprocessedDamagedItemsAsync(noteCheckId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy danh sách tất cả hàng hỏng từ các lần kiểm kho.
        /// </summary>
        /// <returns>Danh sách tất cả các mục hàng hỏng</returns>
        [HttpGet("all-damaged-items")]
        public async Task<IActionResult> GetAllDamagedItems()
        {
            try
            {
                var result = await _noteCheckService.GetAllDamagedItemsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Lỗi: {ex.Message}");
            }
        }
    }





}
