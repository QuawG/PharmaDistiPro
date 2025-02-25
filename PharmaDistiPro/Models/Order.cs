﻿using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class Order
    {
        public Order()
        {
            OrdersDetails = new HashSet<OrdersDetail>();
        }

        public int Id { get; set; }
        public string? OrderCode { get; set; }
        public int? CustomerId { get; set; }
        public DateTime? Date { get; set; }
        public DateTime? ExportDate { get; set; }
        public double? TotalAmount { get; set; }
        public int? Status { get; set; }
        public double? DeliveryFee { get; set; }
        public string? Address { get; set; }

        public virtual ICollection<OrdersDetail> OrdersDetails { get; set; }
    }
}
