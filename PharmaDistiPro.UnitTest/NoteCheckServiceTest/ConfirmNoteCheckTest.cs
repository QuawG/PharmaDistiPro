using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.UnitTest.  NoteCheckServiceTest
{
    public class ConfirmNoteCheckTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;

        public ConfirmNoteCheckTest()
        {
            _noteCheckRepositoryMock = new Mock<INoteCheckRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            // Setup HttpContext
            var httpContext = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            _noteCheckService = new NoteCheckService(
                _noteCheckRepositoryMock.Object,
                _mapperMock.Object,
                _productLotRepositoryMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object
            );
        }

        [Fact]
        public async Task ConfirmNoteCheckAsync_ValidNoteCheck_ReturnsNoteCheckDTO()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck
            {
                NoteCheckId = noteCheckId,
                Status = false,
                NoteCheckDetails = new List<NoteCheckDetail>
                {
                    new NoteCheckDetail { ProductLotId = 1, ActualQuantity = 8 }
                }
            };
            var productLot = new ProductLot { ProductLotId = 1, Quantity = 10 };
            var noteCheckDto = new NoteCheckDTO { NoteCheckId = noteCheckId, Status = true };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null)).ReturnsAsync(productLot);
            _productLotRepositoryMock.Setup(r => r.UpdateAsyncProductLot(It.IsAny<ProductLot>())).Returns(Task.CompletedTask);
            _noteCheckRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<NoteCheck>())).ReturnsAsync(noteCheck); // Return Task<NoteCheck>
            _noteCheckRepositoryMock.Setup(r => r.SaveAsync()).ReturnsAsync(1); // Return Task<int>
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);

            // Act
            var result = await _noteCheckService.ConfirmNoteCheckAsync(noteCheckId);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Status);
            _productLotRepositoryMock.Verify(r => r.UpdateAsyncProductLot(It.Is<ProductLot>(pl => pl.Quantity == 8)), Times.Once);
        }

        [Fact]
        public async Task ConfirmNoteCheckAsync_NoteCheckNotFound_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync((NoteCheck)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.ConfirmNoteCheckAsync(noteCheckId));
            Assert.Equal("Không tìm thấy đơn kiểm kê.", exception.Message);
        }

        [Fact]
        public async Task ConfirmNoteCheckAsync_AlreadyConfirmed_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck { NoteCheckId = noteCheckId, Status = true };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.ConfirmNoteCheckAsync(noteCheckId));
            Assert.Equal("Đơn kiểm kê này đã được duyệt.", exception.Message);
        }

        [Fact]
        public async Task ConfirmNoteCheckAsync_ProductLotNotFound_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck
            {
                NoteCheckId = noteCheckId,
                Status = false,
                NoteCheckDetails = new List<NoteCheckDetail>
                {
                    new NoteCheckDetail { ProductLotId = 1, ActualQuantity = 8 }
                }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null)).ReturnsAsync((ProductLot)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.ConfirmNoteCheckAsync(noteCheckId));
            Assert.Equal("Không tìm thấy lô sản phẩm với ID 1.", exception.Message);
        }

        [Fact]
        public async Task ConfirmNoteCheckAsync_MultipleDetails_UpdatesAllProductLots()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck
            {
                NoteCheckId = noteCheckId,
                Status = false,
                NoteCheckDetails = new List<NoteCheckDetail>
                {
                    new NoteCheckDetail { ProductLotId = 1, ActualQuantity = 8 },
                    new NoteCheckDetail { ProductLotId = 2, ActualQuantity = 5 }
                }
            };
            var productLot1 = new ProductLot { ProductLotId = 1, Quantity = 10 };
            var productLot2 = new ProductLot { ProductLotId = 2, Quantity = 7 };
            var noteCheckDto = new NoteCheckDTO { NoteCheckId = noteCheckId, Status = true };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.Is<Expression<Func<ProductLot, bool>>>(expr => expr.Compile()(productLot1)), null)).ReturnsAsync(productLot1);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.Is<Expression<Func<ProductLot, bool>>>(expr => expr.Compile()(productLot2)), null)).ReturnsAsync(productLot2);
            _productLotRepositoryMock.Setup(r => r.UpdateAsyncProductLot(It.IsAny<ProductLot>())).Returns(Task.CompletedTask);
            _noteCheckRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<NoteCheck>())).ReturnsAsync(noteCheck); // Return Task<NoteCheck>
            _noteCheckRepositoryMock.Setup(r => r.SaveAsync()).ReturnsAsync(1); // Return Task<int>
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);

            // Act
            var result = await _noteCheckService.ConfirmNoteCheckAsync(noteCheckId);

            // Assert
            Assert.NotNull(result);
            _productLotRepositoryMock.Verify(r => r.UpdateAsyncProductLot(It.Is<ProductLot>(pl => pl.ProductLotId == 1 && pl.Quantity == 8)), Times.Once);
            _productLotRepositoryMock.Verify(r => r.UpdateAsyncProductLot(It.Is<ProductLot>(pl => pl.ProductLotId == 2 && pl.Quantity == 5)), Times.Once);
        }
    }
}