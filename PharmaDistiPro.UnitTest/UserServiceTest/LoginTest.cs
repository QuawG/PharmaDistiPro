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
using System.Security.Cryptography;
using System.Text;

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
                _httpContextAccessorMock.Object,
                null
            );
        }


        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
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

            

            CreatePasswordHash("password123", out byte[] passwordHash, out byte[] passwordSalt);
            var fakeUser = new Models.User
            {
                UserId = 1,
                Email = "test@example.com",
                Password = passwordHash,
                PasswordSalt = passwordSalt,
                UserName = "testuser",
                Status = true,
                Avatar = "https://example.com/avatar.jpg",
                FirstName = "Loc",
                LastName = "Ngo",
                RoleId = 1,
                Role = new Role { Id = 1,RoleName = "Admin" }
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
                .Setup(repo => repo.GetUser(fakeRequest.Username))
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
        public async Task Login_WhenUsernameDoesNotExist_ShouldReturnNotFound()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = "nonexistent",
                Password = "password123"
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ReturnsAsync(( Models.User)null);

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Tài khoản không tồn tại", result.Message);
            Assert.Null(result.Data);
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never());
        }

        [Fact]
        public async Task Login_WhenPasswordIsIncorrect_ShouldReturnInvalidPassword()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "wrongpassword"
            };

            CreatePasswordHash("password123", out byte[] passwordHash, out byte[] passwordSalt);

            var user = new Models.User
            {
                UserId = 1,
                UserName = "testuser",
                Email = "test@example.com",
                Password = passwordHash,
                PasswordSalt = passwordSalt,
                Status = true
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ReturnsAsync(user);


            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Sai mật khẩu", result.Message);
            Assert.Null(result.Data);
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never());
        }

        [Fact]
        public async Task Login_WhenUserIsDeactivated_ShouldReturnNotAllowed()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "password123"
            };

            CreatePasswordHash("password123", out byte[] passwordHash, out byte[] passwordSalt);

            var user = new Models.User
            {
                UserId = 1,
                UserName = "testuser",
                Email = "test@example.com",
                Password = passwordHash,
                PasswordSalt = passwordSalt,
                Status = false,
                Role = new Role { RoleName = "Admin" }
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ReturnsAsync(user);

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Tài khoản không được phép đăng nhập", result.Message);
            Assert.Null(result.Data);
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never());
        }

        [Fact]
        public async Task Login_WhenUsernameIsNull_ShouldReturnNotFound()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = null,
                Password = "password123"
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(null))
                .ReturnsAsync((Models.User)null);

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Tài khoản không tồn tại", result.Message);
            Assert.Null(result.Data);
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never());
        }

        [Fact]
        public async Task Login_WhenPasswordIsNull_ShouldReturnNotFound()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = "testuser",
                Password = null
            };

            CreatePasswordHash("correctpassword", out byte[] passwordHash, out byte[] passwordSalt);

            var user = new Models.User
            {
                UserId = 1,
                UserName = "testuser",
                Password = passwordHash,
                PasswordSalt = passwordSalt,
                Status = true
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ThrowsAsync(new Exception());

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode);
            Assert.True(result.Message.Contains("Exception of type 'System.Exception'"));
            Assert.Null(result.Data);
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never());
        }

        [Fact]
        public async Task Login_WhenRepositoryThrowsError_ShouldReturnErrorResponse()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "password123"
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ThrowsAsync(new Exception("Database Error"));

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(500, result.StatusCode); 
            Assert.Null(result.Data);
        }
    }
}