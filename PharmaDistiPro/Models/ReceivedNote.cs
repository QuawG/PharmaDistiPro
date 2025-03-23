using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class ReceivedNote
    {
        public ReceivedNote()
        {
            ReceivedNoteDetails = new HashSet<ReceivedNoteDetail>();
        }

        [Key]
        public int ReceiveNoteId { get; set; }
        [StringLength(50)]
        public string? ReceiveNotesCode { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? Status { get; set; }
        [StringLength(50)]
        public string? DeliveryPerson { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("ReceivedNotes")]
        public virtual User? CreatedByNavigation { get; set; }
        [ForeignKey("PurchaseOrderId")]
        [InverseProperty("ReceivedNotes")]
        public virtual PurchaseOrder? PurchaseOrder { get; set; }
        [InverseProperty("ReceiveNote")]
        public virtual ICollection<ReceivedNoteDetail> ReceivedNoteDetails { get; set; }
    }
}
