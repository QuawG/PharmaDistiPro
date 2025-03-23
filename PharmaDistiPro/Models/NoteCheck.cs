using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    [Table("NoteCheck")]
    public partial class NoteCheck
    {
        public NoteCheck()
        {
            NoteCheckDetails = new HashSet<NoteCheckDetail>();
        }

        [Key]
        public int NoteCheckId { get; set; }
        public int? DifferenceQuatity { get; set; }
        public int? StorageRoomId { get; set; }
        public string? ReasonCheck { get; set; }
        public string? Result { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("StorageRoomId")]
        [InverseProperty("NoteChecks")]
        public virtual StorageRoom? StorageRoom { get; set; }
        [InverseProperty("NoteCheck")]
        public virtual ICollection<NoteCheckDetail> NoteCheckDetails { get; set; }
    }
}
