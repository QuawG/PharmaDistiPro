namespace PharmaDistiPro.DTO.NoteCheckDetails
{
    public class CheckNoteDetailResponseDTO
    {
        public int NoteCheckDetailId { get; set; }
        public int? ProductLotId { get; set; }
        public int? StorageQuantity { get; set; }
        public int? ActualQuantity { get; set; }
        public int? ErrorQuantity { get; set; }
        public int? Status { get; set; } // 0: Pending, 1: Approved
   
    }
}
