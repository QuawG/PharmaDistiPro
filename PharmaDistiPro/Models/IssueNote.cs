using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class IssueNote
    {
        public IssueNote()
        {
            IssueNoteDetails = new HashSet<IssueNoteDetail>();
        }

        [Key]
        public int IssueNoteId { get; set; }
        [StringLength(50)]
        public string? IssueNoteCode { get; set; }
        public int? OrderId { get; set; }
        public int? CustomerId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedStatusDate { get; set; }
        public double? TotalAmount { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        public int? Status { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("IssueNoteCreatedByNavigations")]
        public virtual User? CreatedByNavigation { get; set; }
        [ForeignKey("CustomerId")]
        [InverseProperty("IssueNoteCustomers")]
        public virtual User? Customer { get; set; }
        [ForeignKey("OrderId")]
        [InverseProperty("IssueNotes")]
        public virtual Order? Order { get; set; }
        [InverseProperty("IssueNote")]
        public virtual ICollection<IssueNoteDetail> IssueNoteDetails { get; set; }
    }
}
