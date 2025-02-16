using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class IssueNote
    {
        public IssueNote()
        {
            IssueNoteDetails = new HashSet<IssueNoteDetail>();
        }

        public int Id { get; set; }
        public int? OrderId { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? Date { get; set; }
        public double? TotalAmount { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? Status { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual ICollection<IssueNoteDetail> IssueNoteDetails { get; set; }
    }
}
