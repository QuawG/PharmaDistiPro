using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.UnitTest.NoteCheckServiceTest
{
    public class GetNoteCheckListTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;

        public GetNoteCheckListTest()
        {
            _noteCheckRepositoryMock = new Mock<INoteCheckRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            // Safeguard HttpContext to prevent null reference issues
            var httpContext = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            // Use the five-parameter constructor as per the latest NoteCheckService code
            _noteCheckService = new NoteCheckService(
                _noteCheckRepositoryMock.Object,
                _mapperMock.Object,
                _productLotRepositoryMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object
            );

            // If your actual NoteCheckService requires IProductRepository, uncomment this:
            /*
            _noteCheckService = new NoteCheckService(
                _noteCheckRepositoryMock.Object,
                _mapperMock.Object,
                _productLotRepositoryMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object,
                _productRepositoryMock.Object
            );
            */
        }

        [Fact]
        public async Task GetAllNoteChecksAsync_WhenNoteChecksExist_ReturnsSuccess()
        {
            // Arrange
            var noteChecks = new List<NoteCheck>
            {
                new NoteCheck { NoteCheckId = 1, StorageRoomId = 1, ReasonCheck = "Kiểm kê định kỳ", Status = false, CreatedBy = 1 }
            };

            var noteCheckDtos = new List<NoteCheckDTO>
            {
                new NoteCheckDTO { NoteCheckId = 1, StorageRoomId = 1, ReasonCheck = "Kiểm kê định kỳ", Status = false, CreatedBy = 1 }
            };

            _noteCheckRepositoryMock.Setup(repo => repo.GetAllWithDetailsAsync())
                .ReturnsAsync(noteChecks);

            _mapperMock.Setup(mapper => mapper.Map<List<NoteCheckDTO>>(It.IsAny<IEnumerable<NoteCheck>>()))
                .Returns(noteCheckDtos);

            // Act
            var result = await _noteCheckService.GetAllNoteChecksAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(noteCheckDtos[0].NoteCheckId, result[0].NoteCheckId);
        }

        [Fact]
        public async Task GetAllNoteChecksAsync_WhenEmptyData_ThrowsException()
        {
            // Arrange
            var noteCheckList = new List<NoteCheck>();
            _noteCheckRepositoryMock.Setup(repo => repo.GetAllWithDetailsAsync())
                .ReturnsAsync(noteCheckList);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.GetAllNoteChecksAsync());
            Assert.Equal("Không có đơn kiểm kê nào.", exception.Message);
        }

        [Fact]
        public async Task GetAllNoteChecksAsync_WhenNullData_ThrowsException()
        {
            // Arrange
            _noteCheckRepositoryMock.Setup(repo => repo.GetAllWithDetailsAsync())
                .ReturnsAsync((List<NoteCheck>)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.GetAllNoteChecksAsync());
            Assert.Equal("Không có đơn kiểm kê nào.", exception.Message);
        }

        [Fact]
        public async Task GetAllNoteChecksAsync_WhenDatabaseError_ThrowsException()
        {
            // Arrange
            _noteCheckRepositoryMock.Setup(repo => repo.GetAllWithDetailsAsync())
                .ThrowsAsync(new Exception("Lỗi kết nối dữ liệu"));

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.GetAllNoteChecksAsync());
            Assert.Equal("Lỗi kết nối dữ liệu", exception.Message);
        }
    }
}