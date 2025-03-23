using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class PurchaseOrder
    {
        public PurchaseOrder()
        {
            PurchaseOrdersDetails = new HashSet<PurchaseOrdersDetail>();
            ReceivedNotes = new HashSet<ReceivedNote>();
        }

        [Key]
        public int PurchaseOrderId { get; set; }
        [StringLength(50)]
        public string? PurchaseOrderCode { get; set; }
        public int? SupplierId { get; set; }
        [Column(TypeName = "date")]
        public DateTime? UpdatedStatusDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? StockReleaseDate { get; set; }
        public double? TotalAmount { get; set; }
        public int? Status { get; set; }
        public double? DeliveryFee { get; set; }
        public string? Address { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreateDate { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("PurchaseOrders")]
        public virtual User? CreatedByNavigation { get; set; }
        [ForeignKey("SupplierId")]
        [InverseProperty("PurchaseOrders")]
        public virtual Supplier? Supplier { get; set; }
        [InverseProperty("PurchaseOrder")]
        public virtual ICollection<PurchaseOrdersDetail> PurchaseOrdersDetails { get; set; }
        [InverseProperty("PurchaseOrder")]
        public virtual ICollection<ReceivedNote> ReceivedNotes { get; set; }
    }
}
