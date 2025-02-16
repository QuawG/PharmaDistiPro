using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class OrdersDetail
    {
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public int? ReceivedNoteDetailsId { get; set; }
        public int? Quantity { get; set; }
        public double? UnitsPrice { get; set; }

        public virtual Order? Order { get; set; }
        public virtual Product? ReceivedNoteDetails { get; set; }
    }
}
