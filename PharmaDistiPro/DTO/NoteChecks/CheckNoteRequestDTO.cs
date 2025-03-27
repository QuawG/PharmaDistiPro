namespace PharmaDistiPro.DTO.NoteChecks
{
    public class CheckNoteRequestDTO
    {
        public int StorageRoomId { get; set; }
        public string ReasonCheck { get; set; }
        public List<NoteCheckDetails.CheckNoteDetailDTO> CheckDetails { get; set; }
    }
}

