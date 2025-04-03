using AutoMapper;
using MailKit.Search;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.OrdersDetails;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.OrderServiceTest
{
    public class GetAllOrderDetailsTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly OrderService _orderService;

        public GetAllOrderDetailsTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                null,
                _ordersDetailRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object);
        }

        [Fact]
        public async Task GetAllOrderDetails_WhenNoOrdersExist_ReturnsEmptyResponse()
        {
            List<OrdersDetail> list = new List<OrdersDetail>();

            _ordersDetailRepositoryMock.Setup(repo => repo.GetAllAsync())
            .ReturnsAsync(new List<OrdersDetail>().AsEnumerable());

            var result = await _orderService.GetAllOrderDetails(null, null, 0);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetAllOrderDetails_ThrowsArgumentException()
        {
            DateTime invalidDate = DateTime.MinValue;
            var result = await _orderService.GetAllOrderDetails(invalidDate, invalidDate, null);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetAllOrderDetails_WhenCalled_ReturnsOrderedProductList()
        {
            // Arrange

            var orderDetailsList = new List<OrdersDetail>

            {   
                new OrdersDetail { OrderDetailId = 1, OrderId = 1,  ProductId = 1,   Quantity = 5,
                Product = new Product
            {   ProductId = 1,  ProductName = "Loc"   },
            
                    Order = new Order
            {  OrderId = 1,CreatedDate = DateTime.Now, Status = (int)Common.Enums.OrderStatus.HOAN_THANH } },      
                new OrdersDetail                       
                {          
                    OrderDetailId = 2,           
                    OrderId = 2,          
                    ProductId = 2,           
                    Quantity = 10,           
                    Product = new Product           
                    {           
                        ProductId = 2,            
                        ProductName = "Filter"           
                    },            
                    Order = new Order          
                    {            
                        OrderId = 2,             
                        CreatedDate = DateTime.Now,            
                        Status = (int)Common.Enums.OrderStatus.HOAN_THANH           
                    }       
                }    
            };

            var expectedDtoList = new List<OrdersDetailDto>   
            {
                new OrdersDetailDto
                { 
                    OrderDetailId = 1, 
                    OrderId = 1,    
                    ProductId = 1,      
                    Quantity = 5,
                    Product = new ProductOrderDto   
                    { 
                        ProductId = 1, 
                        ProductName = "Loc"
                    } 
                },
        
                new OrdersDetailDto      
                {          
                    OrderDetailId = 2,          
                    OrderId = 2,         
                    ProductId = 2,          
                    Quantity = 10,            
                    Product = new ProductOrderDto          
                    {              
                        ProductId = 2,              
                        ProductName = "Filter"           
                    }        
                }
            };

            // Mock repository để trả về dữ liệu đơn hàng hoàn thành
            Func<IQueryable<OrdersDetail>, IOrderedQueryable<OrdersDetail>>? orderBy = null;
            _ordersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<OrdersDetail, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<OrdersDetail>, IOrderedQueryable<OrdersDetail>>>()
            )).ReturnsAsync(orderDetailsList);

            // Mock AutoMapper
            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<OrdersDetailDto>>(It.IsAny<IEnumerable<OrdersDetail>>()))
                .Returns((IEnumerable<OrdersDetail> src) =>
                    src.Select(o => new OrdersDetailDto
                    {
                        OrderDetailId = o.OrderDetailId,
                        OrderId = o.OrderId,
                        ProductId = o.ProductId,
                        Quantity = o.Quantity,
                        Product = new ProductOrderDto
                        {
                            ProductId = o.Product?.ProductId ?? 0,
                            ProductName = o.Product?.ProductName ?? "Unknown"
                        }
                    }));

            // Act
            var result = await _orderService.GetAllOrderDetails(null, null, null);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
        }


    }
}
