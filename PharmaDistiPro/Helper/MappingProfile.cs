using AutoMapper;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.DTO.Units;
using PharmaDistiPro.DTO.Users;
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

            #region Unit
            CreateMap<Unit, UnitDTO>();
            CreateMap<UnitDTO, Unit>();
            #endregion


            #region Category
            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryDTO, Category>();
            #endregion

            #region User
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();

            CreateMap<UserInputRequest, UserDTO>();
            CreateMap<UserDTO, UserInputRequest>();

            CreateMap<User, UserInputRequest>();
            CreateMap<UserInputRequest, User>();
            #endregion

            #region Order
            CreateMap<Order, OrderDto>();
            CreateMap<OrderDto, Order>();
            #endregion
        }
    }
}