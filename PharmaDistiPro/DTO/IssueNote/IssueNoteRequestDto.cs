     namespace PharmaDistiPro.DTO.IssueNote
{
    public class IssueNoteRequestDto
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

        public virtual ICollection<IssueNoteDetailRequestDto> IssueNoteDetails { get; set; } = new List<IssueNoteDetailRequestDto>();
    }

    public class IssueNoteDetailRequestDto
    {
        public int Id { get; set; }
        public int? IssueNoteId { get; set; }
        public string? NoteNumber { get; set; }
        public int? ProductLotId { get; set; }
    }
}
