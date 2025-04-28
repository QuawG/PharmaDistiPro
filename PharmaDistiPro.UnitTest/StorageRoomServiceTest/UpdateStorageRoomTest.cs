using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.StorageRoomServiceTest
{
    public class UpdateStorageRoomTest
    {

        private readonly Mock<IStorageRoomRepository> _mockStorageRoomRepository;
        private readonly IMapper _mapper;
        private readonly StorageRoomService _storageRoomService;



        public UpdateStorageRoomTest()
        {
            _mockStorageRoomRepository = new Mock<IStorageRoomRepository>();

            // Setup AutoMapper
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<StorageRoom, StorageRoomDTO>();
                cfg.CreateMap<StorageRoomInputRequest, StorageRoom>();
            });
            _mapper = config.CreateMapper();

            _storageRoomService = new StorageRoomService(_mockStorageRoomRepository.Object, _mapper);
        }



        [Fact]
        public async Task UpdateStorageRoom_WhenStorageRoomExists_ReturnsSuccess()
        {
            // Arrange
            var existingStorageRoom = new StorageRoom
            {
                StorageRoomId = 1,
                StorageRoomName = "Old Name",
                StorageRoomCode = "OLD01",
                Status = true
            };

            var request = new StorageRoomInputRequest
            {
                StorageRoomId = 1,
                StorageRoomName = "New Name",
                StorageRoomCode = "NEW01",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingStorageRoom);
            _mockStorageRoomRepository.Setup(repo => repo.UpdateAsync(It.IsAny<StorageRoom>()));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal("New Name", response.Data.StorageRoomName);
            Assert.Equal("Cập nhật nhà kho thành công", response.Message);
        }

        [Fact]
        public async Task UpdateStorageRoom_WhenStorageRoomNotFound_ReturnsFailure()
        {
            // Arrange
            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((StorageRoom)null);

            var request = new StorageRoomInputRequest { StorageRoomId = 999 };

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Không tìm thấy nhà kho", response.Message);
        }

        [Fact]
        public async Task UpdateStorageRoom_WhenExceptionThrown_ReturnsErrorMessage()
        {
            // Arrange
            var request = new StorageRoomInputRequest { StorageRoomId = 1 };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(1)).ThrowsAsync(new Exception("Đã xảy ra lỗi trong quá trình cập nhật nhà kho."));

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Lỗi: Đã xảy ra lỗi trong quá trình cập nhật nhà kho.", response.Message);
        }

        [Fact]
        public async Task UpdateStorageRoom_WhenStorageRoomNameIsNull_KeepOldValue()
        {
            // Arrange
            var existingStorageRoom = new StorageRoom
            {
                StorageRoomId = 1,
                StorageRoomName = "Old Name",
                StorageRoomCode = "CODE123"
            };

            var request = new StorageRoomInputRequest
            {
                StorageRoomId = 1,
                StorageRoomName = null,
                StorageRoomCode = "NEWCODE"
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(existingStorageRoom);
            _mockStorageRoomRepository.Setup(repo => repo.UpdateAsync(It.IsAny<StorageRoom>()));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Old Name", response.Data.StorageRoomName); // giữ nguyên giá trị cũ
            Assert.Equal("NEWCODE", response.Data.StorageRoomCode);
        }

        [Fact]
        public async Task UpdateStorageRoom_WhenStorageRoomCodeIsNull_KeepOldValue()
        {
            // Arrange
            var existingStorageRoom = new StorageRoom
            {
                StorageRoomId = 2,
                StorageRoomName = "StorageRoom",
                StorageRoomCode = "ORIGCODE"
            };

            var request = new StorageRoomInputRequest
            {
                StorageRoomId = 2,
                StorageRoomName = "Updated StorageRoom",
                StorageRoomCode = null
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(2)).ReturnsAsync(existingStorageRoom);
            _mockStorageRoomRepository.Setup(repo => repo.UpdateAsync(It.IsAny<StorageRoom>()));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Updated StorageRoom", response.Data.StorageRoomName);
            Assert.Equal("ORIGCODE", response.Data.StorageRoomCode); // giữ nguyên code cũ
        }

        [Fact]
        public async Task UpdateStorageRoom_WhenCapacityIsNull_KeepOldValue()
        {
            // Arrange
            var existingStorageRoom = new StorageRoom
            {
                StorageRoomId = 3,
                StorageRoomName = "StorageRoom",
                StorageRoomCode = "S003",
                Capacity = 10

            };

            var request = new StorageRoomInputRequest
            {
                StorageRoomId = 3,
                StorageRoomCode = "S003",
                Capacity = null
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(3)).ReturnsAsync(existingStorageRoom);
            _mockStorageRoomRepository.Setup(repo => repo.UpdateAsync(It.IsAny<StorageRoom>()));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.True(response.Success);

            Assert.Equal(10, response.Data.Capacity); // giữ nguyên
        }

        [Fact]
        public async Task UpdateStorageRoom_WhenStatusAreNull_KeepOldValue()
        {
            // Arrange
            var existingStorageRoom = new StorageRoom
            {
                StorageRoomId = 3,
                StorageRoomName = "StorageRoom",
                StorageRoomCode = "S003",
                Status = true

            };

            var request = new StorageRoomInputRequest
            {
                StorageRoomId = 3,
                StorageRoomName = "StorageRoom",
                StorageRoomCode = "S003",
                Status = null
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(3)).ReturnsAsync(existingStorageRoom);
            _mockStorageRoomRepository.Setup(repo => repo.UpdateAsync(It.IsAny<StorageRoom>()));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal(true, response.Data.Status); // giữ nguyên

        }

        [Fact]
        public async Task UpdateStorageRoom_WhenUpdateFails_ThrowsExceptionHandled()
        {
            // Arrange
            var existingStorageRoom = new StorageRoom
            {
                StorageRoomId = 4,
                StorageRoomName = "To be updated"
            };

            var request = new StorageRoomInputRequest
            {
                StorageRoomId = 4,
                StorageRoomName = "New name"
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(4)).ReturnsAsync(existingStorageRoom);
            _mockStorageRoomRepository.Setup(repo => repo.UpdateAsync(It.IsAny<StorageRoom>()))
                                   .ThrowsAsync(new Exception("Đã xảy ra lỗi trong quá trình cập nhật nhà kho."));

            // Act
            var response = await _storageRoomService.UpdateStorageRoom(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Lỗi: Đã xảy ra lỗi trong quá trình cập nhật nhà kho.", response.Message);
        }
    }
}
