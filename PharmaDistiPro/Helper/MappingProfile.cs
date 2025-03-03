using AutoMapper;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.DTO.Suppliers;

using PharmaDistiPro.Models;
namespace PharmaDistiPro.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {


            #region Supplier
            CreateMap<Supplier, SupplierDTO>();
            CreateMap<SupplierDTO, Supplier>();
            #endregion

            #region StorageRoom
            CreateMap<StorageRoom,StorageRoomDTO>();
            CreateMap<StorageRoomDTO, StorageRoom>();
            #endregion

        }
    }
}