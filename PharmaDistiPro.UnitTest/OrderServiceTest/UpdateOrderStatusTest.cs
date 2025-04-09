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
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.Test.OrderServiceTest
{
    public class UpdateOrderStatusTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly OrderService _orderService;

        public UpdateOrderStatusTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                null, // IIssueNoteRepository is not used in this test
                _ordersDetailRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object);
        }

        [Fact]
        public async Task UpdateOrder_WhennvalidOrderId_ReturnsNotFound()
        {
            Order order = new Order();
            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Order)null);

            var result = await _orderService.UpdateOrderStatus(1, 1);


            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy đơn hàng", result.Message);
        }

        [Fact]
        public async Task UpdateOrder_WhenValidOrder_ReturnSuccesStatusCancel()
        {
            Order order = new Order
            {
                OrderId = 1,
                Status = 1
            };
            int newStatus = (int)Common.Enums.OrderStatus.HUY;

            OrderDto orderDto = new OrderDto
            {
                OrderId = 1,
                Status = newStatus

            };
            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((order));

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            _mapperMock.Setup(mapper => mapper.Map<OrderDto>(It.IsAny<Order>())).Returns(orderDto);

            var result = await _orderService.UpdateOrderStatus(1, newStatus);


            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Equal(newStatus, result.Data.Status);
        }

        [Fact]
        public async Task UpdateOrder_WhenValidOrder_ReturnSuccesStatusShipping()
        {
            Order order = new Order
            {
                OrderId = 1,
                Status = 1
            };
            int newStatus = (int)Common.Enums.OrderStatus.VAN_CHUYEN;

            OrderDto orderDto = new OrderDto
            {
                OrderId = 1,
                Status = newStatus

            };
            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((order));

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            _mapperMock.Setup(mapper => mapper.Map<OrderDto>(It.IsAny<Order>())).Returns(orderDto);

            var result = await _orderService.UpdateOrderStatus(1, newStatus);


            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Equal(newStatus, result.Data.Status);
        }

        [Fact]
        public async Task UpdateOrder_WhenValidOrder_ReturnsError_WhenDatabaseConnectionFails_WhileSaving()
        {
            Order order = new Order
            {
                OrderId = 1,
                Status = 1
            };
            int newStatus = (int)Common.Enums.OrderStatus.HUY;

            OrderDto orderDto = new OrderDto
            {
                OrderId = 1,
                Status = newStatus
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync())
                .ThrowsAsync(new InvalidOperationException("Không thể kết nối đến database"));

            var result = await _orderService.UpdateOrderStatus(1, newStatus);

            Assert.Null(result.Data); 
            Assert.False(result.Success); 
            Assert.Equal("Không thể kết nối đến database", result.Message); 
        }

        [Fact]
        public async Task UpdateOrder_WhenValidOrder_ReturnsSuccessAndConfirmStatus()
        {
            Order order = new Order
            {
                OrderId = 1,
                Status = 1,
                ConfirmedBy = 1,
                AssignTo = 1
            };

            int newStatus = (int)Common.Enums.OrderStatus.XAC_NHAN;

            OrderDto orderDto = new OrderDto
            {
                OrderId = 1,
                Status = newStatus,
                ConfirmedBy = 1,
                AssignTo = 1
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            var user = new Models.User
            {
                UserId = 2,
                RoleId = 2
            };

            _userRepositoryMock.Setup(repo => repo.GetWarehouseManagerToConfirm()).ReturnsAsync(user);

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _mapperMock.Setup(mapper => mapper.Map<OrderDto>(It.IsAny<Order>())).Returns(orderDto);

            var result = await _orderService.ConfirmOrder(1);

            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Equal(newStatus, result.Data.Status);
            Assert.Equal(1, result.Data.ConfirmedBy);
        }

        [Fact]
        public async Task UpdateOrder_WhenWareHouseManagerNotFound_ReturnsFailAndConfirmStatus()

        {
            Order order = new Order
            {
                OrderId = 1,
                Status = 1,
                ConfirmedBy = 1,
                AssignTo = 1
            };

            int newStatus = (int)Common.Enums.OrderStatus.XAC_NHAN;

            OrderDto orderDto = new OrderDto
            {
                OrderId = 1,
                Status = newStatus,
                ConfirmedBy = 1, 
                AssignTo = 1
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            var user = new Models.User
            {
                UserId = 2,
                RoleId = 2
            };

            _userRepositoryMock.Setup(repo => repo.GetWarehouseManagerToConfirm()).ThrowsAsync(new InvalidOperationException("Không tìm thấy warehouse manager"));


            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _mapperMock.Setup(mapper => mapper.Map<OrderDto>(It.IsAny<Order>())).Returns(orderDto);

            var result = await _orderService.ConfirmOrder(1);

            Assert.False(result.Success); 
            Assert.Equal("Không tìm thấy warehouse manager", result.Message);

        }

        [Fact]
        public async Task UpdateOrder_WhenNullConfirmBy_ReturnsFailAndConfirmStatus()
        {
            Order order = new Order
            {
                OrderId = 1,
                Status = 1,
                ConfirmedBy = 1,
                AssignTo = 1
            };

            int newStatus = (int)Common.Enums.OrderStatus.XAC_NHAN;

            OrderDto orderDto = new OrderDto
            {
                OrderId = 1,
                Status = newStatus,
                ConfirmedBy = 1,
                AssignTo = 1
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            var user = new Models.User
            {
                UserId = 2,
                RoleId = 2
            };

            _mapperMock.Setup(mapper => mapper.Map<OrderDto>(It.IsAny<Order>())).Returns(orderDto);

            var result = await _orderService.ConfirmOrder(1);

            Assert.False(result.Success); 
            Assert.True(result.Message.Contains("Object reference not set to an instance")); 

        }

        [Fact]
        public async Task UpdateOrder_WhenStatusIsNull_ReturnsFailure()
        {
            // Arrange
            Order order = new Order
            {
                OrderId = 1,
                Status = null // Status null
            };

            int newStatus = (int)Common.Enums.OrderStatus.VAN_CHUYEN;

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ThrowsAsync(new InvalidOperationException("Trạng thái không hợp lệ"));

            // Act
            var result = await _orderService.UpdateOrderStatus(1, newStatus);

            // Assert
            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Trạng thái không hợp lệ", result.Message); 
        }

        [Fact]
        public async Task UpdateOrder_WhenStatusNotFound_ReturnsFailure()
        {
            
            Order order = new Order
            {
                OrderId = 1,
                Status = (int)Common.Enums.OrderStatus.VAN_CHUYEN 
            };

            int invalidStatus = 99; // Trạng thái không hợp lệ

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);

            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ThrowsAsync(new InvalidOperationException("Trạng thái không hợp lệ"));

            
            var result = await _orderService.UpdateOrderStatus(1, invalidStatus);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Trạng thái không hợp lệ", result.Message); // Kiểm tra lỗi trạng thái không hợp lệ
        }

        [Fact]
        public async Task UpdateOrder_WhenOrderStatusIsCompleted_ReturnsFailure()
        {
            Order order = new Order
            {
                OrderId = 1,
                Status = (int)Common.Enums.OrderStatus.HOAN_THANH
            };

            int newStatus = (int)Common.Enums.OrderStatus.VAN_CHUYEN; 

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).ThrowsAsync(new InvalidOperationException("Đơn hàng đã hoàn thành, không thể sửa trạng thái"));

            // Act
            var result = await _orderService.UpdateOrderStatus(1, newStatus);

            // Assert
            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Đơn hàng đã hoàn thành, không thể sửa trạng thái", result.Message); 
        }

    }

}
