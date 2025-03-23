using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class Supplier
    {
        public Supplier()
        {
            PurchaseOrders = new HashSet<PurchaseOrder>();
        }

        [Key]
        public int Id { get; set; }
        public string? SupplierName { get; set; }
        [StringLength(50)]
        public string? SupplierCode { get; set; }
        public string? SupplierAddress { get; set; }
        [StringLength(50)]
        public string? SupplierPhone { get; set; }
        public bool? Status { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("Suppliers")]
        public virtual User? CreatedByNavigation { get; set; }
        [InverseProperty("Supplier")]
        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; }
    }
}
