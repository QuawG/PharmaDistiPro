﻿using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class ReceivedNote
    {
        public int? ReceiveNoteId { get; set; }
        public string? ReceiveNotesCode { get; set; }
        public int? PurchaseOrderId { get; set; }
        public int? Status { get; set; }
        public string? DeliveryPerson { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual PurchaseOrder? PurchaseOrder { get; set; }
        public virtual ReceivedNoteDetail? ReceiveNote { get; set; }
    }
}
