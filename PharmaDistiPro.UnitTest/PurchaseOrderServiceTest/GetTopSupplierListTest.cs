using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.PurchaseOrderServiceTest
{
    public class GetTopSupplierListTest
    {
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IPurchaseOrdersDetailRepository> _purchaseOrdersDetailRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PurchaseOrderService _purchaseOrderService;

        public GetTopSupplierListTest()
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
        public async Task GetTopSupplierList_WhenNoPurchaseOrders_ReturnsEmptyList()
        {
            // Arrange
            _purchaseOrderRepositoryMock
     .Setup(repo => repo.GetByConditionAsync(
         It.IsAny<Expression<Func<PurchaseOrder, bool>>>(),
         It.Is<string[]>(includes => includes.Contains("CreatedByNavigation") && includes.Contains("Supplier")),
         null)).ReturnsAsync(new List<PurchaseOrder>());

            // Act
            var result = await _purchaseOrderService.GetTopSupplierList(5);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Empty(result.Data); // Danh sách trả về rỗng
        }
        [Fact]
        public async Task GetTopSupplierList_WhenDataExists_ReturnsTopSuppliers()
        {
            // Arrange
            var purchaseOrders = new List<PurchaseOrder> 
            { 
                new PurchaseOrder { SupplierId = 1, TotalAmount = 1000, Status = (int)PurchaseOrderStatus.HOAN_THANH },
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<PurchaseOrder, bool>>>(),
                    It.Is<string[]>(includes => includes.Contains("CreatedByNavigation") && includes.Contains("Supplier")),
                    null))
                .ReturnsAsync(purchaseOrders);

            var supplierDto = new SupplierDTO { Id = 1 };  
            _mapperMock.Setup(m => m.Map<SupplierDTO>(It.IsAny<Supplier>())).Returns(supplierDto);

            // Act
            var result = await _purchaseOrderService.GetTopSupplierList(1);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
        }

        [Fact]
        public async Task GetTopSupplierList_WhenExceptionOccurs_ReturnsError()
        {
          
            _purchaseOrderRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<PurchaseOrder, bool>>>(),
                It.Is<string[]>(includes => includes.Contains("CreatedByNavigation") && includes.Contains("Supplier")),null))
                .ThrowsAsync(new Exception("Lỗi kết nối database"));

            var result = await _purchaseOrderService.GetTopSupplierList(5);

            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối database", result.Message);
        }

    }
}
