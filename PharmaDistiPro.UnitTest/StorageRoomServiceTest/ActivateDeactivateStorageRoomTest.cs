using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.StorageRooms;
using PharmaDistiPro.DTO.Suppliers;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.StorageRoomServiceTest
{
    public  class ActivateDeactivateStorageRoomTest
    {
        private readonly Mock<IStorageRoomRepository> _mockStorageRoomRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly StorageRoomService _storageRoomService;

        public ActivateDeactivateStorageRoomTest()
        {
            _mockStorageRoomRepository = new Mock<IStorageRoomRepository>();
            _mockMapper = new Mock<IMapper>();
            _storageRoomService = new StorageRoomService(_mockStorageRoomRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task ActivateDeactivateStorageRoom_WhenStorageRoomExists_ReturnSuccess()
        {
            // Arrange
            var storageRoomId = 1;
            var updateStatus = true;

            var storageRoom = new StorageRoom { StorageRoomId = storageRoomId, Status = false };
            var storageRoomDto = new StorageRoomDTO { StorageRoomId = storageRoomId, Status = updateStatus };

            _mockStorageRoomRepository.Setup(r => r.GetByIdAsync(storageRoomId)).ReturnsAsync(storageRoom);
            _mockStorageRoomRepository.Setup(r => r.UpdateAsync(It.IsAny<StorageRoom>()));
            _mockStorageRoomRepository.Setup(r => r.SaveAsync());
            _mockMapper.Setup(m => m.Map<StorageRoomDTO>(It.IsAny<StorageRoom>())).Returns(storageRoomDto);

            // Act
            var response = await _storageRoomService.ActivateDeactivateStorageRoom(storageRoomId, updateStatus);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Cập nhật thành công", response.Message);
            Assert.NotNull(response.Data);
            Assert.Equal(updateStatus, response.Data.Status);
        }

        [Fact]
        public async Task ActivateDeactivateStorageRoom_WhenStorageRoomNotFound_ReturnFail()
        {
            // Arrange
            var storageRoomId = 2;
            _mockStorageRoomRepository.Setup(r => r.GetByIdAsync(storageRoomId)).ReturnsAsync((StorageRoom?)null);
            _mockMapper.Setup(m => m.Map<StorageRoomDTO>(null)).Returns((StorageRoomDTO?)null);

            // Act
            var response = await _storageRoomService.ActivateDeactivateStorageRoom(storageRoomId, false);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Không tìm thấy phòng chứa kho", response.Message);
            Assert.Null(response.Data);
        }

        [Fact]
        public async Task ActivateDeactivateStorageRoom_ReturnException()
        {
            // Arrange
            var storagerRoomId = 3;
            _mockStorageRoomRepository.Setup(r => r.GetByIdAsync(storagerRoomId)).ThrowsAsync(new Exception("Database failure"));

            // Act
            var response = await _storageRoomService.ActivateDeactivateStorageRoom(storagerRoomId, true);

            // Assert
            Assert.False(response.Success);
            Assert.Contains("Database failure", response.Message);
        }
    }
}
