using Moq;
using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Xunit;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Linq.Expressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
namespace PharmaDistiPro.UnitTest.IssueNoteServiceTest
{
    public class CreateIssueNoteTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IIssueNoteRepository> _issueNoteRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IIssueNoteDetailsRepository> _issueNoteDetailsRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly IssueNoteService _issueNoteService;

        public CreateIssueNoteTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _issueNoteRepositoryMock = new Mock<IIssueNoteRepository>();
            _issueNoteDetailsRepositoryMock = new Mock<IIssueNoteDetailsRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _issueNoteService = new IssueNoteService(
                _orderRepositoryMock.Object,
                _issueNoteRepositoryMock.Object,
                _issueNoteDetailsRepositoryMock.Object,
                _ordersDetailRepositoryMock.Object,
                _productLotRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object
            );
        }
        [Fact]
        public async Task CreateIssueNoteTest_WhenNotFoundOrder_ReturnNullData()
        {
            _ordersDetailRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<OrdersDetail, bool>>>(), null, null))
                .ReturnsAsync(new List<OrdersDetail>());


            var result = await _issueNoteService.CreateIssueNote(999);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy đơn hàng", result.Message);
        }

        [Fact]
        public async Task CreateIssueNote_WhenValidData_ReturnSuccess()
        {
            int orderId = 1;
            var order = new Order
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = 101,
                TotalAmount = 1000,
                AssignTo = 1,
                OrdersDetails = new List<OrdersDetail>
        {
            new OrdersDetail { OrderDetailId = 1, OrderId = 1, ProductId = 1, Quantity = 5 }
        }
            };

            var productLots = new List<ProductLot>
    {
        new ProductLot { ProductLotId = 1, ProductId = 1, Quantity = 10 }
    };

            var issueNoteRequestDto = new IssueNoteRequestDto
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                CreatedBy = order.AssignTo
            };

            var issueNote = new IssueNote
            {
                IssueNoteId = 1,
                OrderId = orderId
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>()));
            _ordersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<OrdersDetail, bool>>>(), null, null))
                .ReturnsAsync(order.OrdersDetails);
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotsByProductIds(It.IsAny<List<int>>()))
                .ReturnsAsync(productLots);
            _issueNoteRepositoryMock.Setup(repo => repo.CountAsync(It.IsAny<Expression<Func<IssueNote, bool>>>())).ReturnsAsync(5);
            _issueNoteRepositoryMock.Setup(repo => repo.CreateIssueNote(It.IsAny<IssueNote>()));
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            // Giả lập Mapper
            _mapperMock.Setup(m => m.Map<IssueNote>(It.IsAny<IssueNoteRequestDto>())).Returns(issueNote);
            _mapperMock.Setup(m => m.Map<IssueNoteDto>(It.IsAny<IssueNote>())).Returns(new IssueNoteDto { IssueNoteId = issueNote.IssueNoteId });

            var response = await _issueNoteService.CreateIssueNote(orderId);

            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal(issueNote.IssueNoteId, response.Data.IssueNoteId);

            _orderRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Order>()), Times.Once);
            _issueNoteRepositoryMock.Verify(repo => repo.CreateIssueNote(It.IsAny<IssueNote>()), Times.Once);
            _orderRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Exactly(2));
        }

        [Fact]
        public async Task CreateIssueNote_WhenProductLotNotEnough_ReturnFail()
        {
            int orderId = 1;
            var order = new Order
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = 101,
                TotalAmount = 1000,
                AssignTo = 1,
                OrdersDetails = new List<OrdersDetail>
        {
            new OrdersDetail { OrderDetailId = 1, OrderId = 1, ProductId = 1, Quantity = 5 }
        }
            };

            var productLots = new List<ProductLot>
    {
        new ProductLot { ProductLotId = 1, ProductId = 1, Quantity = 0 }
    };

            var issueNoteRequestDto = new IssueNoteRequestDto
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                CreatedBy = order.AssignTo
            };

            var issueNote = new IssueNote
            {
                IssueNoteId = 1,
                OrderId = orderId
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>()));
            _ordersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<OrdersDetail, bool>>>(), null, null))
                .ReturnsAsync(order.OrdersDetails);
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotsByProductIds(It.IsAny<List<int>>()))
                .ReturnsAsync(productLots);
            _issueNoteRepositoryMock.Setup(repo => repo.CountAsync(It.IsAny<Expression<Func<IssueNote, bool>>>())).ReturnsAsync(5);
            _issueNoteRepositoryMock.Setup(repo => repo.CreateIssueNote(It.IsAny<IssueNote>()));
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            // Giả lập Mapper
            _mapperMock.Setup(m => m.Map<IssueNote>(It.IsAny<IssueNoteRequestDto>())).Returns(issueNote);
            _mapperMock.Setup(m => m.Map<IssueNoteDto>(It.IsAny<IssueNote>())).Returns(new IssueNoteDto { IssueNoteId = issueNote.IssueNoteId });

            var response = await _issueNoteService.CreateIssueNote(orderId);

            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.True(response.Message.Contains("Không đủ hàng để xuất kho cho sản phẩm ID"));

            _orderRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Order>()), Times.Once);
            _issueNoteRepositoryMock.Verify(repo => repo.CreateIssueNote(It.IsAny<IssueNote>()), Times.Once);
            _orderRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateIssueNote_WhenOrederStatusNotChange_ReturnFail()
        {
            int orderId = 1;
            var order = new Order
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = 101,
                TotalAmount = 1000,
                AssignTo = 1,
                OrdersDetails = new List<OrdersDetail>
                {
                    new OrdersDetail { OrderDetailId = 1, OrderId = 1, ProductId = 1, Quantity = 5 }
                }
            };
            var productLots = new List<ProductLot>

            {
                new ProductLot { ProductLotId = 1, ProductId = 1, Quantity = 0 }

            };
            var issueNoteRequestDto = new IssueNoteRequestDto
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                CreatedBy = order.AssignTo
            };

            var issueNote = new IssueNote
            {
                IssueNoteId = 1,
                OrderId = orderId
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>())).Throws(new Exception("Lỗi kết nối database"));


            var response = await _issueNoteService.CreateIssueNote(orderId);

            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.True(response.Message.Contains("Lỗi kết nối database"));

        }

        [Fact]
        public async Task CreateIssueNote_WhenProductLotNotFound_ReturnFail()
        {
            int orderId = 1;
            var order = new Order
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = 101,
                TotalAmount = 1000,
                AssignTo = 1,
                OrdersDetails = new List<OrdersDetail>
        {
            new OrdersDetail { OrderDetailId = 1, OrderId = 1, ProductId = 1000, Quantity = 5 }
        }
            };

            var productLots = new List<ProductLot>
    {
        new ProductLot { ProductLotId = 1, ProductId = 1000, Quantity = 0 }
    };

            var issueNoteRequestDto = new IssueNoteRequestDto
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                CreatedBy = order.AssignTo
            };

            var issueNote = new IssueNote
            {
                IssueNoteId = 1,
                OrderId = orderId
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>()));

            _ordersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<OrdersDetail, bool>>>(), null, null))
                .ReturnsAsync(order.OrdersDetails);
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotsByProductIds(It.IsAny<List<int>>()))
                .ThrowsAsync(new Exception("Không tìm thấy sản phẩm trong kho"));
            _issueNoteRepositoryMock.Setup(repo => repo.CountAsync(It.IsAny<Expression<Func<IssueNote, bool>>>())).ReturnsAsync(5);
            _issueNoteRepositoryMock.Setup(repo => repo.CreateIssueNote(It.IsAny<IssueNote>())).
                ThrowsAsync(new Exception("Không tìm thấy sản phẩm trong kho")); ;
            _orderRepositoryMock.Setup(repo => repo.SaveAsync()).
                ThrowsAsync(new Exception("Không tìm thấy sản phẩm trong kho")); ;



            // Giả lập Mapper
            _mapperMock.Setup(m => m.Map<IssueNote>(It.IsAny<IssueNoteRequestDto>())).Returns(issueNote);
            _mapperMock.Setup(m => m.Map<IssueNoteDto>(It.IsAny<IssueNote>())).Returns(new IssueNoteDto { IssueNoteId = issueNote.IssueNoteId });

            var response = await _issueNoteService.CreateIssueNote(orderId);

            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.True(response.Message.Contains("Không tìm thấy sản phẩm trong kho"));

        }

        [Fact]
        public async Task CreateIssueNote_WhenIssueNoteNotCreated_ReturnFail()
        {
            int orderId = 1;
            var order = new Order
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = 101,
                TotalAmount = 1000,
                AssignTo = 1,
                OrdersDetails = new List<OrdersDetail>
                {
                    new OrdersDetail { OrderDetailId = 1, OrderId = 1, ProductId = 1, Quantity = 5 }
                }
            };
            var productLots = new List<ProductLot>
            {
                new ProductLot { ProductLotId = 1, ProductId = 1, Quantity = 0 }
            };
            var issueNoteRequestDto = new IssueNoteRequestDto
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                CreatedBy = order.AssignTo
            };

            var issueNote = new IssueNote
            {
                IssueNoteId = 1,
                OrderId = orderId
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>()));
            _ordersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<OrdersDetail, bool>>>(), null, null))
                .ReturnsAsync(order.OrdersDetails);
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotsByProductIds(It.IsAny<List<int>>()))
                .ReturnsAsync(productLots);
            _issueNoteRepositoryMock.Setup(repo => repo.CountAsync(It.IsAny<Expression<Func<IssueNote, bool>>>())).ReturnsAsync(5);
            _issueNoteRepositoryMock.Setup(repo => repo.CreateIssueNote(It.IsAny<IssueNote>())).Throws(new Exception("Lỗi kết nối database"));
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            // Giả lập Mapper
            _mapperMock.Setup(m => m.Map<IssueNote>(It.IsAny<IssueNoteRequestDto>())).Returns(issueNote);
            _mapperMock.Setup(m => m.Map<IssueNoteDto>(It.IsAny<IssueNote>())).Returns(new IssueNoteDto { IssueNoteId = issueNote.IssueNoteId });

            var response = await _issueNoteService.CreateIssueNote(orderId);

            Assert.False(response.Success);
            Assert.Null(response.Data);

        }

        [Fact]
        public async Task CreateIssueNote_WhenMultipleProductLots_UsesFirstExpiredFirst_ReturnSuccess()
        {
            int orderId = 1;

            // Đơn hàng có 1 sản phẩm cần xuất 10 đơn vị
            var order = new Order
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = 101,
                TotalAmount = 1000,
                AssignTo = 1,
                OrdersDetails = new List<OrdersDetail>
        {
            new OrdersDetail { OrderDetailId = 1, OrderId = 1, ProductId = 1, Quantity = 10 }
        }
            };

            // 2 lô hàng, lô đầu tiên chỉ có 4 đơn vị, lô thứ hai có 10 đơn vị (đủ hàng)
            var productLots = new List<ProductLot>
        {
        new ProductLot { ProductLotId = 1, ProductId = 1, Quantity = 4, ExpiredDate = DateTime.Today.AddDays(5) },
        new ProductLot { ProductLotId = 2, ProductId = 1, Quantity = 10, ExpiredDate = DateTime.Today.AddDays(10) }
        };

            var issueNoteRequestDto = new IssueNoteRequestDto
            {
                OrderId = orderId,
                CreatedDate = DateTime.Now,
                Status = 2,
                CustomerId = order.CustomerId,
                TotalAmount = order.TotalAmount,
                CreatedBy = order.AssignTo
            };

            var issueNote = new IssueNote
            {
                IssueNoteId = 1,
                OrderId = orderId
            };

            _orderRepositoryMock.Setup(repo => repo.GetByIdAsync(orderId)).ReturnsAsync(order);
            _orderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Order>()));
            _ordersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<OrdersDetail, bool>>>(), null, null))
                .ReturnsAsync(order.OrdersDetails);
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotsByProductIds(It.IsAny<List<int>>()))
                .ReturnsAsync(productLots.OrderBy(p => p.ExpiredDate)); // Sắp xếp theo ngày hết hạn
            _issueNoteRepositoryMock.Setup(repo => repo.CountAsync(It.IsAny<Expression<Func<IssueNote, bool>>>())).ReturnsAsync(5);
            _issueNoteRepositoryMock.Setup(repo => repo.CreateIssueNote(It.IsAny<IssueNote>()));
            _orderRepositoryMock.Setup(repo => repo.SaveAsync());

            // Giả lập Mapper
            _mapperMock.Setup(m => m.Map<IssueNote>(It.IsAny<IssueNoteRequestDto>())).Returns(issueNote);
            _mapperMock.Setup(m => m.Map<IssueNoteDto>(It.IsAny<IssueNote>())).Returns(new IssueNoteDto { IssueNoteId = issueNote.IssueNoteId });

            var response = await _issueNoteService.CreateIssueNote(orderId);

            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal(issueNote.IssueNoteId, response.Data.IssueNoteId);
            Assert.Equal(4, productLots.FirstOrDefault(x => x.ProductLotId == 2).Quantity);

            _orderRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Order>()), Times.Once);
            _issueNoteRepositoryMock.Verify(repo => repo.CreateIssueNote(It.IsAny<IssueNote>()), Times.Once);
            _orderRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Exactly(2));

            // Kiểm tra số lượng tồn kho đã được trừ đúng
            _productLotRepositoryMock.Verify(repo => repo.UpdateAsync(It.Is<ProductLot>(p => p.ProductLotId == 1 && p.Quantity == 0)), Times.Once);
            _productLotRepositoryMock.Verify(repo => repo.UpdateAsync(It.Is<ProductLot>(p => p.ProductLotId == 2 && p.Quantity == 4)), Times.Once);
        }




    }
}

