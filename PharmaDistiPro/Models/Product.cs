using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class Product
    {
        public Product()
        {
            OrdersDetails = new HashSet<OrdersDetail>();
        }

        public int Id { get; set; }
        public string? ProductCode { get; set; }
        public int? ManufactureId { get; set; }
        public string? ProductName { get; set; }
        public int? UnitId { get; set; }
        public int? CategoryId { get; set; }
        public string? Description { get; set; }
        public int? SupplierId { get; set; }
        public double? ImportRetailPrice { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? Status { get; set; }
        public string? Image { get; set; }
        public double? Vat { get; set; }
        public int? Storageconditions { get; set; }

        public virtual Category? Category { get; set; }
        public virtual User? CreatedByNavigation { get; set; }
        public virtual Manufacture? Manufacture { get; set; }
        public virtual Supplier? Supplier { get; set; }
        public virtual Unit? Unit { get; set; }
        public virtual ICollection<OrdersDetail> OrdersDetails { get; set; }
    }
}
