using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class PurchaseOrdersDetail
    {
        [Key]
        public int PurchaseOrderDetailId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("PurchaseOrdersDetails")]
        public virtual Product? Product { get; set; }
        [ForeignKey("PurchaseOrderId")]
        [InverseProperty("PurchaseOrdersDetails")]
        public virtual PurchaseOrder? PurchaseOrder { get; set; }
    }
}
