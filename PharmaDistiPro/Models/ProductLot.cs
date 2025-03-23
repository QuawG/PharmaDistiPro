using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    [Table("ProductLot")]
    public partial class ProductLot
    {
        public ProductLot()
        {
            IssueNoteDetails = new HashSet<IssueNoteDetail>();
            NoteCheckDetails = new HashSet<NoteCheckDetail>();
            ReceivedNoteDetails = new HashSet<ReceivedNoteDetail>();
        }

        [Key]
        public int ProductLotId { get; set; }
        public int? ProductId { get; set; }
        public int? LotId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ManufacturedDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ExpiredDate { get; set; }
        public double? SupplyPrice { get; set; }
        public int? Quantity { get; set; }
        public int? Status { get; set; }
        public int? StorageRoomId { get; set; }

        [ForeignKey("LotId")]
        [InverseProperty("ProductLots")]
        public virtual Lot? Lot { get; set; }
        [ForeignKey("ProductId")]
        [InverseProperty("ProductLots")]
        public virtual Product? Product { get; set; }
        [ForeignKey("StorageRoomId")]
        [InverseProperty("ProductLots")]
        public virtual StorageRoom? StorageRoom { get; set; }
        [InverseProperty("ProductLot")]
        public virtual ICollection<IssueNoteDetail> IssueNoteDetails { get; set; }
        [InverseProperty("ProductLot")]
        public virtual ICollection<NoteCheckDetail> NoteCheckDetails { get; set; }
        [InverseProperty("ProductLot")]
        public virtual ICollection<ReceivedNoteDetail> ReceivedNoteDetails { get; set; }
    }
}
