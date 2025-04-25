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
    public class CreateNewStorageRoomTest
    {
        private readonly Mock<IStorageRoomRepository> _mockStorageRoomRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly StorageRoomService _storageRoomService;

        public CreateNewStorageRoomTest()
        {
            _mockStorageRoomRepository = new Mock<IStorageRoomRepository>();
            _mockMapper = new Mock<IMapper>();
            _storageRoomService = new StorageRoomService(_mockStorageRoomRepository.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task CreateNewStorageRoom_WhenStorageRoomExists_ReturnsFailure()
        {
            // Arrange
            var request = new StorageRoomInputRequest
            {
                StorageRoomName = "Pharma One",
                StorageRoomCode = "P001"
            };

            var existingStorageRoom = new StorageRoom
            {
               StorageRoomName = "Pharma One",
                StorageRoomCode = "P001"
            };

            _mockStorageRoomRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<StorageRoom, bool>>>(), null))
                .ReturnsAsync(existingStorageRoom);

            // Act
            var result = await _storageRoomService.CreateNewStorageRoom(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Tên kho đã tồn tại.", result.Message);
        }


        [Fact]
        public async Task CreateNewStorageRoom_WhenValidRequest_ReturnsSuccess()
        {
            // Arrange
            var request = new StorageRoomInputRequest
            {
                StorageRoomName = "New StorageRoom",
                StorageRoomCode = "NEW001",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now

            };

            var mappedStorageRoom = new StorageRoom
            {
                StorageRoomName = "New StorageRoom",
                StorageRoomCode = "NEW001",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now
            };

            var mappedDTO = new StorageRoomDTO
            {
                StorageRoomName = "New StorageRoom",
                StorageRoomCode = "NEW001",
                Status = true,
                CreatedBy = 1,
                CreatedDate = DateTime.Now
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<StorageRoom, bool>>>(), null))
                .ReturnsAsync((StorageRoom)null);

            _mockMapper.Setup(mapper => mapper.Map<StorageRoom>(request)).Returns(mappedStorageRoom);
            _mockMapper.Setup(mapper => mapper.Map<StorageRoomDTO>(mappedStorageRoom)).Returns(mappedDTO);

            _mockStorageRoomRepository.Setup(repo => repo.InsertAsync(mappedStorageRoom));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var result = await _storageRoomService.CreateNewStorageRoom(request);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal("New StorageRoom", result.Data.StorageRoomName);
        }



        [Fact]
        public async Task CreateNewStorageRoom_WhenValidCheckRemainVolume_ReturnsSuccess()
        {
            // Arrange
            var request = new StorageRoomInputRequest
            {
                StorageRoomName = "New StorageRoom",
                StorageRoomCode = "NEW001",
                Status = true,
                CreatedBy = 1,
                Capacity = 10,
                CreatedDate = DateTime.Now

            };

            var mappedStorageRoom = new StorageRoom
            {
                StorageRoomName = "New StorageRoom",
                StorageRoomCode = "NEW001",
                Status = true,
                CreatedBy = 1,
                Capacity = 10,
                CreatedDate = DateTime.Now
            };

            var mappedDTO = new StorageRoomDTO
            {
                StorageRoomName = "New StorageRoom",
                StorageRoomCode = "NEW001",
                Status = true,
                CreatedBy = 1,
                Capacity = 10,
                RemainingRoomVolume = 10,
                CreatedDate = DateTime.Now
            };

            _mockStorageRoomRepository.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<StorageRoom, bool>>>(), null))
                .ReturnsAsync((StorageRoom)null);

            _mockMapper.Setup(mapper => mapper.Map<StorageRoom>(request)).Returns(mappedStorageRoom);
            _mockMapper.Setup(mapper => mapper.Map<StorageRoomDTO>(mappedStorageRoom)).Returns(mappedDTO);

            _mockStorageRoomRepository.Setup(repo => repo.InsertAsync(mappedStorageRoom));
            _mockStorageRoomRepository.Setup(repo => repo.SaveAsync());

            // Act
            var result = await _storageRoomService.CreateNewStorageRoom(request);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal("New StorageRoom", result.Data.StorageRoomName);
        }



        [Fact]
        public async Task CreateNewStorageRoom_WhenExceptionThrown_ReturnsFailure()
        {
            // Arrange
            var request = new StorageRoomInputRequest
            {
                StorageRoomName = "Crash StorageRoom",
                StorageRoomCode = "ERR001"
            };

            _mockStorageRoomRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<StorageRoom, bool>>>(), null))
                .ThrowsAsync(new Exception("Unexpected database error"));

            // Act
            var result = await _storageRoomService.CreateNewStorageRoom(request);

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Lỗi: Unexpected database error", result.Message);
        }



        [Fact]
        public async Task CreateNewStorageRoom_WhenStorageRoomCodeExists_ReturnsFailure()
        {
            // Arrange
            var request = new StorageRoomInputRequest
            {
                StorageRoomName = "StorageRoom A",
                StorageRoomCode = "CODE123"
            };

            var existingStorageRoom = new StorageRoom
            {
                StorageRoomName = "StorageRoom A",
               StorageRoomCode = "CODE123"
            };

            _mockStorageRoomRepository
                .Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<StorageRoom, bool>>>(), null))
                .ReturnsAsync(existingStorageRoom);

            // Act
            var result = await _storageRoomService.CreateNewStorageRoom(request);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Tên kho đã tồn tại.", result.Message);
        }

       

      
    }




    



}
