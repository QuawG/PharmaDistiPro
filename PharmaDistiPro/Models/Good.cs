using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class Good
    {
        public Good()
        {
            IssueNoteDetails = new HashSet<IssueNoteDetail>();
            ProductStorageRooms = new HashSet<ProductStorageRoom>();
            ReceiveNoteDetails = new HashSet<ReceiveNoteDetail>();
        }

        public int Id { get; set; }
        public string? GoodsCode { get; set; }
        public int? Quantity { get; set; }
        public int? UnitsPrice { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual ICollection<IssueNoteDetail> IssueNoteDetails { get; set; }
        public virtual ICollection<ProductStorageRoom> ProductStorageRooms { get; set; }
        public virtual ICollection<ReceiveNoteDetail> ReceiveNoteDetails { get; set; }
    }
}
