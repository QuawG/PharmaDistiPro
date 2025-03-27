     namespace PharmaDistiPro.DTO.IssueNote
{
    public class IssueNoteRequestDto
    {
        public int IssueNoteId { get; set; }
        public string? IssueNoteCode { get; set; }
        public int? OrderId { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? UpdatedStatusDate { get; set; }
        public double? TotalAmount { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? Status { get; set; }


        public virtual ICollection<IssueNoteDetailRequestDto> IssueNoteDetails { get; set; } = new List<IssueNoteDetailRequestDto>();
    }

    public class IssueNoteDetailRequestDto
    {
        public int IssueNoteDetailId { get; set; }
        public int? IssueNoteId { get; set; }
        public int? ProductLotId { get; set; }
        public int? Quantity { get; set; }
    }
}
