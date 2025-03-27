namespace PharmaDistiPro.DTO.NoteChecks
{
    public class CheckNoteResponseDTO
    {
        public int NoteCheckId { get; set; }
        public int? DifferenceQuatity { get; set; }
        public int? StorageRoomId { get; set; }
        public string ReasonCheck { get; set; }
        public string Result { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Status { get; set; }
        public List<NoteCheckDetails.CheckNoteDetailResponseDTO> CheckDetails { get; set; }
    }
}
