using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ProductLot
    {
        public ProductLot()
        {
            IssueNoteDetails = new HashSet<IssueNoteDetail>();
            NoteCheckDetails = new HashSet<NoteCheckDetail>();
            OrdersDetails = new HashSet<OrdersDetail>();
            ProductStorageRooms = new HashSet<ProductStorageRoom>();
            PurchaseOrdersDetails = new HashSet<PurchaseOrdersDetail>();
            ReceiveNoteDetails = new HashSet<ReceiveNoteDetail>();
        }

        public int ProductLotId { get; set; }
        public int? ProductId { get; set; }
        public int? LotId { get; set; }
        public DateTime? ManufacturedDate { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public DateTime? SupplyDate { get; set; }
        public int? Quantity { get; set; }
        public int? Status { get; set; }

        public virtual Lot? Lot { get; set; }
        public virtual Product? Product { get; set; }
        public virtual ICollection<IssueNoteDetail> IssueNoteDetails { get; set; }
        public virtual ICollection<NoteCheckDetail> NoteCheckDetails { get; set; }
        public virtual ICollection<OrdersDetail> OrdersDetails { get; set; }
        public virtual ICollection<ProductStorageRoom> ProductStorageRooms { get; set; }
        public virtual ICollection<PurchaseOrdersDetail> PurchaseOrdersDetails { get; set; }
        public virtual ICollection<ReceiveNoteDetail> ReceiveNoteDetails { get; set; }
    }
}
