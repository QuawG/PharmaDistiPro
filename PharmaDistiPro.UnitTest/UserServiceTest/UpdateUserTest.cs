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
using System.Linq.Expressions;
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
            Assert.Equal("Database connection error", result.Message);
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

        [Fact]
        public async Task UpdateUser_WhenIsRoleCustomer_ReturnSuccess()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                FirstName = "Old",
                LastName = "Name",
                RoleId = 2
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                LastName = "Name",
                RoleId = 5,
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Returns(new UserDTO { UserId = 1, FirstName = "New", LastName = "Name", RoleId = 5 });

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.True(result.Success);
            Assert.Equal(5, result.Data.RoleId);
            Assert.Equal("Cập nhật thành công", result.Message);
            Assert.Equal("New", result.Data.FirstName);
        }

        [Fact]
        public async Task UpdateUser_WhenIsRoleNotCustomer_ReturnSuccess()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                FirstName = "Old",
                LastName = "Name",
                RoleId = 5
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                LastName = "Name",
                RoleId = 1,
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Returns(new UserDTO { UserId = 1, FirstName = "New", LastName = "Name", RoleId = 1 });

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.True(result.Success);
            Assert.Equal(1, result.Data.RoleId);
            Assert.Equal("Cập nhật thành công", result.Message);
            Assert.Equal("New", result.Data.FirstName);

        }

        [Fact]
        public async Task UpdateUser_WhenRoleDoesNotExist_ReturnsError()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                FirstName = "Old",
                LastName = "Name",
                RoleId = 2
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                LastName = "Name",
                RoleId = 1000,
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Throws(new Exception("Vai trò không tồn tại"));

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Vai trò không tồn tại", result.Message);
        }

        [Fact]
        public async Task UpdateUser_WhenPhoneNull_ReturnError()
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
                Phone = null,
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Throws(new Exception("Số điện thoại không được để trống"));

            var result = await _userService.UpdateUser(userUpdateRequest);


            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Số điện thoại không được để trống", result.Message);
        }

        [Fact]
        public async Task UpdateUser_WhenPhoneNullInvalid_ReturnError()
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
                Phone = "abcasd",
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .ThrowsAsync(new Exception("Số điện thoại không hợp lệ"));

            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Throws(new Exception("Số điện thoại sai định dạng"));

            var result = await _userService.UpdateUser(userUpdateRequest);

            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Số điện thoại không hợp lệ", result.Message);
        }

        [Fact]
        public async Task UpdateUser_WhenUsernameInvalid_ReturnError()
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
                .Throws(new Exception("Tên đăng nhập không được thay đổi"));

            var result = await _userService.UpdateUser(userUpdateRequest);

            Assert.False(result.Success);
            Assert.Equal("Tên đăng nhập không được thay đổi", result.Message);
        }

        [Fact]
        public async Task UpdateUser_WhenEmailInvalid_ReturnError()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                Email = "123@gmail.com",
                FirstName = "Old",
                LastName = "Name",
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                Email = "new@gmail.com",
                LastName = "Name",
                Phone = "abcasd",
                Avatar = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .ThrowsAsync(new Exception("Email không được thay đổi"));

            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()));

            var result = await _userService.UpdateUser(userUpdateRequest);
            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Email không được thay đổi", result.Message);
        }

        [Fact]
        public async Task UpdateUser_AgeInvalid_ReturnError()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                Email = "123@gmail.com",
                FirstName = "Old",
                LastName = "Name",
                Age = 18
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                Email = "new@gmail.com",
                LastName = "Name",
                Phone = "abcasd",
                Age = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .ThrowsAsync(new Exception("Tuổi không được để trống"));

            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()));

            var result = await _userService.UpdateUser(userUpdateRequest);

            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Tuổi không được để trống", result.Message);
        }

        [Fact]
        public async Task UpdateUser_TaxcodeInvalid_ReturnError()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                Email = "123@gmail.com",
                FirstName = "Old",
                LastName = "Name",
                TaxCode = "123456789",
                Age = 18
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                Email = "new@gmail.com",
                LastName = "Name",
                Phone = "abcasd",
                TaxCode = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Throws(new Exception("Tax code không được thay đổi"));

            var result = await _userService.UpdateUser(userUpdateRequest);

            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Tax code không được thay đổi", result.Message);
        }

        [Fact]
        public async Task UpdateUser_StatusCodeInvalid_ReturnError()
        {
            var existingUser = new Models.User
            {
                UserId = 1,
                Email = "123@gmail.com",
                FirstName = "Old",
                LastName = "Name",
                TaxCode = "123456789",
                Status = true,
                Age = 18
            };

            var userUpdateRequest = new UserInputRequest
            {
                UserId = 1,
                FirstName = "New",
                Email = "new@gmail.com",
                LastName = "Name",
                Phone = "abcasd",
                Status = null
            };

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(existingUser);

            _mapperMock.Setup(m => m.Map(userUpdateRequest, existingUser));


            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>()))
                .Throws(new Exception("Status không được để trống"));

            var result = await _userService.UpdateUser(userUpdateRequest);

            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message);
            Assert.Equal("Status không được để trống", result.Message);
        }
    }
}
