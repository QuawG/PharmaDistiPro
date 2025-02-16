using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class NoteCheck
    {
        public int? CheckDateId { get; set; }
        public int? ReceivedNoteDetailsId { get; set; }
        public int? DifferenceQuantity { get; set; }
        public int? ActualQuantity { get; set; }
        public int? CreatedBy { get; set; }

        public virtual CheckDate? CheckDate { get; set; }
        public virtual User? CreatedByNavigation { get; set; }
    }
}
