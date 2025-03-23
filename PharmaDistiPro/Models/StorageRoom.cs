using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class StorageRoom
    {
        public StorageRoom()
        {
            NoteChecks = new HashSet<NoteCheck>();
            ProductLots = new HashSet<ProductLot>();
        }

        [Key]
        public int StorageRoomId { get; set; }
        [StringLength(50)]
        public string? StorageRoomCode { get; set; }
        [StringLength(50)]
        public string? StorageRoomName { get; set; }
        public double? Humidity { get; set; }
        public double? Temperature { get; set; }
        public int? Quantity { get; set; }
        public bool? Status { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("StorageRooms")]
        public virtual User? CreatedByNavigation { get; set; }
        [InverseProperty("StorageRoom")]
        public virtual ICollection<NoteCheck> NoteChecks { get; set; }
        [InverseProperty("StorageRoom")]
        public virtual ICollection<ProductLot> ProductLots { get; set; }
    }
}
