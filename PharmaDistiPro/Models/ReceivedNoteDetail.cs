using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class ReceivedNoteDetail
    {
        [Key]
        public int ReceiveNoteDetailId { get; set; }
        public int? ReceiveNoteId { get; set; }
        public int? ProductLotId { get; set; }
        public int? ActualReceived { get; set; }
        [StringLength(50)]
        public string? DocumentNumber { get; set; }

        [ForeignKey("ProductLotId")]
        [InverseProperty("ReceivedNoteDetails")]
        public virtual ProductLot? ProductLot { get; set; }
        [ForeignKey("ReceiveNoteId")]
        [InverseProperty("ReceivedNoteDetails")]
        public virtual ReceivedNote? ReceiveNote { get; set; }
    }
}
