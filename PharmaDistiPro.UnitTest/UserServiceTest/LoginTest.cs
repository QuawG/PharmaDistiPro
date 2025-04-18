using System;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Moq;
using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models; // Ensure Models namespace is imported
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using PharmaDistiPro.Services.Interface;

namespace PharmaDistiPro.Test.User
{
    public class LoginTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<IConfigurationSection> _jwtSectionMock;
        private readonly Cloudinary _cloudinary;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly UserService _userService;
        private readonly IEmailService _emailService;
        public LoginTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _configurationMock = new Mock<IConfiguration>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _jwtSectionMock = new Mock<IConfigurationSection>();

            // Mock configuration for JWT
            _jwtSectionMock.Setup(x => x["Issuer"]).Returns("TestIssuer");
            _jwtSectionMock.Setup(x => x["Audience"]).Returns("TestAudience");
            _jwtSectionMock.Setup(x => x["Key"]).Returns("ThisIsASecretKeyForTesting1234567890");
            _configurationMock.Setup(x => x.GetSection("JWT")).Returns(_jwtSectionMock.Object);

            // Initialize Cloudinary (minimal setup, not used in Login)
            _cloudinary = new Cloudinary(new Account("cloud", "key", "secret"));

            // Setup HttpContext
            var context = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(_ => _.HttpContext).Returns(context);

            _userService = new UserService(
                _userRepositoryMock.Object,
                _mapperMock.Object,
                _cloudinary,
                _configurationMock.Object,
                _httpContextAccessorMock.Object,
                _emailService
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
        public async Task Login_WhenCredentialsAreValid_ShouldSucceed()
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
                Status = true,
                Avatar = "https://example.com/avatar.jpg",
                FirstName = "Loc",
                LastName = "Ngo",
                Role = new Role { RoleName = "Admin" }
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ReturnsAsync(user);

            _userRepositoryMock.Setup(repo => repo.UpdateUser(It.IsAny<Models.User>()))
                .ReturnsAsync(user);

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(200, result.StatusCode);
            Assert.NotNull(result.Data);
            Assert.Equal(user.UserId, result.Data.UserId);
            Assert.Equal(user.UserName, result.Data.UserName);
            Assert.Equal(user.Role.RoleName, result.Data.RoleName);
            Assert.Equal(user.Avatar, result.Data.UserAvatar);
            Assert.NotNull(result.Data.AccessToken);
            Assert.NotNull(result.Data.RefreshToken);

            // Verify JWT claims
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.ReadJwtToken(result.Data.AccessToken);
            Assert.Equal("TestIssuer", token.Issuer);
            Assert.Equal(user.UserName, token.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
            Assert.Equal(user.Role.RoleName, token.Claims.First(c => c.Type == ClaimTypes.Role).Value);
            Assert.Equal(user.UserId.ToString(), token.Claims.First(c => c.Type == "UserId").Value);

            // Verify database update
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.Is<Models.User>(u =>
                u.RefreshToken != null && u.RefreshTokenExpriedTime > DateTime.UtcNow)), Times.Once());
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
        public async Task Login_WhenRepositoryThrowsError_ShouldReturnErrorResponse()
        {
            // Arrange
            var loginRequest = new LoginRequest
            {
                Username = "testuser",
                Password = "password123"
            };

            _userRepositoryMock.Setup(repo => repo.GetUser(loginRequest.Username))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _userService.Login(loginRequest);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(0, result.StatusCode); // Default status code when exception is caught
            Assert.Equal("Database error", result.Message);
            Assert.Null(result.Data);
            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never());
        }
    }
}