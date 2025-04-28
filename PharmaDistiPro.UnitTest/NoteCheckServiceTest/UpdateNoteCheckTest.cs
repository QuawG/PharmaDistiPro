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
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.NoteCheckServiceTest
{
    public class UpdateNoteCheckTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;
        public UpdateNoteCheckTest()
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
        public async Task UpdateNoteCheckAsync_ValidData_ReturnsUpdatedNoteCheckDTO()
        {
            // Arrange
            var noteCheckId = 1;
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 2,
                ReasonCheck = "Kiểm kê đột xuất",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>
        {
            new NoteCheckDetailRequestDTO { ProductLotId = 1, ActualQuantity = 7, ErrorQuantity = 3 }
        }
            };

            var existingNoteCheck = new NoteCheck
            {
                NoteCheckId = noteCheckId,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                Status = false,
                NoteCheckDetails = new List<NoteCheckDetail>()
            };
            var productLot = new ProductLot { ProductLotId = 1, ProductId = 101, Quantity = 10, LotId = 1 };
            var product = new Product { ProductId = 101, ProductName = "Paracetamol" };
            var updatedNoteCheckDto = new NoteCheckDTO { NoteCheckId = 1, StorageRoomId = 2, ReasonCheck = "Kiểm kê đột xuất", Status = false };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(existingNoteCheck);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null)).ReturnsAsync(productLot);
            _productLotRepositoryMock.Setup(r => r.GetProductByIdAsync(101)).ReturnsAsync(product);
            _noteCheckRepositoryMock.Setup(r => r.UpdateNoteCheckAsync(It.IsAny<NoteCheck>())).Returns(Task.CompletedTask);
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(updatedNoteCheckDto);

            // Act
            var result = await _noteCheckService.UpdateNoteCheckAsync(noteCheckId, request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updatedNoteCheckDto.StorageRoomId, result.StorageRoomId);
            _noteCheckRepositoryMock.Verify(r => r.UpdateNoteCheckAsync(It.IsAny<NoteCheck>()), Times.Once);
        }

        [Fact]
        public async Task UpdateNoteCheckAsync_NoteCheckNotFound_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 2,
                ReasonCheck = "Kiểm kê đột xuất",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>()
            };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync((NoteCheck)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateNoteCheckAsync(noteCheckId, request));
            Assert.Equal($"Không tìm thấy NoteCheck với ID: {noteCheckId}", exception.Message);
        }

        [Fact]
        public async Task UpdateNoteCheckAsync_NoteCheckApproved_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 2,
                ReasonCheck = "Kiểm kê đột xuất",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>()
            };

            var existingNoteCheck = new NoteCheck { NoteCheckId = noteCheckId, Status = true };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(existingNoteCheck);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateNoteCheckAsync(noteCheckId, request));
            Assert.Equal("Không thể cập nhật NoteCheck đã được duyệt", exception.Message);
        }

        [Fact]
        public async Task UpdateNoteCheckAsync_ProductLotNotFound_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 2,
                ReasonCheck = "Kiểm kê đột xuất",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>
        {
            new NoteCheckDetailRequestDTO { ProductLotId = 1, ActualQuantity = 7, ErrorQuantity = 3 }
        }
            };

            var existingNoteCheck = new NoteCheck { NoteCheckId = noteCheckId, Status = false, NoteCheckDetails = new List<NoteCheckDetail>() };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(existingNoteCheck);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null)).ReturnsAsync((ProductLot)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateNoteCheckAsync(noteCheckId, request));
            Assert.Equal("Không tìm thấy ProductLot với ID: 1", exception.Message);
        }


        [Fact]
        public async Task UpdateNoteCheckAsync_NullStorageQuantity_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 2,
                ReasonCheck = "Kiểm kê đột xuất",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>
        {
            new NoteCheckDetailRequestDTO { ProductLotId = 1, ActualQuantity = 7, ErrorQuantity = 3 }
        }
            };

            var existingNoteCheck = new NoteCheck { NoteCheckId = noteCheckId, Status = false, NoteCheckDetails = new List<NoteCheckDetail>() };
            var productLot = new ProductLot { ProductLotId = 1, ProductId = 101, Quantity = null, LotId = 1};
            var product = new Product { ProductId = 101, ProductName = "Paracetamol" };

            _noteCheckRepositoryMock.Setup(r => r.GetNoteCheckByIdAsync(noteCheckId)).ReturnsAsync(existingNoteCheck);
            _productLotRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null)).ReturnsAsync(productLot);
            _productLotRepositoryMock.Setup(r => r.GetProductByIdAsync(101)).ReturnsAsync(product);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateNoteCheckAsync(noteCheckId, request));
            Assert.Equal($"StorageQuantity không có giá trị (null) cho ProductLotId {productLot.ProductLotId}.", exception.Message);
        }



    }
}
