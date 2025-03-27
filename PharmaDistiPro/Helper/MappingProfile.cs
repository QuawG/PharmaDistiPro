using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.Products;
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
            CreateMap<StorageRoom, StorageRoomDTO>();
            CreateMap<StorageRoomDTO, StorageRoom>();

            CreateMap<StorageRoomInputRequest, StorageRoom>()
           .ForMember(dest => dest.StorageRoomId, opt => opt.MapFrom(src => src.StorageRoomId))
           .ForMember(dest => dest.Temperature, opt => opt.MapFrom(src => src.Temperature))
           .ForMember(dest => dest.Humidity, opt => opt.MapFrom(src => src.Humidity))
           .ForMember(dest => dest.StorageRoomCode, opt => opt.MapFrom(src => src.StorageRoomCode))
           .ForMember(dest => dest.StorageRoomName, opt => opt.MapFrom(src => src.StorageRoomName))
           .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
           .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
           .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
           .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate))
           .ReverseMap(); // Để hỗ trợ ánh xạ 2 chiều
        
        #endregion

        #region Unit
        CreateMap<Unit, UnitDTO>();
            CreateMap<UnitDTO, Unit>();
            #endregion


            #region Category
            CreateMap<Category, CategoryDTO>();
            CreateMap<CategoryDTO, Category>();


            CreateMap<CategoryInputRequest, Category>()
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.Ignore());

            CreateMap<Category, CategoryInputRequest>();
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

            #region Product
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.MapFrom(src => src.CreatedByNavigation))
                .ForMember(dest => dest.ProductLots, opt => opt.MapFrom(src => src.ProductLots))
                .ForMember(dest => dest.ImageProducts, opt => opt.MapFrom(src => src.ImageProducts))
                .ForMember(dest => dest.OrdersDetails, opt => opt.MapFrom(src => src.OrdersDetails))
                .ForMember(dest => dest.PurchaseOrdersDetails, opt => opt.MapFrom(src => src.PurchaseOrdersDetails))
                .ReverseMap()
                .ForMember(dest => dest.ImageProducts, opt => opt.Ignore()) // Ngăn vòng lặp từ ImageProductDTO.Product
                .ForMember(dest => dest.OrdersDetails, opt => opt.Ignore())
                .ForMember(dest => dest.ProductLots, opt => opt.Ignore())
                .ForMember(dest => dest.PurchaseOrdersDetails, opt => opt.Ignore());

            CreateMap<ProductInputRequest, ProductDTO>().ReverseMap();

            CreateMap<ProductInputRequest, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.Condition(src => !string.IsNullOrEmpty(src.ProductName)))
                .ForMember(dest => dest.ProductCode, opt => opt.Condition(src => !string.IsNullOrEmpty(src.ProductCode)))
                .ForMember(dest => dest.ManufactureName, opt => opt.Condition(src => !string.IsNullOrEmpty(src.ManufactureName)))
                .ForMember(dest => dest.Description, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Description)))
                .ForMember(dest => dest.Storageconditions, opt => opt.Condition(src => src.Storageconditions.HasValue))
                .ForMember(dest => dest.UnitId, opt => opt.Condition(src => src.UnitId.HasValue))
                .ForMember(dest => dest.CategoryId, opt => opt.Condition(src => src.CategoryId.HasValue))
                .ForMember(dest => dest.Vat, opt => opt.Condition(src => src.Vat.HasValue))
                .ForMember(dest => dest.SellingPrice, opt => opt.Condition(src => src.SellingPrice.HasValue))
                .ForMember(dest => dest.Weight, opt => opt.Condition(src => src.Weight.HasValue))
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Unit, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.ImageProducts, opt => opt.Ignore())
                .ForMember(dest => dest.OrdersDetails, opt => opt.Ignore())
                .ForMember(dest => dest.ProductLots, opt => opt.Ignore())
                .ForMember(dest => dest.PurchaseOrdersDetails, opt => opt.Ignore());
            #endregion

            #region ImageProduct
            CreateMap<ImageProduct, ImageProductDTO>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product)) 
                .ReverseMap()
                .ForMember(dest => dest.Product, opt => opt.Ignore());
            #endregion

            #region NoteCheck
            CreateMap<NoteCheck, CheckNoteRequestDTO>().ReverseMap()
                .ForMember(dest => dest.NoteCheckDetails, opt => opt.Ignore())
                .ForMember(dest => dest.StorageRoom, opt => opt.Ignore());

            CreateMap<NoteCheck, CheckNoteResponseDTO>()
                .ForMember(dest => dest.CheckDetails, opt => opt.MapFrom(src => src.NoteCheckDetails))
                .ReverseMap()
                .ForMember(dest => dest.NoteCheckDetails, opt => opt.Ignore())
                .ForMember(dest => dest.StorageRoom, opt => opt.Ignore());

            CreateMap<ApproveCheckNoteRequestDTO, NoteCheck>().ReverseMap();
            CreateMap<ApproveCheckNoteResponseDTO, NoteCheck>().ReverseMap();
            #endregion

            #region NoteCheckDetail
            CreateMap<NoteCheckDetail, CheckNoteDetailDTO>().ReverseMap()
                .ForMember(dest => dest.NoteCheck, opt => opt.Ignore())
                .ForMember(dest => dest.ProductLot, opt => opt.Ignore());

            CreateMap<NoteCheckDetail, CheckNoteDetailResponseDTO>().ReverseMap()
                .ForMember(dest => dest.NoteCheck, opt => opt.Ignore())
                .ForMember(dest => dest.ProductLot, opt => opt.Ignore());
            #endregion

        }
    }
}