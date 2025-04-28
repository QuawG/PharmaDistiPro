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
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.StorageRoomServiceTest
{
   public  class GetStorageRoomByIdTest
    {

        private readonly Mock<IStorageRoomRepository> _mockStorageRoomRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly StorageRoomService _storageRoomService;



        public GetStorageRoomByIdTest()
        {
            _mockStorageRoomRepository = new Mock<IStorageRoomRepository>();
            _mockMapper = new Mock<IMapper>();
            _storageRoomService = new StorageRoomService(_mockStorageRoomRepository.Object, _mockMapper.Object);
        }



        [Fact]
        public async Task GetStorageRoomById_WhenStorageRoomExists_ReturnsSuccess()
        {
            // Arrange
            var storageRoom = new StorageRoom { StorageRoomId = 1, StorageRoomName = "ABC Pharma" };
            var storageRoomDto = new StorageRoomDTO { StorageRoomId = 1, StorageRoomName = "ABC Pharma" };

            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(storageRoom);
            _mockMapper.Setup(mapper => mapper.Map<StorageRoomDTO>(storageRoom)).Returns(storageRoomDto);

            // Act
            var result = await _storageRoomService.GetStorageRoomById(1);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal("StorageRoom found", result.Message);
            Assert.Equal(storageRoomDto.StorageRoomId, result.Data.StorageRoomId);
        }

        [Fact]
        public async Task GetStorageRoomById_WhenStorageRoomNotFound_ReturnsFailure()
        {
            // Arrange
            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(99)).ReturnsAsync((StorageRoom)null);

            // Act
            var result = await _storageRoomService.GetStorageRoomById(99);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không tìm thấy phòng chứa kho ", result.Message);
        }

        [Fact]
        public async Task GetStorageRoomById_WhenExceptionThrown_ReturnsFailure()
        {
            // Arrange
            _mockStorageRoomRepository.Setup(repo => repo.GetByIdAsync(It.IsAny<int>()))
                .ThrowsAsync(new Exception("Unexpected database error"));

            // Act
            var result = await _storageRoomService.GetStorageRoomById(1);

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Unexpected database error", result.Message);
        }


    }
}
