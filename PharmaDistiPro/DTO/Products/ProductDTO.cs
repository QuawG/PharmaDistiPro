using PharmaDistiPro.Models;

namespace PharmaDistiPro.DTO.Products
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public string? ProductCode { get; set; }
        public string? ManufactureName { get; set; }
        public string? ProductName { get; set; }
        public int? UnitId { get; set; }
        public int? CategoryId { get; set; }
        public string? Description { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool? Status { get; set; }
        public string? Image { get; set; }
        public double? Vat { get; set; }
        public int? Storageconditions { get; set; }

        public virtual Category? Category { get; set; }
        public virtual User? CreatedByNavigation { get; set; }
        public virtual Unit? Unit { get; set; }
        public virtual ICollection<ProductLot> ProductLots { get; set; }
    }
}
