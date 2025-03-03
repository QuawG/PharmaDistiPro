namespace PharmaDistiPro.DTO.StorageRooms
{
    public class StorageRoomInputRequest
    {
        public int StorageRoomId { get; set; }
        public string? StorageRoomCode { get; set; }
        public string? StorageRoomName { get; set; }
        public double? Humidity { get; set; }
        public double? Temperature { get; set; }
        public int? Quantity { get; set; }
        public bool? Status { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
