using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.Orders;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.Test.OrderServiceTest
{
    public class CheckOutTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly OrderService _orderService;

        public CheckOutTest()
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
        public async Task CheckOut_WhenOrderRequestDtoIsNull_ReturnsBadRequest()
        {
            OrderRequestDto orderRequestDto = null;

            var result = await _orderService.CheckOut(orderRequestDto);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.True(result.Message.Contains("Lỗi khi tạo đơn hàng"));
        }
        [Fact]
        public async Task CheckOut_WhenOrderDetailsRequestDtoIsEmpty_ReturnsBadRequest()
        {
            var orderRequestDto = new OrderRequestDto
            {
                OrdersDetails = new List<OrdersDetailsRequestDto>() 
            };

            _mapperMock.Setup(m => m.Map<Models.Order>(It.IsAny<OrderRequestDto>()))
                .Returns(new Models.Order()); 

            _orderRepositoryMock.Setup(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()))
                .Returns(Task.FromResult(1));

            _orderRepositoryMock.Setup(repo => repo.SaveAsync())
               .Returns(Task.FromResult(1));

            _ordersDetailRepositoryMock.Setup(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()))
               .Returns(Task.FromResult(1));

            _ordersDetailRepositoryMock.Setup(repo => repo.SaveAsync())
               .Returns(Task.FromResult(1));

            var result = await _orderService.CheckOut(orderRequestDto);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Contains("Lỗi khi tạo đơn hàng", result.Message);
        }

        [Fact]
        public async Task CheckOut_WhenOrderDetailsRequestDtoIsValid_ReturnsSuccessAndInsertsOrder()
        {

            var orderRequestDto = new OrderRequestDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
                OrdersDetails = new List<OrdersDetailsRequestDto>
        {
            new OrdersDetailsRequestDto { ProductId = 1, Quantity = 10 },
            new OrdersDetailsRequestDto { ProductId = 2, Quantity = 5 }
        }
            };

            var order = new Models.Order
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
            };

            var ordersDetails = new List<Models.OrdersDetail>

    {
        new OrdersDetail { OrderId = 1, ProductId = 1, Quantity = 10 },
        new OrdersDetail { OrderId = 1, ProductId = 2, Quantity = 5 }
    };

            var orderDto = new OrderDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
            };

            _mapperMock.Setup(m => m.Map<Models.Order>(It.IsAny<OrderRequestDto>()))
                .Returns(order);

            _mapperMock.Setup(m => m.Map<List<Models.OrdersDetail>>(orderRequestDto.OrdersDetails))
                .Returns(ordersDetails);

            _orderRepositoryMock.Setup(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()))
                .Returns(Task.CompletedTask);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });


            _ordersDetailRepositoryMock.Setup(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()))
                .Returns(Task.CompletedTask);
            _ordersDetailRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _mapperMock.Setup(m => m.Map<OrderDto>(It.IsAny<Models.Order>()))
                .Returns(orderDto);

            // Act: Gọi phương thức CheckOut
            var result = await _orderService.CheckOut(orderRequestDto);

            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Equal(order.OrderId, result.Data.OrderId); 


            _orderRepositoryMock.Verify(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()), Times.Once);
            _ordersDetailRepositoryMock.Verify(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()), Times.Once);
        }

        [Fact]
        public async Task CheckOut_WhenOrderDetailsRequestDtoIsValid_ReturnSuccessCheckStatus()
        {

            var orderRequestDto = new OrderRequestDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
                OrdersDetails = new List<OrdersDetailsRequestDto>
        {
            new OrdersDetailsRequestDto { ProductId = 1, Quantity = 10 },
            new OrdersDetailsRequestDto { ProductId = 2, Quantity = 5 }
        }
            };

            var order = new Models.Order
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
            };

            var ordersDetails = new List<Models.OrdersDetail>

    {
        new OrdersDetail { OrderId = 1, ProductId = 1, Quantity = 10 },
        new OrdersDetail { OrderId = 1, ProductId = 2, Quantity = 5 }
    };

            var orderDto = new OrderDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = 1,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
            };

            _mapperMock.Setup(m => m.Map<Models.Order>(It.IsAny<OrderRequestDto>()))
                .Returns(order);

            _mapperMock.Setup(m => m.Map<List<Models.OrdersDetail>>(orderRequestDto.OrdersDetails))
                .Returns(ordersDetails);

            _orderRepositoryMock.Setup(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()))
                .Returns(Task.CompletedTask);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });


            _ordersDetailRepositoryMock.Setup(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()))
                .Returns(Task.CompletedTask);
            _ordersDetailRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _mapperMock.Setup(m => m.Map<OrderDto>(It.IsAny<Models.Order>()))
                .Returns(orderDto);

            var result = await _orderService.CheckOut(orderRequestDto);


            Assert.NotNull(result.Data); 
            Assert.True(result.Success); 
            Assert.Equal(order.OrderId, result.Data.OrderId); 
            Assert.Equal((int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN, result.Data.Status);

            _orderRepositoryMock.Verify(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()), Times.Once);
            _ordersDetailRepositoryMock.Verify(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()), Times.Once);
        }

        [Fact]
        public async Task CheckOut_WhenDatabaseConnectionFails_ReturnsError()
        {
            var orderRequestDto = new OrderRequestDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
                OrdersDetails = new List<OrdersDetailsRequestDto>
        {
            new OrdersDetailsRequestDto { OrderId = 1, ProductId = 1, Quantity = 10 },
            new OrdersDetailsRequestDto { OrderId = 1, ProductId = 2, Quantity = 5 }
        }
            };

            _orderRepositoryMock.Setup(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()))
                .ThrowsAsync(new InvalidOperationException("Không thể kết nối đến database"));

            _orderRepositoryMock.Setup(repo => repo.SaveAsync())
                .ThrowsAsync(new InvalidOperationException("Không thể kết nối đến database"));

            _ordersDetailRepositoryMock.Setup(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()))
                .ThrowsAsync(new InvalidOperationException("Không thể kết nối đến database"));

            _ordersDetailRepositoryMock.Setup(repo => repo.SaveAsync())
                .ThrowsAsync(new InvalidOperationException("Không thể kết nối đến database"));

            var result = await _orderService.CheckOut(orderRequestDto);

            Assert.False(result.Success); // Kiểm tra là thất bại
            Assert.True(result.Message.Contains("Lỗi khi tạo đơn hàng")); // Kiểm tra thông báo lỗi
        }

        [Fact]
        public async Task CheckOut_WhenMapperDataError_ReturnFail()
        {
            var orderRequestDto = new OrderRequestDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
                OrdersDetails = new List<OrdersDetailsRequestDto>
        {
            new OrdersDetailsRequestDto { ProductId = 1, Quantity = 10 },
            new OrdersDetailsRequestDto { ProductId = 2, Quantity = 5 }
        }
            };

            var order = new Models.Order
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
            };

            var ordersDetails = new List<Models.OrdersDetail>

    {
        new OrdersDetail { OrderId = 1, ProductId = 1, Quantity = 10 },
        new OrdersDetail { OrderId = 1, ProductId = 2, Quantity = 5 }
    };

            var orderDto = new OrderDto
            {
                OrderId = 1,
                OrderCode = "ORD001",
                CreatedDate = DateTime.Now,
                Status = (int)Common.Enums.OrderStatus.DANG_CHO_XAC_NHAN,
                UpdatedStatusDate = DateTime.Now,
                CustomerId = 1,
                DistrictId = 1482,
                WardCode = "11010",
            };

            _mapperMock.Setup(m => m.Map<Models.Order>(It.IsAny<OrderRequestDto>()))
                .Returns(order);

            _mapperMock.Setup(m => m.Map<List<Models.OrdersDetail>>(orderRequestDto.OrdersDetails))
                .Returns(ordersDetails);

            _orderRepositoryMock.Setup(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()))
                .Returns(Task.CompletedTask);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _ordersDetailRepositoryMock.Setup(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()))
                .Returns(Task.CompletedTask);
            _ordersDetailRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            var result = await _orderService.CheckOut(orderRequestDto);

            Assert.Null(result.Data); 


            _orderRepositoryMock.Verify(repo => repo.InsertOrderAsync(It.IsAny<Models.Order>()), Times.Once);
            _ordersDetailRepositoryMock.Verify(repo => repo.AddOrdersDetails(It.IsAny<List<OrdersDetail>>()), Times.Once);
        }
    }
}
