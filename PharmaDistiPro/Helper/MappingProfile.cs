using AutoMapper;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.DTO.Units;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
using System.Drawing;
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
            CreateMap<StorageRoom, StorageRoomDTO>();
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
            CreateMap<User, UserDTO>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.RoleName));

            CreateMap<UserDTO, User>()
            .ForMember(dest => dest.Role, opt => opt.Ignore());

            CreateMap<UserInputRequest, UserDTO>();
            CreateMap<UserDTO, UserInputRequest>();

            CreateMap<User, UserInputRequest>();
            CreateMap<UserInputRequest, User>();
            #endregion

            #region Product
            CreateMap<Product, ProductOrdersDetailDto>();
            CreateMap<ProductOrdersDetailDto, ProductOrdersDetailDto>();
            #endregion

            #region Order
            CreateMap<Order, OrderDto>()
    .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId)) // Lấy đúng ID khách hàng
    .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.Customer)) // Chỉ lấy Customer nếu thỏa điều kiện

    .ForMember(dest => dest.ConfirmedBy, opt => opt.MapFrom(src => src.ConfirmedBy)) // Người tạo đơn hàng
    .ForMember(dest => dest.ConfirmBy, opt => opt.MapFrom(src => src.ConfirmedByNavigation)); // Người xác nhận đơn hàng

            CreateMap<OrderDto, Order>();

            CreateMap<OrdersDetail, OrdersDetailDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductId : (int?)null))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));  // No need for _mapper.Map<ProductOrdersDetailDto>()

            CreateMap<OrdersDetailDto, OrdersDetail>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            CreateMap<Order, OrderRequestDto>();

            CreateMap<OrderRequestDto, Models.Order>()
         .ForMember(dest => dest.OrdersDetails, opt => opt.Ignore()); // Tránh lặp mapping

            CreateMap<OrdersDetail, OrdersDetailsRequestDto>();

            CreateMap<OrdersDetailsRequestDto, OrdersDetail>()
    .ForMember(dest => dest.OrderId, opt => opt.MapFrom(src => src.OrderId));

            #endregion

            #region issue note
            CreateMap<IssueNote, IssueNoteRequestDto>(); 
            CreateMap<IssueNoteRequestDto, IssueNote>();

            CreateMap<IssueNoteRequestDto, IssueNoteDetail>();
            CreateMap<IssueNoteDetail, IssueNoteRequestDto>();

            CreateMap<IssueNoteDto, IssueNoteRequestDto>();
            CreateMap<IssueNoteRequestDto, IssueNoteDto>();

            CreateMap<IssueNoteDto, IssueNote>();
            CreateMap<IssueNote, IssueNoteDto>();

            #endregion
        }
    }
}