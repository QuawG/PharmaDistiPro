using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ReceivedNoteDetail
    {
        public int ReceiveNoteDetailId { get; set; }
        public string? NoteNumber { get; set; }
        public int? ProductLotId { get; set; }
        public int? ActualReceived { get; set; }
        public string? DocumentNumber { get; set; }

        public virtual ProductLot? ProductLot { get; set; }
    }
}
