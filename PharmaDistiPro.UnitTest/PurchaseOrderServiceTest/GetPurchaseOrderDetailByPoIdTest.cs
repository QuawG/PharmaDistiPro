using Moq;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;
using AutoMapper;
using PharmaDistiPro.Models;
using PharmaDistiPro.DTO;
using System.Linq;
using PharmaDistiPro.DTO.PurchaseOrdersDetails;
using System.Linq.Expressions;

namespace PharmaDistiPro.UnitTest.PurchaseOrderServiceTest
{
    public class GetPurchaseOrderDetailByPoIdTest
    {
        private readonly Mock<IPurchaseOrdersDetailRepository> _purchaseOrdersDetailRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PurchaseOrderService _purchaseOrderService;

        public GetPurchaseOrderDetailByPoIdTest()
        {
            _purchaseOrdersDetailRepositoryMock = new Mock<IPurchaseOrdersDetailRepository>();
            _mapperMock = new Mock<IMapper>();

            _purchaseOrderService = new PurchaseOrderService(
                null,  // other dependencies are not relevant here
                _purchaseOrdersDetailRepositoryMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task GetPurchaseOrderDetailByPoId_WhenPoIdIsNull_ReturnsErrorResponse()
        {
            int id = -10;
            _purchaseOrdersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(  
                It.IsAny<Expression<Func<PurchaseOrdersDetail, bool>>>(),   
                It.IsAny<string[]>(),  
                It.IsAny<Func<IQueryable<PurchaseOrdersDetail>, IOrderedQueryable<PurchaseOrdersDetail>>>()))
                .ThrowsAsync(new Exception("Purchase Order Id không hợp lệ"));
            var result = await _purchaseOrderService.GetPurchaseOrderDetailByPoId(id);

            Assert.False(result.Success);
            Assert.Equal("Purchase Order Id không hợp lệ", result.Message);
        }

        [Fact]
        public async Task GetPurchaseOrderDetailByPoId_WhenNoRecordsFound_ReturnsNotFoundResponse()
        {
            var poId = 1;
            _purchaseOrdersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<PurchaseOrdersDetail, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<PurchaseOrdersDetail>, IOrderedQueryable<PurchaseOrdersDetail>>>()
            )).ReturnsAsync(new List<PurchaseOrdersDetail>());

            var result = await _purchaseOrderService.GetPurchaseOrderDetailByPoId(poId);

            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetPurchaseOrderDetailByPoId_WhenDatabaseErrorOccurs_ReturnsErrorResponse()
        {
            var poId = 1;
            _purchaseOrdersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<PurchaseOrdersDetail, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<PurchaseOrdersDetail>, IOrderedQueryable<PurchaseOrdersDetail>>>()
            )).ThrowsAsync(new Exception("Lỗi kết nối database"));

            var result = await _purchaseOrderService.GetPurchaseOrderDetailByPoId(poId);

            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối database", result.Message);
        }

        [Fact]
        public async Task GetPurchaseOrderDetailByPoId_WhenPurchaseOrderExist_ReturnsSuccessResponse()
        {
            var poId = 1;
            var purchaseOrderDetails = new List<PurchaseOrdersDetail>
    {
        new PurchaseOrdersDetail { PurchaseOrderId = poId, ProductId = 1, Quantity = 10 },
        new PurchaseOrdersDetail { PurchaseOrderId = poId, ProductId = 2, Quantity = 20 }
    };

            var purchaseOrdersDetailDtos = new List<PurchaseOrdersDetailDto>
    {
        new PurchaseOrdersDetailDto { PurchaseOrderId = poId, ProductId = 1, Quantity = 10 },
        new PurchaseOrdersDetailDto { PurchaseOrderId = poId, ProductId = 2, Quantity = 20 }
    };

            _purchaseOrdersDetailRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                It.IsAny<Expression<Func<PurchaseOrdersDetail, bool>>>(),
                It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<PurchaseOrdersDetail>, IOrderedQueryable<PurchaseOrdersDetail>>>()
            )).ReturnsAsync(purchaseOrderDetails);

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<PurchaseOrdersDetailDto>>(purchaseOrderDetails))
                       .Returns(purchaseOrdersDetailDtos);

            var result = await _purchaseOrderService.GetPurchaseOrderDetailByPoId(poId);

            Assert.True(result.Success);
            Assert.Equal(2, result.Data.Count());
            Assert.Equal(10, result.Data.First().Quantity);
            Assert.Equal(20, result.Data.Last().Quantity);
        }

    }
}
