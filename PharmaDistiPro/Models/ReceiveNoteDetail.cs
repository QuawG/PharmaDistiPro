using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ReceiveNoteDetail
    {
        public int Id { get; set; }
        public string? NoteNumber { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public int? UnitsPrice { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public int? Status { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? CheckedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual Product? Product { get; set; }
    }
}
