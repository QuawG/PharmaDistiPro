namespace PharmaDistiPro.DTO.Products
{
    public class ProductInputRequest
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
        public FormFile? Image { get; set; }
        public double? Vat { get; set; }
        public int? Storageconditions { get; set; }
    }
}
