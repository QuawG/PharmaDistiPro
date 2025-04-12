using Xunit;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.DTO.ReceivedNotes;
using PharmaDistiPro.Models;
using AutoMapper;
using PharmaDistiPro.Helper;

namespace PharmaDistiPro.Tests.ReceivedNoteServicesTest
{
    public class ReceivedNoteServiceTests
    {
        private readonly Mock<IReceivedNoteRepository> _receivedNoteRepositoryMock;
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ReceivedNoteService _service;

        public ReceivedNoteServiceTests()
        {
            _receivedNoteRepositoryMock = new Mock<IReceivedNoteRepository>();
            _purchaseOrderRepositoryMock = new Mock<IPurchaseOrderRepository>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _mapperMock = new Mock<IMapper>();

            var context = new DefaultHttpContext();
            context.User = GetMockUser();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

            _service = new ReceivedNoteService(
                _receivedNoteRepositoryMock.Object,
                _httpContextAccessorMock.Object,
                _mapperMock.Object,
                _purchaseOrderRepositoryMock.Object
            );
        }

        private ClaimsPrincipal GetMockUser()
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", "1")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            return new ClaimsPrincipal(identity);
        }

        [Fact]
        public async Task CreateReceiveNote_PurchaseOrderNotFound_ReturnsNotFound()
        {
            var request = new ReceivedNoteRequest { PurchaseOrderId = 1 };

            _purchaseOrderRepositoryMock.Setup(x => x.GetPoById(1))
                .ReturnsAsync((PurchaseOrder)null);

            var result = await _service.CreateReceiveNote(request);

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy đơn đặt hàng!", result.Message);
        }

        [Fact]
        public async Task CreateReceiveNote_ProductLotNotFound_ReturnsNotFound()
        {
            var request = new ReceivedNoteRequest
            {
                PurchaseOrderId = 1,
                Status = 1,
                ReceivedNoteDetail = new List<ReceivedNoteDetailRequest>
                {
                    new ReceivedNoteDetailRequest { ProductLotId = 10, ActualReceived = 5 }
                }
            };

            _purchaseOrderRepositoryMock.Setup(x => x.GetPoById(1))
                .ReturnsAsync(new PurchaseOrder());

            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNote(It.IsAny<ReceivedNote>()))
                .ReturnsAsync(new ReceivedNote { ReceiveNoteId = 100 });

            _receivedNoteRepositoryMock.Setup(x => x.GetProductLotById(10))
                .ReturnsAsync((ProductLot)null);

            var result = await _service.CreateReceiveNote(request);

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy lô hàng!", result.Message);
        }

        [Fact]
        public async Task CreateReceiveNote_AllValid_ReturnsSuccess()
        {
            var request = new ReceivedNoteRequest
            {
                PurchaseOrderId = 1,
                Status = 1,
                ReceivedNoteDetail = new List<ReceivedNoteDetailRequest>
                {
                    new ReceivedNoteDetailRequest { ProductLotId = 10, ActualReceived = 5 }
                }
            };

            _purchaseOrderRepositoryMock.Setup(x => x.GetPoById(1))
                .ReturnsAsync(new PurchaseOrder());

            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNote(It.IsAny<ReceivedNote>()))
                .ReturnsAsync(new ReceivedNote { ReceiveNoteId = 100 });

            _receivedNoteRepositoryMock.Setup(x => x.GetProductLotById(10))
                .ReturnsAsync(new ProductLot { ProductLotId = 10, Quantity = 10 });

            _receivedNoteRepositoryMock.Setup(x => x.UpdateProductLot(It.IsAny<ProductLot>()))
                .ReturnsAsync(new ProductLot { ProductLotId = 10, Quantity = 15 });

            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNoteDetail(It.IsAny<ReceivedNoteDetail>()))
                .ReturnsAsync(new ReceivedNoteDetail());

            var result = await _service.CreateReceiveNote(request);

            Assert.True(result.Success);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async Task CreateReceiveNote_WhenReceivedNoteRequestNull_ReturnsBadRequest()
        {
            var request = new ReceivedNoteRequest
            {
                PurchaseOrderId = 1,
                Status = 1,
                ReceivedNoteDetail = new List<ReceivedNoteDetailRequest>
        {
            new ReceivedNoteDetailRequest { ProductLotId = 10, ActualReceived = 0 }
        }
            };

            _purchaseOrderRepositoryMock.Setup(x => x.GetPoById(1))
                .ReturnsAsync(new PurchaseOrder());

            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNote(It.IsAny<ReceivedNote>()))
                .ThrowsAsync(new Exception("Phiếu nhập không được để rỗng"));

            var result = await _service.CreateReceiveNote(request);

            Assert.False(result.Success);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Phiếu nhập không được để rỗng", result.Message);
        }

        [Fact]
        public async Task CreateReceiveNote_PartialReceived_ShouldSetStatusToShortage()
        {
            // Arrange
            var purchaseOrderId = 1;
            var productLotId = 10;
            var productId = 99;

            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = purchaseOrderId,
                Status = 0,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetail>
        {
            new PurchaseOrdersDetail
            {
                ProductId = productId,
                Quantity = 100
            }
        },
                ReceivedNotes = new List<ReceivedNote>()
            };

            var productLot = new ProductLot
            {
                ProductLotId = productLotId,
                ProductId = productId,
                Quantity = 0
            };

            var request = new ReceivedNoteRequest
            {
                PurchaseOrderId = purchaseOrderId,
                Status = 1,
                ReceivedNoteDetail = new List<ReceivedNoteDetailRequest>
        {
            new ReceivedNoteDetailRequest
            {
                ProductLotId = productLotId,
                ActualReceived = 70
            }
        }
            };

            _purchaseOrderRepositoryMock.Setup(repo => repo.GetPoById(purchaseOrderId))
                .ReturnsAsync(purchaseOrder);

            _receivedNoteRepositoryMock.Setup(repo => repo.GetProductLotById(productLotId))
                .ReturnsAsync(productLot);

            _receivedNoteRepositoryMock.Setup(repo => repo.UpdateProductLot(It.IsAny<ProductLot>()))
                .ReturnsAsync((ProductLot pl) => pl);

            _receivedNoteRepositoryMock.Setup(repo => repo.CreateReceivedNote(It.IsAny<ReceivedNote>()))
                .ReturnsAsync((ReceivedNote rn) =>
                {
                    rn.ReceiveNoteId = 1;
                    rn.ReceivedNoteDetails = new List<ReceivedNoteDetail>();
                    return rn;
                });

            _receivedNoteRepositoryMock.Setup(repo => repo.CreateReceivedNoteDetail(It.IsAny<ReceivedNoteDetail>()))
                .ReturnsAsync((ReceivedNoteDetail rnd) => rnd);

            _receivedNoteRepositoryMock.Setup(repo => repo.GetReceivedNoteDetailsByPurchaseOrderId(purchaseOrderId))
                .ReturnsAsync(new List<ReceivedNoteDetail>());

            _purchaseOrderRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<PurchaseOrder>()));

            _purchaseOrderRepositoryMock.Setup(repo => repo.SaveAsync());

            _mapperMock.Setup(m => m.Map<ReceivedNoteDto>(It.IsAny<ReceivedNote>()))
                .Returns(new ReceivedNoteDto());

            // Act
            var result = await _service.CreateReceiveNote(request);

            // Assert
            Assert.True(result.Success);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Tạo phiếu nhập thành công nhưng còn thiếu hàng!", result.Message);


        }

        [Fact]
        public async Task CreateReceiveNote_UpdateProductLotFailed_ReturnsServerError()
        {
            // Arrange
            var request = new ReceivedNoteRequest
            {
                PurchaseOrderId = 1,
                Status = 1,
                ReceivedNoteDetail = new List<ReceivedNoteDetailRequest>
        {
            new ReceivedNoteDetailRequest { ProductLotId = 10, ActualReceived = 5 }
        }
            };

            _purchaseOrderRepositoryMock.Setup(x => x.GetPoById(1))
                .ReturnsAsync(new PurchaseOrder());

            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNote(It.IsAny<ReceivedNote>()))
                .ReturnsAsync(new ReceivedNote { ReceiveNoteId = 1 });

            _receivedNoteRepositoryMock.Setup(x => x.GetProductLotById(10))
                .ReturnsAsync(new ProductLot { ProductLotId = 10, Quantity = 10 });

            // Giả lập lỗi khi cập nhật lô hàng
            _receivedNoteRepositoryMock.Setup(x => x.UpdateProductLot(It.IsAny<ProductLot>()))
                .ReturnsAsync((ProductLot)null);

            var result = await _service.CreateReceiveNote(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Lỗi khi cập nhật lô hàng!", result.Message);
        }
        [Fact]
        public async Task CreateReceiveNote_CreateReceivedNoteDetailFailed_ReturnsServerError()
        {
            // Arrange
            var request = new ReceivedNoteRequest
            {
                PurchaseOrderId = 1,
                Status = 1,
                ReceivedNoteDetail = new List<ReceivedNoteDetailRequest>
        {
            new ReceivedNoteDetailRequest { ProductLotId = 10, ActualReceived = 5 }
        }
            };

            _purchaseOrderRepositoryMock.Setup(x => x.GetPoById(1))
                .ReturnsAsync(new PurchaseOrder());

            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNote(It.IsAny<ReceivedNote>()))
                .ReturnsAsync(new ReceivedNote { ReceiveNoteId = 1 });

            _receivedNoteRepositoryMock.Setup(x => x.GetProductLotById(10))
                .ReturnsAsync(new ProductLot { ProductLotId = 10, Quantity = 10 });

            _receivedNoteRepositoryMock.Setup(x => x.UpdateProductLot(It.IsAny<ProductLot>()))
                .ReturnsAsync(new ProductLot { ProductLotId = 10, Quantity = 15 });

            // Giả lập lỗi khi tạo chi tiết phiếu nhập
            _receivedNoteRepositoryMock.Setup(x => x.CreateReceivedNoteDetail(It.IsAny<ReceivedNoteDetail>()))
                .ReturnsAsync((ReceivedNoteDetail)null);

            var result = await _service.CreateReceiveNote(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Lỗi khi tạo chi tiết phiếu nhập!", result.Message);
        }

    }

}
