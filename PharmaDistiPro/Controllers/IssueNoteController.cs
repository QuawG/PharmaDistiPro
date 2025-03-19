using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IssueNoteController : ControllerBase
    {
        private readonly IIssueNoteService  _issueNoteService;
        public IssueNoteController(IIssueNoteService issueNoteService)
        {
            _issueNoteService = issueNoteService;
        }

        [HttpPost("CreateIssueNote/{orderId}")]
        public async Task<IActionResult> CreateIssueNote(int orderId)
        {
            var response = await _issueNoteService.CreateIssueNote(orderId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        [HttpPut("CancelIssuteNot/{issueNoteId}")]
        public async Task<IActionResult> CancelIssueNote(int issueNoteId)
        {
            var response = await _issueNoteService.CancelIssueNote(issueNoteId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        [HttpGet("GetIssueNoteList")]
        public async Task<IActionResult> GetIssueNoteList()
        {
            var response = await _issueNoteService.GetIssueNoteList();
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }
        [HttpGet("GetIssueNoteListByWarehouse/{userId}")]
        public async Task<IActionResult> GetIssueNoteListByWarehouse(int userId)
        {
            var response = await _issueNoteService.GetIssueNoteByWarehouseId(userId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }


        [HttpGet("GetIssueNoteDetailByIssueNoteId/{issueNoteId}")]
        public async Task<IActionResult> GetIssueNoteDetailByIssueNoteId(int issueNoteId)
        {
            var response = await _issueNoteService.GetIssueNoteDetailByIssueNoteId(issueNoteId);
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

        [HttpGet("GetIssueNoteDetailsList")]
        public async Task<IActionResult> GetIssueNoteDetailsList()
        {
            var response = await _issueNoteService.GetIssueNoteDetailsList();
            if (!response.Success)
            {
                return NotFound(new { response.Message });
            }
            return Ok(response);
        }

    }
}
