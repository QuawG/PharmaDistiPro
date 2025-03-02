using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class PurchaseOrdersDetail
    {
        public int PurchaseOrderDetailId { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? ProductLotId { get; set; }
        public int? Quantity { get; set; }
        public double? UnitsPrice { get; set; }

        public virtual ProductLot? ProductLot { get; set; }
        public virtual PurchaseOrder? PurchaseOrder { get; set; }
    }
}
