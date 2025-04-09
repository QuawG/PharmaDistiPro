using System;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Moq;
using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;

namespace PharmaDistiPro.Test.User
{
    public class LoginTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly IConfiguration _configuration;
        private readonly Cloudinary _cloudinary;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly UserService _userService;

        public LoginTest()
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
                _httpContextAccessorMock.Object
            );
        }

        [Fact]
        public async Task Test_Login_Success()
        {
            // 🟢 Arrange
            var fakeRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "password123"
            };

            var fakeUser = new Models.User
            {
                UserId = 1,
                Email = "test@example.com",
                Password = "password123",
                UserName = "testuser",
                Status = true,
                Avatar = "https://example.com/avatar.jpg",
                FirstName = "Loc",
                LastName = "Ngo",
                Role = new Role { RoleName = "Admin" } 
            };

            var expectedResponse = new LoginResponse
            {
                UserId = fakeUser.UserId,
                UserName = fakeUser.UserName,
                UserEmail = fakeUser.Email,
                UserAvatar = fakeUser.Avatar,
                AccessToken = "fakeAccessToken",
                RefreshToken = "fakeRefreshToken",
                VerifyFlag = true,
                IdentifyFlg = true
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUser(fakeRequest.Username, fakeRequest.Password))
                .ReturnsAsync(fakeUser);

            _mapperMock
                .Setup(mapper => mapper.Map<LoginResponse>(fakeUser))
                .Returns(expectedResponse);

            var result = await _userService.Login(fakeRequest);

            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Equal(expectedResponse.UserId, result.Data.UserId);
        }

        [Fact]
        public async Task Test_Login_Failed_InvalidCredentials()
        {
            var fakeRequest = new LoginRequest
            {
                Username = "dasdsad",
                Password = "wrongpassword"
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUser(fakeRequest.Username, fakeRequest.Password))
                .ReturnsAsync((Models.User?)null);

            var result = await _userService.Login(fakeRequest);

            Assert.NotNull(result);
            Assert.Null(result.Data); // Không có dữ liệu user được trả về
        }

        [Fact]
        public async Task Test_Login_Failed_UsernameIsNull()
        {
            // 🟡 Arrange
            var fakeRequest = new LoginRequest
            {
                Username = null,
                Password = "somepassword"
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUser(fakeRequest.Username, fakeRequest.Password))
                .ReturnsAsync((Models.User?)null);

            // 🔵 Act
            var result = await _userService.Login(fakeRequest);

            // 🔴 Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Tài khoản không tồn tại", result.Message); // tuỳ bạn xử lý
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task Test_Login_Failed_PasswordIsNull()
        {
            // 🟡 Arrange
            var fakeRequest = new LoginRequest
            {
                Username = "testuser",
                Password = null
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUser(fakeRequest.Username, fakeRequest.Password))
                .ReturnsAsync((Models.User?)null);

            // 🔵 Act
            var result = await _userService.Login(fakeRequest);

            // 🔴 Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Tài khoản không tồn tại", result.Message);
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task Test_Login_Failed_Status()
        {
            var fakeRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "password123"
            };

            var fakeUser = new Models.User
            {
                UserId = 1,
                Email = "test@example.com",
                Password = "password123",
                UserName = "testuser",
                Status = false,
                Avatar = "https://example.com/avatar.jpg",
                FirstName = "Loc",
                LastName = "Ngo",
                Role = new Role { RoleName = "Admin" }
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUser(fakeRequest.Username, fakeRequest.Password))
                .ReturnsAsync(fakeUser);

            var result = await _userService.Login(fakeRequest);

            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode); 
            Assert.Equal("Tài khoản không được phép đăng nhập", result.Message); 
            Assert.Null(result.Data); 
        }

        [Fact]
        public async Task Test_Login_Failed_RepositoryError()
        {
            var fakeRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "password123"
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUser(fakeRequest.Username, fakeRequest.Password))
                .ThrowsAsync(new Exception("Database error"));

            var exception = await Assert.ThrowsAsync<Exception>(() => _userService.Login(fakeRequest));

            Assert.NotNull(exception);
            Assert.Equal("Database error", exception.Message); 
        }
    }
}
