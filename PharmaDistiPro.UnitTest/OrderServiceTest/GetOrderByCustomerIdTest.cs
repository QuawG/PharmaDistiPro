using AutoMapper;
using MailKit.Search;
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
    public class GetOrderByCustomerIdTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly OrderService _orderService;

        public GetOrderByCustomerIdTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                null,null,
                _ordersDetailRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object);
        }


        [Fact]
        public async Task GetOrderByCustomerId_WhenCalled_ReturnsOrderList()
        {
            // Arrange
            int customerId = 1;
            var orderList = new List<Order>      
            {
            new Order
            {
                OrderId = 1,
                CustomerId = customerId
            },
            new Order
            {
                OrderId = 2,
                CustomerId = customerId
            }   };
            orderList = orderList.Where(x => x.CustomerId == customerId).ToList();
            orderList = orderList.OrderByDescending(x => x.OrderId).ToList();

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(       
                It.IsAny<Expression<Func<Order, bool>>>(),        
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(orderList);

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<OrderDto>>(orderList)).
                 Returns(orderList.Select(o => new OrderDto { OrderId = o.OrderId, CustomerId = o.CustomerId }));
            // Act
            var result = await _orderService.GetOrderByCustomerId();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Data.Count());
            Assert.Equal(customerId, result.Data.First().CustomerId);
        }

        [Fact]
        public async Task GetOrderByCustomerId_WhenCustomerIdNull_ReturnsNull()
        {
            // Arrange
            int customerId = 1;
            var orderList = new List<Order>
            {
            new Order { OrderId = 1,CustomerId = 2 },
            new Order { OrderId = 2, CustomerId = 3}};
            orderList = orderList.Where(x => x.CustomerId == customerId).ToList();

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<Order, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(orderList);

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "99") });

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<OrderDto>>(orderList)).
                 Returns(orderList.Select(o => new OrderDto { OrderId = o.OrderId, CustomerId = o.CustomerId }));
            // Act
            var result = await _orderService.GetOrderByCustomerId();

            // Assert
            Assert.Equal(0, result.Data.Count());
        }

        [Fact]
        public async Task GetOrderByCustomerId_WhenOrderNull_ReturnsNullData()
        {

            List<Order> orderList = new List<Order>();
            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<Order, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(orderList);

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", "1") });

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<OrderDto>>(orderList)).
                 Returns(orderList.Select(o => new OrderDto { OrderId = o.OrderId, CustomerId = o.CustomerId }));
            // Act
            var result = await _orderService.GetOrderByCustomerId();

            Assert.Equal(0, result.Data.Count());
        }
    }
}
