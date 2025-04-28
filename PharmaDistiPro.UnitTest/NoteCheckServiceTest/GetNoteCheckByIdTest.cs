using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.DTO.NoteChecks;
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
    public class GetNoteCheckByIdTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;

        public GetNoteCheckByIdTest()
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
        public async Task GetNoteCheckByIdAsync_ValidId_ReturnsNoteCheckDTO()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck { NoteCheckId = noteCheckId, StorageRoomId = 1, ReasonCheck = "Kiểm kê định kỳ" };
            var noteCheckDetails = new List<NoteCheckDetail>
    {
        new NoteCheckDetail { NoteCheckDetailId = 1, ProductLotId = 1, ActualQuantity = 8 }
    };
            var noteCheckDto = new NoteCheckDTO
            {
                NoteCheckId = noteCheckId,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                NoteCheckDetails = new List<NoteCheckDetailsDTO>
        {
            new NoteCheckDetailsDTO { NoteCheckDetailId = 1, ProductLotId = 1, ActualQuantity = 8 }
        }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _noteCheckRepositoryMock.Setup(r => r.GetDetailsByNoteCheckIdAsync(noteCheckId)).ReturnsAsync(noteCheckDetails);
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDetailsDTO>>(It.IsAny<List<NoteCheckDetail>>())).Returns(noteCheckDto.NoteCheckDetails);

            // Act
            var result = await _noteCheckService.GetNoteCheckByIdAsync(noteCheckId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(noteCheckId, result.NoteCheckId);
            Assert.Single(result.NoteCheckDetails);
        }
        [Fact]
        public async Task GetNoteCheckByIdAsync_NoteCheckNotFound_ThrowsException()
        {
            // Arrange
            var noteCheckId = 1;

            _noteCheckRepositoryMock.Setup(r => r.GetByIdAsync(noteCheckId)).ReturnsAsync((NoteCheck)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.GetNoteCheckByIdAsync(noteCheckId));
            Assert.Equal("Không tìm thấy đơn kiểm kê.", exception.Message);
        }

        [Fact]
        public async Task GetNoteCheckByIdAsync_NoDetails_ReturnsNoteCheckDTO()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck { NoteCheckId = noteCheckId, StorageRoomId = 1, ReasonCheck = "Kiểm kê định kỳ" };
            var noteCheckDto = new NoteCheckDTO
            {
                NoteCheckId = noteCheckId,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                NoteCheckDetails = new List<NoteCheckDetailsDTO>()
            };

            _noteCheckRepositoryMock.Setup(r => r.GetByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _noteCheckRepositoryMock.Setup(r => r.GetDetailsByNoteCheckIdAsync(noteCheckId)).ReturnsAsync(new List<NoteCheckDetail>());
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDetailsDTO>>(It.IsAny<List<NoteCheckDetail>>())).Returns(new List<NoteCheckDetailsDTO>());

            // Act
            var result = await _noteCheckService.GetNoteCheckByIdAsync(noteCheckId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result.NoteCheckDetails);
        }

        [Fact]
        public async Task GetNoteCheckByIdAsync_NullDetails_ReturnsEmptyDetails()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck { NoteCheckId = noteCheckId, StorageRoomId = 1, ReasonCheck = "Kiểm kê định kỳ" };
            var noteCheckDto = new NoteCheckDTO
            {
                NoteCheckId = noteCheckId,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                NoteCheckDetails = new List<NoteCheckDetailsDTO>()
            };

            _noteCheckRepositoryMock.Setup(r => r.GetByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _noteCheckRepositoryMock.Setup(r => r.GetDetailsByNoteCheckIdAsync(noteCheckId)).ReturnsAsync((List<NoteCheckDetail>)null);
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDetailsDTO>>(It.IsAny<List<NoteCheckDetail>>())).Returns(new List<NoteCheckDetailsDTO>());

            // Act
            var result = await _noteCheckService.GetNoteCheckByIdAsync(noteCheckId);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result.NoteCheckDetails);
        }

        [Fact]
        public async Task GetNoteCheckByIdAsync_MultipleDetails_ReturnsAllDetails()
        {
            // Arrange
            var noteCheckId = 1;
            var noteCheck = new NoteCheck { NoteCheckId = noteCheckId, StorageRoomId = 1, ReasonCheck = "Kiểm kê định kỳ" };
            var noteCheckDetails = new List<NoteCheckDetail>
    {
        new NoteCheckDetail { NoteCheckDetailId = 1, ProductLotId = 1, ActualQuantity = 8 },
        new NoteCheckDetail { NoteCheckDetailId = 2, ProductLotId = 2, ActualQuantity = 5 }
    };
            var noteCheckDto = new NoteCheckDTO
            {
                NoteCheckId = noteCheckId,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                NoteCheckDetails = new List<NoteCheckDetailsDTO>
        {
            new NoteCheckDetailsDTO { NoteCheckDetailId = 1, ProductLotId = 1, ActualQuantity = 8 },
            new NoteCheckDetailsDTO { NoteCheckDetailId = 2, ProductLotId = 2, ActualQuantity = 5 }
        }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetByIdAsync(noteCheckId)).ReturnsAsync(noteCheck);
            _noteCheckRepositoryMock.Setup(r => r.GetDetailsByNoteCheckIdAsync(noteCheckId)).ReturnsAsync(noteCheckDetails);
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDetailsDTO>>(It.IsAny<List<NoteCheckDetail>>())).Returns(noteCheckDto.NoteCheckDetails);

            // Act
            var result = await _noteCheckService.GetNoteCheckByIdAsync(noteCheckId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.NoteCheckDetails.Count);
        }
    }




}
