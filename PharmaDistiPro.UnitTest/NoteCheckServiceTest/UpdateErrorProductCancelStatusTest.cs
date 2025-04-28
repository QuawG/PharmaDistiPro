using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.NoteCheckServiceTest
{
    public class UpdateErrorProductCancelStatusTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;
        public UpdateErrorProductCancelStatusTest()
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
        public async Task UpdateErrorProductCancelStatusAsync_ValidDetail_ReturnsTrue()
        {
            // Arrange
            var noteCheckDetailId = 1;
            var noteChecks = new List<NoteCheck>
    {
        new NoteCheck
        {
            NoteCheckId = 1,
            NoteCheckDetails = new List<NoteCheckDetail>
            {
                new NoteCheckDetail { NoteCheckDetailId = noteCheckDetailId, ProductLotId = 1, ErrorQuantity = 2, Status = 0 }
            }
        }
    };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);
            _noteCheckRepositoryMock.Setup(r => r.SaveAsync()).ReturnsAsync(1);

            // Act
            var result = await _noteCheckService.UpdateErrorProductCancelStatusAsync(noteCheckDetailId);

            // Assert
            Assert.True(result);
            _noteCheckRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<NoteCheck>()), Times.Once);
        }

        [Fact]
        public async Task UpdateErrorProductCancelStatusAsync_NoNoteChecks_ThrowsException()
        {
            // Arrange
            var noteCheckDetailId = 1;

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(new List<NoteCheck>());

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateErrorProductCancelStatusAsync(noteCheckDetailId));
            Assert.Equal("Không có đơn kiểm kê nào.", exception.Message);
        }


        [Fact]
        public async Task UpdateErrorProductCancelStatusAsync_DetailNotFound_ThrowsException()
        {
            // Arrange
            var noteCheckDetailId = 1;
            var noteChecks = new List<NoteCheck>
    {
        new NoteCheck
        {
            NoteCheckId = 1,
            NoteCheckDetails = new List<NoteCheckDetail>()
        }
    };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateErrorProductCancelStatusAsync(noteCheckDetailId));
            Assert.Equal("Không tìm thấy sản phẩm lỗi với Id: " + noteCheckDetailId, exception.Message);
        }


        [Fact]
        public async Task UpdateErrorProductCancelStatusAsync_AlreadyCanceled_ThrowsException()
        {
            // Arrange
            var noteCheckDetailId = 1;
            var noteChecks = new List<NoteCheck>
    {
        new NoteCheck
        {
            NoteCheckId = 1,
            NoteCheckDetails = new List<NoteCheckDetail>
            {
                new NoteCheckDetail { NoteCheckDetailId = noteCheckDetailId, ProductLotId = 1, ErrorQuantity = 2, Status = 1 }
            }
        }
    };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateErrorProductCancelStatusAsync(noteCheckDetailId));
            Assert.Equal("Sản phẩm lỗi này đã được hủy trước đó.", exception.Message);
        }
        [Fact]
        public async Task UpdateErrorProductCancelStatusAsync_NoErrorQuantity_ThrowsException()
        {
            // Arrange
            var noteCheckDetailId = 1;
            var noteChecks = new List<NoteCheck>
    {
        new NoteCheck
        {
            NoteCheckId = 1,
            NoteCheckDetails = new List<NoteCheckDetail>
            {
                new NoteCheckDetail { NoteCheckDetailId = noteCheckDetailId, ProductLotId = 1, ErrorQuantity = 0, Status = 0 }
            }
        }
    };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.UpdateErrorProductCancelStatusAsync(noteCheckDetailId));
            Assert.Equal("Không tìm thấy sản phẩm lỗi với Id: " + noteCheckDetailId, exception.Message);
        }
    }

}
