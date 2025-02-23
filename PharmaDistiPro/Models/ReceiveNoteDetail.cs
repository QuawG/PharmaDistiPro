using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ReceiveNoteDetail
    {
        public int Id { get; set; }
        public string? NoteNumber { get; set; }
        public int? GoodId { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual Good? Good { get; set; }
    }
}
