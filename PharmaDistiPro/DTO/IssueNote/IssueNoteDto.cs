namespace PharmaDistiPro.DTO.IssueNote
{
    public class IssueNoteDto
    {
        public int Id { get; set; }
        public string? IssueNotesCode { get; set; }
        public int? OrderId { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? Date { get; set; }
        public double? TotalAmount { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? Status { get; set; }
    }
}
