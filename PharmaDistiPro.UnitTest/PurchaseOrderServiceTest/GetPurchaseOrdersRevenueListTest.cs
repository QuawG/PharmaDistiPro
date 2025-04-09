using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.PurchaseOrders;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.UnitTest.PurchaseOrderServiceTest
{
    public class GetPurchaseOrdersRevenueListTest
    {
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IPurchaseOrdersDetailRepository> _purchaseOrdersDetailRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PurchaseOrderService _purchaseOrderService;

        public GetPurchaseOrdersRevenueListTest()
        {
            _purchaseOrderRepositoryMock = new Mock<IPurchaseOrderRepository>();
            _purchaseOrdersDetailRepositoryMock = new Mock<IPurchaseOrdersDetailRepository>();
            _mapperMock = new Mock<IMapper>();

            _purchaseOrderService = new PurchaseOrderService(
                _purchaseOrderRepositoryMock.Object,
                _purchaseOrdersDetailRepositoryMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task GetPurchaseOrdersRevenueList_WhenSuccess_ReturnsRevenueData()
        {
            // Arrange
            var mockPurchaseOrders = new List<PurchaseOrder>
            {
                new PurchaseOrder
                {
                    PurchaseOrderId = 1,
                    Status = (int)PurchaseOrderStatus.HOAN_THANH,
                    CreateDate = DateTime.UtcNow,
                    CreatedByNavigation = new User { UserName = "admin" },
                    Supplier = new Supplier { SupplierName = "ABC Pharma" }
                },
                new PurchaseOrder
                {
                    PurchaseOrderId = 2,
                    Status = (int)PurchaseOrderStatus.HOAN_THANH,
                    CreateDate = DateTime.UtcNow.AddDays(-2),
                    CreatedByNavigation = new User { UserName = "staff" },
                    Supplier = new Supplier { SupplierName = "XYZ Pharma" }
                }
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<PurchaseOrder, bool>>>(),
                    It.Is<string[]>(includes => includes.Contains("CreatedByNavigation") && includes.Contains("Supplier")),
                    null))
                .ReturnsAsync(mockPurchaseOrders);

            _mapperMock
                .Setup(m => m.Map<IEnumerable<PurchaseOrdersDto>>(It.IsAny<IEnumerable<PurchaseOrder>>()))
                .Returns(mockPurchaseOrders.Select(po => new PurchaseOrdersDto
                {
                    PurchaseOrderId = po.PurchaseOrderId,
                    Status = po.Status ?? 0
                }));

            // Act
            var result = await _purchaseOrderService.GetPurchaseOrdersRevenueList(null, null);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
            Assert.Contains(result.Data, x => x.PurchaseOrderId == 1);
            Assert.Contains(result.Data, x => x.PurchaseOrderId == 2);
        }

        [Fact]
        public async Task GetPurchaseOrdersRevenueList_WhenDateFromGreaterThanDateTo_ReturnsFailure()
        {
            // Arrange
            var dateFrom = DateTime.UtcNow;
            var dateTo = DateTime.UtcNow.AddDays(-2); // Lỗi logic

            // Act
            var result = await _purchaseOrderService.GetPurchaseOrdersRevenueList(dateFrom, dateTo);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message); // Hoặc custom lỗi nếu có
        }

        [Fact]
        public async Task GetPurchaseOrdersRevenueList_WhenParamsAreNull_ReturnsAllData()
        {
            // Arrange
            var mockPurchaseOrders = new List<PurchaseOrder>
    {
        new PurchaseOrder
        {
            PurchaseOrderId = 1,
            Status = (int)PurchaseOrderStatus.HOAN_THANH,
            CreateDate = DateTime.UtcNow
        }
    };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<PurchaseOrder, bool>>>(),
                    It.IsAny<string[]>(),
                    null))
                .ReturnsAsync(mockPurchaseOrders);

            _mapperMock
                .Setup(m => m.Map<IEnumerable<PurchaseOrdersDto>>(It.IsAny<IEnumerable<PurchaseOrder>>()))
                .Returns(mockPurchaseOrders.Select(po => new PurchaseOrdersDto
                {
                    PurchaseOrderId = po.PurchaseOrderId,
                    Status = po.Status ?? 0
                }));

            // Act
            var result = await _purchaseOrderService.GetPurchaseOrdersRevenueList(null, null);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Single(result.Data);
            Assert.Equal(1, result.Data.Count());
        }

        [Fact]
        public async Task GetPurchaseOrdersRevenueList_WhenDbThrowsException_ReturnsFailure()
        {
            // Arrange
            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<PurchaseOrder, bool>>>(), It.IsAny<string[]>(), null))
                .ThrowsAsync(new Exception("Lỗi kết nối database"));

            // Act
            var result = await _purchaseOrderService.GetPurchaseOrdersRevenueList(null, null);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối database", result.Message);
        }

    }
}
