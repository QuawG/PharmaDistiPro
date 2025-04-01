using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.IO;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.Test.User
{
    public class UpdateUserTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<Cloudinary> _cloudinaryMock;
        private readonly UserService _userService;

        public UpdateUserTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _cloudinaryMock = new Mock<Cloudinary>(new Account("cloud", "key", "secret"));

            var context = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(_ => _.HttpContext).Returns(context);

            _userService = new UserService(
                _userRepositoryMock.Object,
                _mapperMock.Object,
                _cloudinaryMock.Object,
                null,
                _httpContextAccessorMock.Object
            );
        }

        [Fact]
        public async Task UpdateUser_WhenUserExists_ReturnsSuccess()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                FirstName = "Old",
                LastName = "Name",
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                LastName = "Name",
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Returns(new UserDTO { UserId = 1, FirstName = "New", LastName = "Name" });

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.True(result.Success);
            Assert.Equal("Cập nhật thành công", result.Message);
            Assert.Equal("New", result.Data.FirstName);
        }

        [Fact]
        public async Task UpdateUser_WhenUserDoesNotExist_ReturnsError()
        {
            var userUpdateRequest = new UserInputRequest { UserId = 99 };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(99))
                .ReturnsAsync((Models.User)null);

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không tìm thấy người dùng", result.Message);
        }

        [Fact]
        public async Task UpdateUser_WhenExceptionOccurs_ReturnsError()
        {
            var userUpdateRequest = new UserInputRequest { UserId = 1 };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ThrowsAsync(new Exception("Database connection error"));

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.False(result.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật người dùng.", result.Message);
        }

        [Fact]
        public async Task UpdateUser_WhenAvatarIsProvided_Fail_UploadsToCloudinary()
        {
            // Arrange
            var existingUser = new Models.User
            {
                UserId = 1,
                FirstName = "Old",
                LastName = "Name",
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                LastName = "Name",
                Avatar = new FormFile(new MemoryStream(), 0, 0, "avatar", "avatar.jpg")
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));

            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Returns(new UserDTO { UserId = 1, FirstName = "New", LastName = "Name" });

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.False(result.Success);
        }
    }
}
