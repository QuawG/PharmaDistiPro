using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class CheckDate
    {
        public int Id { get; set; }
        public DateTime? CheckedDate { get; set; }
        public int? Status { get; set; }
        public int? CreatedBy { get; set; }
        public string? NoteContent { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
    }
}
