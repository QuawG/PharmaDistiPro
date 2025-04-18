using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Services.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.Test.User
{
    public class ActivateUserTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly IConfiguration _configuration;
        private readonly Cloudinary _cloudinary;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly UserService _userService;
        private readonly IEmailService _emailService;
        public ActivateUserTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            var projectDir = Directory.GetParent(Directory.GetCurrentDirectory()).Parent.Parent.Parent.FullName;
            var configPath = Path.Combine(projectDir, "PharmaDistiPro", "appsettings.json");

            _configuration = new ConfigurationBuilder()
                .AddJsonFile(configPath, optional: false, reloadOnChange: true)
                .Build();

            var account = new Account(
                _configuration["Cloudinary:CloudName"],
                _configuration["Cloudinary:Key"],
                _configuration["Cloudinary:Secret"]
            );
            _cloudinary = new Cloudinary(account);

            var context = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(_ => _.HttpContext).Returns(context);

            _userService = new UserService(
                _userRepositoryMock.Object,
                _mapperMock.Object,
                _cloudinary,  
                _configuration,
                _httpContextAccessorMock.Object,
                _emailService

            );
        }

        [Fact]
        public async Task ActivateDeactivateUserTrue_Success()
        {
            int userId = 1;
            bool updateStatus = true;

            var user = new Models.User
            {
                UserId = userId,
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1,
                Status = false,
                Role = new Models.Role
                {
                    Id = 1,
                    RoleName = "Admin"
                }
            };

            var userDto = new UserDTO
            {
                UserId = userId,
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1,
                Status = updateStatus 
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(
                    It.IsAny<Expression<Func<Models.User, bool>>>(),
                    It.IsAny<string[]>()))
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .Callback<Models.User>(u => u.Status = updateStatus);

            _userRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Returns(userDto);

            var result = await _userService.ActivateDeactivateUser(userId, updateStatus);

            Assert.True(result.Success);
            Assert.Equal("Cập nhật thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(updateStatus, result.Data.Status);

            _userRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Models.User>()), Times.Once);
            _userRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task ActivateDeactivateUserFalse_Success()
        {
            int userId = 1;
            bool updateStatus = false;

            var user = new Models.User
            {
                UserId = userId,
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1,
                Status = false,
                Role = new Models.Role
                {
                    Id = 1,
                    RoleName = "Admin"
                }
            };

            var userDto = new UserDTO
            {
                UserId = userId,
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1,
                Status = updateStatus
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(
                    It.IsAny<Expression<Func<Models.User, bool>>>(),
                    It.IsAny<string[]>()))
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .Callback<Models.User>(u => u.Status = updateStatus);

            _userRepositoryMock.Setup(repo => repo.SaveAsync())
                .Returns(Task.FromResult(1));

            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Returns(userDto);

            var result = await _userService.ActivateDeactivateUser(userId, updateStatus);

            Assert.True(result.Success);
            Assert.Equal("Cập nhật thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(updateStatus, result.Data.Status);

            _userRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Models.User>()), Times.Once);
            _userRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task ActivateDeactivateUser_UserNotFound()
        {
            int userId = 1;
            bool updateStatus = true;

            _userRepositoryMock.Setup(repo =>
                repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), It.IsAny<string[]>()))
                .ReturnsAsync((Models.User)null); 

            var result = await _userService.ActivateDeactivateUser(userId, updateStatus);

            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy người dùng", result.Message);
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task ActivateDeactivateUser_UpdateFails()
        {
            int userId = 1;
            bool updateStatus = true;

            var user = new Models.User
            {
                UserId = userId,
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1,
                Status = false
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), It.IsAny<string[]>()))
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .ThrowsAsync(new Exception("Database update failed"));

            // Act
            var result = await _userService.ActivateDeactivateUser(userId, updateStatus);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Database update failed", result.Message);
            Assert.Null(result.Data);

            _userRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Models.User>()), Times.Once);
            _userRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Never); 
        }

        [Fact]
        public async Task ActivateDeactivateUser_StatusNull_UpdateFails()
        {
            int userId = 1;
            bool updateStatus = true;

            var user = new Models.User
            {
                UserId = userId,
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1,
                Status = false
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), It.IsAny<string[]>()))
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .ThrowsAsync(new Exception("Status không được để trống"));

            // Act
            var result = await _userService.ActivateDeactivateUser(userId, updateStatus);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Status không được để trống", result.Message);
            Assert.Null(result.Data);

        }
    }
}
