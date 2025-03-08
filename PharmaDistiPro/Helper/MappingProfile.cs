﻿using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using PharmaDistiPro.DTO.Categorys;
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
        
            CreateMap<ProductDTO, Product>();

            CreateMap<ProductInputRequest, ProductDTO>();
            CreateMap<ProductDTO,ProductInputRequest>();

            CreateMap<Product, ProductInputRequest>();
        


            // Ánh xạ từ ProductInputRequest sang Product với điều kiện
            CreateMap<ProductInputRequest, Product>()
                .ForMember(dest => dest.ProductName, opt => opt.Condition(src => !string.IsNullOrEmpty(src.ProductName)))
                .ForMember(dest => dest.ProductCode, opt => opt.Condition(src => !string.IsNullOrEmpty(src.ProductCode)))
                .ForMember(dest => dest.ManufactureName, opt => opt.Condition(src => !string.IsNullOrEmpty(src.ManufactureName)))
                .ForMember(dest => dest.Description, opt => opt.Condition(src => !string.IsNullOrEmpty(src.Description)))
                .ForMember(dest => dest.Storageconditions, opt => opt.Condition(src => src.Storageconditions.HasValue))
                .ForMember(dest => dest.UnitId, opt => opt.Condition(src => src.UnitId.HasValue))
                .ForMember(dest => dest.CategoryId, opt => opt.Condition(src => src.CategoryId.HasValue))
                .ForMember(dest => dest.Vat, opt => opt.Condition(src => src.Vat.HasValue))
                .ForMember(dest => dest.Image, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedDate, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Unit, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.ProductLots, opt => opt.Ignore());

            // Ánh xạ từ Product sang ProductDTO
            CreateMap<Product, ProductDTO>()
                .ForMember(dest => dest.Unit, opt => opt.MapFrom(src => src.Unit))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.CreatedByNavigation, opt => opt.MapFrom(src => src.CreatedByNavigation))
                .ForMember(dest => dest.ProductLots, opt => opt.MapFrom(src => src.ProductLots));
        }
        #endregion



    }
}