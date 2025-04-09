using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.PurchaseOrders;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.PurchaseOrderServiceTest
{
    public class UpdatePurchaseOrderStatusTest
    {
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IPurchaseOrdersDetailRepository> _purchaseOrdersDetailRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PurchaseOrderService _purchaseOrderService;

        public UpdatePurchaseOrderStatusTest()
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
        public async Task UpdatePurchaseOrderStatus_WhenInvalidOrder_ReturnSuccess()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = 0
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(purchaseOrder);
            purchaseOrder.Status = 1;
            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ReturnsAsync(purchaseOrder);

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Equal(1, result.Data.Status);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenOrderNull_ReturnSuccess()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = 0
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((PurchaseOrder)null);
            purchaseOrder.Status = 1;
            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ReturnsAsync(purchaseOrder);

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenOrderNotFound_ReturnSuccess()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 999,
                Status = 0
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(purchaseOrder.PurchaseOrderId))
                .ReturnsAsync((PurchaseOrder)null);
            purchaseOrder.Status = 1;
            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ReturnsAsync(purchaseOrder);

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenStatusNull_ReturnSuccess()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = 0
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(purchaseOrder.PurchaseOrderId))
                .ReturnsAsync((purchaseOrder));

            purchaseOrder.Status = null;

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ThrowsAsync(new Exception("Trạng thái không được để trống"));

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Trạng thái không được để trống", result.Message);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenStatusInvalid_ReturnSuccess()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = 999
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(purchaseOrder.PurchaseOrderId))
                .ReturnsAsync((purchaseOrder));

            purchaseOrder.Status = null;

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ThrowsAsync(new Exception("Trạng thái này không tồn tại"));

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Trạng thái này không tồn tại", result.Message);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenStatusIsSame_ReturnSuccess()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = 1
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(purchaseOrder.PurchaseOrderId))
                .ReturnsAsync((purchaseOrder));

            purchaseOrder.Status = 1;

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ThrowsAsync(new Exception("Trạng thái này đã trùng với ban đầu"));

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Trạng thái này đã trùng với ban đầu", result.Message);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenOrderIsFinalized_ShouldReturnFailed()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = (int)Helper.Enums.PurchaseOrderStatus.HOAN_THANH
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(purchaseOrder.PurchaseOrderId))
                .ReturnsAsync((purchaseOrder));

            purchaseOrder.Status = 1;

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ThrowsAsync(new Exception("Đơn hàng đã hoàn thành không thể thay đổi"));

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Returns(new PurchaseOrdersDto
            {
                PurchaseOrderId = purchaseOrder.PurchaseOrderId,
                Status = purchaseOrder.Status
            });

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Đơn hàng đã hoàn thành không thể thay đổi", result.Message);
        }

        [Fact]
        public async Task UpdatePurchaseOrderStatus_WhenMapperError_ReturnFalse()
        {
            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                Status = 0
            };

            _purchaseOrderRepositoryMock
                .Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync(purchaseOrder);
            purchaseOrder.Status = 1;
            _purchaseOrderRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()))
                .ReturnsAsync(purchaseOrder);

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder)).Throws(new Exception("Lỗi khi mapper"));

            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(1, 1);
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.Equal("Lỗi khi mapper", result.Message);
        }

    }
}
