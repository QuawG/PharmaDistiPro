using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class IssueNoteDetail
    {
        [Key]
        public int IssueNoteDetailId { get; set; }
        public int? IssueNoteId { get; set; }
        public int? ProductLotId { get; set; }
        public int? Quantity { get; set; }

        [ForeignKey("IssueNoteId")]
        [InverseProperty("IssueNoteDetails")]
        public virtual IssueNote? IssueNote { get; set; }
        [ForeignKey("ProductLotId")]
        [InverseProperty("IssueNoteDetails")]
        public virtual ProductLot? ProductLot { get; set; }
    }
}
