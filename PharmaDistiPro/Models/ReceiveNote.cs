using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ReceiveNote
    {
        public int? Id { get; set; }
        public int? OrderId { get; set; }
        public int? SupplierId { get; set; }
        public DateTime? Date { get; set; }
        public double? TotalAmount { get; set; }
        public int? Status { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual ReceiveNoteDetail? IdNavigation { get; set; }
        public virtual Order? Order { get; set; }
        public virtual Supplier? Supplier { get; set; }
    }
}
