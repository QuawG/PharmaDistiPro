using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class ProductStorageRoom
    {
        [Key]
        public int Id { get; set; }
        public int? StorageRoomId { get; set; }
        public int? ProductLotId { get; set; }

        [ForeignKey("ProductLotId")]
        [InverseProperty("ProductStorageRooms")]
        public virtual ProductLot? ProductLot { get; set; }
        [ForeignKey("StorageRoomId")]
        [InverseProperty("ProductStorageRooms")]
        public virtual StorageRoom? StorageRoom { get; set; }
    }
}
