namespace PharmaDistiPro.DTO.ReceivedNotes
{
    public class ReceivedNoteResponse
    {
        public int Id { get; set; }
        public string ReceivedNoteCode { get; set; }
        public int PurchaseOrderId { get; set; }
        public string PurchaseOrderCode { get; set; }
        public string Status { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
