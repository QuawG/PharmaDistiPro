using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class OrdersDetail
    {
        [Key]
        public int OrderDetailId { get; set; }
        public int? OrderId { get; set; }
        [Column("ProductID")]
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }

        [ForeignKey("OrderId")]
        [InverseProperty("OrdersDetails")]
        public virtual Order? Order { get; set; }
        [ForeignKey("ProductId")]
        [InverseProperty("OrdersDetails")]
        public virtual Product? Product { get; set; }
    }
}
