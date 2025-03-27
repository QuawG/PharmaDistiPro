using PharmaDistiPro.DTO.StorageRooms;

namespace PharmaDistiPro.Services.Interface
{
    public interface IStorageRoomService
    {
        #region StorageRoom Management
        Task<Services.Response<StorageRoomDTO>> ActivateDeactivateStorageRoom(int storageRoomId, bool update);
        Task<Response<IEnumerable<StorageRoomDTO>>> CheckTemperatureWarning();
        Task<Services.Response<StorageRoomDTO>> CreateNewStorageRoom(StorageRoomInputRequest storageRoomInputRequest);
        Task<Services.Response<StorageRoomDTO>> GetStorageRoomById(int storageRoomId);
        Task<Services.Response<IEnumerable<StorageRoomDTO>>> GetStorageRoomList();
        Task<Services.Response<StorageRoomDTO>> UpdateStorageRoom(StorageRoomInputRequest storageRoomUpdateRequest);
        #endregion
    }
}
