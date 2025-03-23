using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class NoteCheckDetail
    {
        [Key]
        public int NoteCheckDetailId { get; set; }
        public int? NoteCheckId { get; set; }
        public int? ProductLotId { get; set; }
        public int? StorageQuantity { get; set; }
        public int? ActualQuantity { get; set; }
        public int? ErrorQuantity { get; set; }
        public int? Status { get; set; }

        [ForeignKey("NoteCheckId")]
        [InverseProperty("NoteCheckDetails")]
        public virtual NoteCheck? NoteCheck { get; set; }
        [ForeignKey("ProductLotId")]
        [InverseProperty("NoteCheckDetails")]
        public virtual ProductLot? ProductLot { get; set; }
    }
}
