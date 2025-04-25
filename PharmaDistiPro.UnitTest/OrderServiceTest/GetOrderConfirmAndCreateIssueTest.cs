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
    public class GetOrderConfirmAndCreateIssueTest
    {
        
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly OrderService _orderService;
        private readonly Mock<IIssueNoteRepository> _issueNoteRepositoryMock;

        public GetOrderConfirmAndCreateIssueTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _issueNoteRepositoryMock = new Mock<IIssueNoteRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                _issueNoteRepositoryMock.Object,null,
                _ordersDetailRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object);
        }
        #region get list confirm order

        [Fact]
        public async Task GetOrderNeedConfirm_WhenNoOrdersExist_ReturnsEmptyResponse()
        {
            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(new List<Order>());

            var result = await _orderService.GetOrderNeedConfirm();

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetOrderNeedConfirm_WhenOrdersExist_ReturnsOrders()
        {

             var orders = new List<Order>
            {
                new Order { OrderId = 1, Status = 1 },
                new Order { OrderId = 2, Status = 1 },
                new Order { OrderId = 3, Status = 1 }
            };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(orders);


            _mapperMock.Setup(m => m.Map<IEnumerable<OrderDto>>(It.IsAny<IEnumerable<Order>>())).Returns(orders.Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                Status = o.Status
            }));

            var result = await _orderService.GetOrderNeedConfirm();


            Assert.Equal(orders.Count, result.Data.Count());
            Assert.True(result.Success);
        }

        [Fact]
        public async Task GetOrderNeedConfirm_WhenOrdersAnotherExist_ReturnsOrders()
        {

            var orders = new List<Order>
    {
        new Order { OrderId = 1, Status = 1 },
        new Order { OrderId = 2, Status = 2 },
        new Order { OrderId = 3, Status = 3 }
    };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<Order, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>()))
                .ReturnsAsync(orders.Where(o => o.Status == 3)); 

            _mapperMock.Setup(m => m.Map<IEnumerable<OrderDto>>(It.IsAny<IEnumerable<Order>>()))
                .Returns((IEnumerable<Order> source) =>
                    source.Select(o => new OrderDto { OrderId = o.OrderId, Status = o.Status }));

            // Act
            var result = await _orderService.GetOrderNeedConfirm();

            // Assert
            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Single(result.Data);
            Assert.Equal(3, result.Data.First().OrderId);
        }
    

        [Fact]
        public async Task GetOrderNeedConfirm_WhenDatabaseError_ReturnFail()
        {
            var orders = new List<Order>
            {
                new Order { OrderId = 1, Status = 1 },
                new Order { OrderId = 2, Status = 2},
                new Order { OrderId = 3, Status = 3 }
            };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>()
            )).ThrowsAsync(new Exception("Lỗi kết nối cơ sở dữ liệu"));

            var result = await _orderService.GetOrderNeedConfirm();

            Assert.False(result.Success);  
            Assert.Equal("Lỗi kết nối cơ sở dữ liệu", result.Message);  
        }

        #endregion

        #region get list order to create issue note

        [Fact]
        public async Task GetOrderToCreateIssueTest_WhenNoOrdersExist_ReturnsEmptyResponse()
        {
            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(new List<Order>());

            var result = await _orderService.GetOrderToCreateIssueNoteList();

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetOrderToCreateIssueTest_WhenOrdersExist_ReturnsOrders()
        {
            var orders = new List<Order>
            {
                new Order { OrderId = 1, Status = 2, AssignTo = 1 },
                new Order { OrderId = 2, Status = 2, AssignTo = 1 },
                new Order { OrderId = 3, Status = 2, AssignTo = 1 }
            };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(orders);


            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _mapperMock.Setup(m => m.Map<IEnumerable<OrderDto>>(It.IsAny<IEnumerable<Order>>())).Returns(orders.Select(o => new OrderDto
            {
                OrderId = o.OrderId,
                Status = o.Status
            }));

            var result = await _orderService.GetOrderToCreateIssueNoteList();

            // Assert
            Assert.Equal(orders.Count, result.Data.Count());
            Assert.True(result.Success);
        }

        [Fact]
        public async Task GetOrderToCreateIssueTest_WhenOrdersAnotherExist_ReturnsOrders()
        {

            var orders = new List<Order>
            {
                new Order { OrderId = 1, Status = 1, AssignTo = 1 },
                new Order { OrderId = 2, Status = 2, AssignTo = 1 },
                new Order { OrderId = 3, Status = 3, AssignTo = 1 }
            };
            var ordersWithStatus1 = orders.Where(o => o.Status == 3).ToList();


            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(  
                It.IsAny<Expression<Func<Order, bool>>>(),   
                It.IsAny<string[]>(),   
                It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>()))  
                .ReturnsAsync(orders.Where(o => o.Status == 3));

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _mapperMock.Setup(m => m.Map<IEnumerable<OrderDto>>(ordersWithStatus1))
                .Returns(ordersWithStatus1.Select(o => new OrderDto
                {
                    OrderId = o.OrderId,
                    Status = o.Status
                }));

            var result = await _orderService.GetOrderNeedConfirm();

            Assert.Equal(1, result.Data.Count());
            Assert.True(result.Success);
        }
        [Fact]
        public async Task GetOrderToCreateIssueTest_WhenDatabaseError_ReturnFail()
        {
            var orders = new List<Order>
            {
                new Order { OrderId = 1, Status = 1 },
                new Order { OrderId = 2, Status = 2},
                new Order { OrderId = 3, Status = 3 }
            };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>()
            )).ThrowsAsync(new Exception("Lỗi kết nối cơ sở dữ liệu"));

            var result = await _orderService.GetOrderToCreateIssueNoteList();

            Assert.False(result.Success);  
            Assert.Equal("Lỗi kết nối cơ sở dữ liệu", result.Message);  
        }

        #endregion
    }
}
