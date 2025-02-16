using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class IssueNoteDetail
    {
        public int Id { get; set; }
        public int? IssueNoteId { get; set; }
        public string? NoteNumber { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public double? UnitsPrice { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public int? Status { get; set; }

        public virtual IssueNote? IssueNote { get; set; }
        public virtual Product? Product { get; set; }
    }
}
