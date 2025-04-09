using AutoMapper;
using Moq;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using PharmaDistiPro.DTO.ProductShortage;

namespace PharmaDistiPro.UnitTest.PurchaseOrderServiceTest
{
    public class CheckReceivedStockStatusTest
    {
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IPurchaseOrdersDetailRepository> _purchaseOrdersDetailRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PurchaseOrderService _purchaseOrderService;

        public CheckReceivedStockStatusTest()
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
        public async Task CheckReceivedStockStatus_WhenPurchaseOrderNotFound_ReturnsNotFound()
        {
            _purchaseOrderRepositoryMock.Setup(repo => repo.GetPoById(It.IsAny<int>()))
                .ReturnsAsync((PurchaseOrder)null);

            var result = await _purchaseOrderService.CheckReceivedStockStatus(1);

            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy đơn hàng", result.Message);
            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async Task CheckReceivedStockStatus_WhenNoShortage_ReturnsEmptyShortageList()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrdersDetails = new List<PurchaseOrdersDetail>
                {
                    new PurchaseOrdersDetail { ProductId = 1, Quantity = 10 },
                    new PurchaseOrdersDetail { ProductId = 2, Quantity = 5 }
                },
                ReceivedNotes = new List<ReceivedNote>
                {
                    new ReceivedNote
                    {
                        ReceivedNoteDetails = new List<ReceivedNoteDetail>
                        {
                            new ReceivedNoteDetail { ProductLot = new ProductLot { ProductId = 1 }, ActualReceived = 10 },
                            new ReceivedNoteDetail { ProductLot = new ProductLot { ProductId = 2 }, ActualReceived = 5 }
                        }
                    }
                }
            };

            _purchaseOrderRepositoryMock.Setup(repo => repo.GetPoById(It.IsAny<int>()))
                .ReturnsAsync(purchaseOrder);

            var result = await _purchaseOrderService.CheckReceivedStockStatus(1);

            Assert.True(result.Success);
            Assert.Empty(result.Data);
        }

        [Fact]
        public async Task CheckReceivedStockStatus_WhenShortageExists_ReturnsShortageList()
        {
            var product1 = new Product { ProductId = 1, ProductName = "Product 1" };
            var product2 = new Product { ProductId = 2, ProductName = "Product 2" };

            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetail>
        {
            new PurchaseOrdersDetail { ProductId = 1, Quantity = 10, Product = product1 },
            new PurchaseOrdersDetail { ProductId = 2, Quantity = 5, Product = product2 }
        },
                ReceivedNotes = new List<ReceivedNote>
        {
            new ReceivedNote
            {
                ReceivedNoteDetails = new List<ReceivedNoteDetail>
                {
                    new ReceivedNoteDetail { ProductLot = new ProductLot { ProductId = 1 }, ActualReceived = 8 },
                    new ReceivedNoteDetail { ProductLot = new ProductLot { ProductId = 2 }, ActualReceived = 5 }
                }
            }
        }
            };

            _purchaseOrderRepositoryMock.Setup(repo => repo.GetPoById(It.IsAny<int>()))
                .ReturnsAsync(purchaseOrder);

            var result = await _purchaseOrderService.CheckReceivedStockStatus(1);

            Assert.True(result.Success);
            Assert.Single(result.Data);
            var productShortage = result.Data.First();
            Assert.Equal(1, productShortage.ProductId);
            Assert.Equal(10, productShortage.OrderedQuantity);
            Assert.Equal(8, productShortage.ReceivedQuantity);
            Assert.Equal(2, productShortage.ShortageQuantity);
        }

        [Fact]
        public async Task CheckReceivedStockStatus_WhenExceptionOccurs_ReturnsError()
        {
            _purchaseOrderRepositoryMock.Setup(repo => repo.GetPoById(It.IsAny<int>()))
                .ThrowsAsync(new Exception("Lỗi kết nối database"));

            var result = await _purchaseOrderService.CheckReceivedStockStatus(1);

            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối database", result.Message);
            Assert.Equal(500, result.StatusCode);
        }
    }
}
