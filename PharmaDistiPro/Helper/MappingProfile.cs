using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.DTO.IssueNoteDetails;
using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.DTO.PurchaseOrders;
using PharmaDistiPro.DTO.PurchaseOrdersDetails;
using PharmaDistiPro.DTO.ReceivedNotes;
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

            CreateMap<Product, ProductOrderDto>();
            CreateMap<ProductOrderDto, Product>();
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

            #region productlot
            CreateMap<ProductLot, ProductLotIssueNoteDetailsDto>().ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));

            CreateMap<ProductLotIssueNoteDetailsDto, ProductLot>();
            #endregion

            #region Order
            CreateMap<Order, OrderDto>()
                // lấy thông tin người mua hàng
                .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId)) // Lấy đúng ID khách hàng
                .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.Customer)) // Chỉ lấy Customer nếu thỏa điều kiện

                // Lấy thông tin người tạo đơn hàng
                .ForMember(dest => dest.ConfirmedBy, opt => opt.MapFrom(src => src.ConfirmedBy)) // Người tạo đơn hàng
                .ForMember(dest => dest.ConfirmBy, opt => opt.MapFrom(src => src.ConfirmedByNavigation))// Người xác nhận đơn hàng

                // Lấy thông tin của warehouse được giao
                .ForMember(dest => dest.AssignTo, opt => opt.MapFrom(src => src.AssignTo))
                .ForMember(dest => dest.AssignToNavigation, opt => opt.MapFrom(src => src.AssignToNavigation));
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

            CreateMap<IssueNoteDetail, IssueNoteDetailDto>()
                .ForMember(dest => dest.ProductLotId, opt => opt.MapFrom(src => src.ProductLotId))
                .ForMember(dest => dest.ProductLot, opt => opt.MapFrom(src => src.ProductLot));

            CreateMap<IssueNoteDetailDto, IssueNoteDetail>();
            #endregion

            #region purchase order
            CreateMap<PurchaseOrder, PurchaseOrdersDto>()
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy))
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.MapFrom(src => src.CreatedByNavigation))

                .ForMember(dest => dest.SupplierId, opt => opt.MapFrom(src => src.SupplierId))
                .ForMember(dest => dest.Supplier, opt => opt.MapFrom(src => src.Supplier));
            CreateMap<PurchaseOrdersDto, PurchaseOrder>();

            CreateMap<PurchaseOrdersDetail, PurchaseOrdersDetailDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductId : (int?)null))
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));  // No need for _mapper.Map<ProductOrdersDetailDto>()

            CreateMap<PurchaseOrdersDetailDto, PurchaseOrdersDetail>()
                .ForMember(dest => dest.Product, opt => opt.Ignore());


            CreateMap<PurchaseOrder, PurchaseOrdersRequestDto>();
            CreateMap<PurchaseOrdersRequestDto, PurchaseOrder>()
                .ForMember(dest => dest.PurchaseOrdersDetails, opt => opt.Ignore()); // Tránh lặp mapping

            CreateMap<PurchaseOrdersDetail, PurchaseOrdersDetailsRequestDto>();
            CreateMap<PurchaseOrdersDetailsRequestDto, PurchaseOrdersDetail>()
                 .ForMember(dest => dest.PurchaseOrderId, opt => opt.MapFrom(src => src.PurchaseOrderId));
            #endregion

            #region ReceivedNote
            CreateMap<ReceivedNote, ReceivedNoteDto>()
                // lấy thông tin người mua hàng
                .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.CreatedBy)) // Lấy đúng ID nguoi tao
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.MapFrom(src => src.CreatedByNavigation)) // Chỉ lấy ID nguoi tao nếu thỏa điều kiện


                // Lấy thông tin của warehouse được giao
                .ForMember(dest => dest.PurchaseOrderId, opt => opt.MapFrom(src => src.PurchaseOrderId))
                .ForMember(dest => dest.PurchaseOrder, opt => opt.MapFrom(src => src.PurchaseOrder));

            CreateMap<ReceivedNoteDto, ReceivedNote>();
            #endregion

        }
    }
}