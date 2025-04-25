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
    public class GetAllOrdersTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly OrderService _orderService;

        public GetAllOrdersTest()
        {
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _orderService = new OrderService(
                _orderRepositoryMock.Object,
                null, null,
                _ordersDetailRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object);
        }

        [Fact]
        public async Task GetAllOrders_WhenNoOrdersExist_ReturnsEmptyResponse()
        {
            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(new List<Order>());

            var result = await _orderService.GetAllOrders(new int[] { }, null, null);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetAllOrders_WhenInvalidDateFormat_ThrowsArgumentException()
        {
            DateTime invalidDate = DateTime.MinValue; 


            var result = await _orderService.GetAllOrders(new int[] { }, invalidDate, invalidDate);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetAllOrders_WhenOrdersExist_ReturnsOrders()
        {
            var orders = new List<Order>
            {
                new Order { OrderId = 1, CreatedDate = DateTime.Now },
                new Order { OrderId = 2, CreatedDate = DateTime.Now }
            };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>())).ReturnsAsync(orders);

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<OrderDto>>(orders)).
                Returns(orders.Select(o => new OrderDto { OrderId = o.OrderId, CreatedDate = o.CreatedDate }));

            var result = await _orderService.GetAllOrders(new int[] { }, null, null);

            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetAllOrders_WhenOrdersMatchFilter_ReturnsFilteredOrders()
        {

            var orders = new List<Order>   
            {       
                new Order { OrderId = 1, Status = 1, CreatedDate = new DateTime(2024, 1, 10) },       
                new Order { OrderId = 2, Status = 2, CreatedDate = new DateTime(2024, 1, 15) },       
                new Order { OrderId = 3, Status = 3, CreatedDate = new DateTime(2024, 2, 1) }   
            };

            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>()
            )).ReturnsAsync(orders);

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<OrderDto>>(orders)).
               Returns(orders.Select(o => new OrderDto { OrderId = o.OrderId, CreatedDate = o.CreatedDate }));

            var result = await _orderService.GetAllOrders(new int[] { 1 }, new DateTime(2024, 1, 1), new DateTime(2024, 1, 31));


            Assert.NotNull(result.Data);
            Assert.True(result.Success);
            Assert.Equal(1, result.Data.First().OrderId); 
        }

        [Fact]
        public async Task GetAllOrders_WhenDatabaseException_ReturnsErrorResponse()
        {

            var orders = new List<Order>    
            {     
                new Order { OrderId = 1, Status = 1, CreatedDate = new DateTime(2024, 1, 10) },       
                new Order { OrderId = 2, Status = 2, CreatedDate = new DateTime(2024, 1, 15) },     
                new Order { OrderId = 3, Status = 3, CreatedDate = new DateTime(2024, 2, 1) }   
            };


            _orderRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<Order, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<Order>, IOrderedQueryable<Order>>>()
            )).ThrowsAsync(new Exception("Lỗi kết nối cơ sở dữ liệu"));


            var result = await _orderService.GetAllOrders(new int[] { 1 }, null,null);


            Assert.False(result.Success);  
            Assert.Equal("Lỗi kết nối cơ sở dữ liệu", result.Message);  
        }
    }
}
