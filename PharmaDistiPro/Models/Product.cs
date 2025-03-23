using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class Product
    {
        public Product()
        {
            ImageProducts = new HashSet<ImageProduct>();
            OrdersDetails = new HashSet<OrdersDetail>();
            ProductLots = new HashSet<ProductLot>();
            PurchaseOrdersDetails = new HashSet<PurchaseOrdersDetail>();
        }

        [Key]
        public int ProductId { get; set; }
        [StringLength(50)]
        public string? ProductCode { get; set; }
        public string? ManufactureName { get; set; }
        public string? ProductName { get; set; }
        public int? UnitId { get; set; }
        public int? CategoryId { get; set; }
        public string? Description { get; set; }
        public double? SellingPrice { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        public bool? Status { get; set; }
        [Column("VAT")]
        public double? Vat { get; set; }
        public int? Storageconditions { get; set; }
        public double? Weight { get; set; }

        [ForeignKey("CategoryId")]
        [InverseProperty("Products")]
        public virtual Category? Category { get; set; }
        [ForeignKey("CreatedBy")]
        [InverseProperty("Products")]
        public virtual User? CreatedByNavigation { get; set; }
        [ForeignKey("UnitId")]
        [InverseProperty("Products")]
        public virtual Unit? Unit { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<ImageProduct> ImageProducts { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<OrdersDetail> OrdersDetails { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<ProductLot> ProductLots { get; set; }
        [InverseProperty("Product")]
        public virtual ICollection<PurchaseOrdersDetail> PurchaseOrdersDetails { get; set; }
    }
}
