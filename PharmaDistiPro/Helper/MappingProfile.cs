using AutoMapper;
using PharmaDistiPro.DTO.Suppliers;

using PharmaDistiPro.Models;
namespace PharmaDistiPro.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            //#region User
            //CreateMap<User, UserDTO>();
            //CreateMap<UserDTO, User>();

            //CreateMap<UserInputRequest, UserDTO>();
            //CreateMap<UserDTO, UserInputRequest>();

            //CreateMap<User, UserInputRequest>();
            //CreateMap<UserInputRequest, User>();
            //#endregion

            //#region Order
            //CreateMap<Order, OrderDto>();
            //CreateMap<OrderDto, Order>();
            //#endregion

            #region Supplier
            CreateMap<Order, SupplierDTO>();
            CreateMap<SupplierDTO, Order>();
            #endregion


        }
    }
}