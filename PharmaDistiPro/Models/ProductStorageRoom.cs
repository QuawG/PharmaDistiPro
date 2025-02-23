using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ProductStorageRoom
    {
        public int Id { get; set; }
        public int? RoomId { get; set; }
        public int? GoodsId { get; set; }

        public virtual Good? Goods { get; set; }
        public virtual StorageRoom? Room { get; set; }
    }
}
