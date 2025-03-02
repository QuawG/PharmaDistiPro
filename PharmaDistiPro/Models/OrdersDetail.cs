using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class OrdersDetail
    {
        public int OrderDetailId { get; set; }
        public int? OrderId { get; set; }
        public int? ProductLotId { get; set; }
        public int? Quantity { get; set; }
        public double? UnitsPrice { get; set; }

        public virtual Order? Order { get; set; }
        public virtual ProductLot? ProductLot { get; set; }
    }
}
