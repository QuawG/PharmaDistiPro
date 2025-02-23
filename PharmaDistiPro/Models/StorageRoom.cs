using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class StorageRoom
    {
        public StorageRoom()
        {
            ProductStorageRooms = new HashSet<ProductStorageRoom>();
        }

        public int Id { get; set; }
        public string? StorageRoomCode { get; set; }
        public string? StorageRoomName { get; set; }
        public double? Humidity { get; set; }
        public double? Temperature { get; set; }
        public int? Quantity { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual ICollection<ProductStorageRoom> ProductStorageRooms { get; set; }
    }
}
