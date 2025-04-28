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
    public class GetStorageRoomListTest
    {
        private readonly Mock<IStorageRoomRepository> _mockStorageRoomRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly StorageRoomService _storageRoomService;

        public GetStorageRoomListTest()
        {
            _mockStorageRoomRepository = new Mock<IStorageRoomRepository>();
            _mockMapper = new Mock<IMapper>();
            _storageRoomService = new StorageRoomService(_mockStorageRoomRepository.Object, _mockMapper.Object);
        }
        [Fact]
        public async Task GetStorageRoomList_WhenSuppliersExist_ReturnsSuccess()
        {
            // Arrange
            var storageRooms = new List<StorageRoom>
            {
                new StorageRoom{ StorageRoomId= 1, StorageRoomName = " A"  , Capacity = 10},
                new StorageRoom { StorageRoomId= 2, StorageRoomName = " B" ,Capacity = 12 }
            };

            var storageRoomDTOs = new List<StorageRoomDTO>
            {
                new StorageRoomDTO { StorageRoomId = 1, StorageRoomName = " A",Capacity = 10 },
                new StorageRoomDTO { StorageRoomId = 2, StorageRoomName = " B" ,Capacity = 10}
            };

            _mockStorageRoomRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(storageRooms);
            _mockMapper.Setup(m => m.Map<IEnumerable<StorageRoomDTO>>(storageRooms)).Returns(storageRoomDTOs);

            // Act
            var result = await _storageRoomService.GetStorageRoomList();

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetStorageRoomList_WhenNoStorageRooms_ReturnsFailure()
        {
            // Arrange
            _mockStorageRoomRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<StorageRoom>());

            // Act
            var result = await _storageRoomService.GetStorageRoomList();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetStorageRoomList_WhenExceptionThrown_ReturnsFailure()
        {
            // Arrange
            _mockStorageRoomRepository.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _storageRoomService.GetStorageRoomList();

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Database error", result.Message);
        }
        [Fact]
        public async Task GetStorageRoomList_WhenSingleStorageRoom_ReturnsSuccess()
        {
            // Arrange
            var storageRooms = new List<StorageRoom>
        {
            new StorageRoom { StorageRoomId = 1, StorageRoomName = "SingleRoom", Capacity = 15 }
        };

            var storageRoomDTOs = new List<StorageRoomDTO>
        {
            new StorageRoomDTO { StorageRoomId = 1, StorageRoomName = "SingleRoom", Capacity = 15 }
        };

            _mockStorageRoomRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(storageRooms);
            _mockMapper.Setup(m => m.Map<IEnumerable<StorageRoomDTO>>(storageRooms)).Returns(storageRoomDTOs);

            // Act
            var result = await _storageRoomService.GetStorageRoomList();

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Single(result.Data);
            Assert.Equal("SingleRoom", result.Data.First().StorageRoomName);
        }




        [Fact]
        public async Task GetStorageRoomList_WhenStorageRoomHasZeroCapacity_ReturnsSuccess()
        {
            // Arrange
            var storageRooms = new List<StorageRoom>
        {
            new StorageRoom { StorageRoomId = 1, StorageRoomName = "ZeroCapRoom", Capacity = 0 }
        };

            var storageRoomDTOs = new List<StorageRoomDTO>
        {
            new StorageRoomDTO { StorageRoomId = 1, StorageRoomName = "ZeroCapRoom", Capacity = 0 }
        };

            _mockStorageRoomRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(storageRooms);
            _mockMapper.Setup(m => m.Map<IEnumerable<StorageRoomDTO>>(storageRooms)).Returns(storageRoomDTOs);

            // Act
            var result = await _storageRoomService.GetStorageRoomList();

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Single(result.Data);
            Assert.Equal(0, result.Data.First().Capacity);
        }

    }
}
