using PharmaDistiPro.DTO.Users;
using System.Text.Json.Serialization;

namespace PharmaDistiPro.DTO.Orders
{
    public class OrderDto
    {

        public int OrderId { get; set; }
        public string? OrderCode { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? UpdatedStatusDate { get; set; }
        public DateTime? StockReleaseDate { get; set; }
        public double? TotalAmount { get; set; }

        public int? Status { get; set; }
        public double? DeliveryFee { get; set; }
        public string? Address { get; set; }
        public int? ConfirmedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public double? TotalRevenue { get; set; }
        public virtual UserDTO? Customer { get; set; }

        public virtual UserDTO? ConfirmBy { get; set; }

    }
}
