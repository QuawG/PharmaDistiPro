using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class Order
    {
        public Order()
        {
            IssueNotes = new HashSet<IssueNote>();
            OrdersDetails = new HashSet<OrdersDetail>();
        }

        [Key]
        public int OrderId { get; set; }
        [StringLength(50)]
        public string? OrderCode { get; set; }
        public int? CustomerId { get; set; }
        [Column(TypeName = "date")]
        public DateTime? UpdatedStatusDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? StockReleaseDate { get; set; }
        public double? TotalAmount { get; set; }
        public int? Status { get; set; }
        public double? DeliveryFee { get; set; }
        public string? Address { get; set; }
        public int? ConfirmedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }
        public int? AssignTo { get; set; }

        [ForeignKey("AssignTo")]
        [InverseProperty("OrderAssignToNavigations")]
        public virtual User? AssignToNavigation { get; set; }
        [ForeignKey("ConfirmedBy")]
        [InverseProperty("OrderConfirmedByNavigations")]
        public virtual User? ConfirmedByNavigation { get; set; }
        [ForeignKey("CustomerId")]
        [InverseProperty("OrderCustomers")]
        public virtual User? Customer { get; set; }
        [InverseProperty("Order")]
        public virtual ICollection<IssueNote> IssueNotes { get; set; }
        [InverseProperty("Order")]
        public virtual ICollection<OrdersDetail> OrdersDetails { get; set; }
    }
}
