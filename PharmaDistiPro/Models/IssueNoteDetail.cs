using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class IssueNoteDetail
    {
        public int Id { get; set; }
        public int? IssueNoteId { get; set; }
        public string? NoteNumber { get; set; }
        public int? ProductLotId { get; set; }

        public virtual IssueNote? IssueNote { get; set; }
        public virtual ProductLot? ProductLot { get; set; }
    }
}
