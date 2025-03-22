namespace PharmaDistiPro.DTO.PurchaseOrders
{
    public class PurchaseOrdersRequestDto
    {

        public int PurchaseOrderId { get; set; }
        public string? PurchaseOrderCode { get; set; }
        public int? SupplierId { get; set; }
        public DateTime? UpdatedStatusDate { get; set; }
        public DateTime? StockReleaseDate { get; set; }
        public double? TotalAmount { get; set; }
        public int? Status { get; set; }
        public double? DeliveryFee { get; set; }
        public string? Address { get; set; }
        public int? CreatedBy { get; set; }
        public string? CreateDate { get; set; }
        public virtual ICollection<PurchaseOrdersDetailsRequestDto> PurchaseOrdersDetails { get; set; }
    }

    public class PurchaseOrdersDetailsRequestDto
    {
        public int PurchaseOrderDetailId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }

    }
}
