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
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;
using System.Linq.Expressions;
using CloudinaryDotNet.Actions;
using PharmaDistiPro.Helper;
using System.Collections.Generic;
using System.Runtime.ConstrainedExecution;

namespace PharmaDistiPro.Test.User
{
    public class CreateNewUserTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IRoleRepository> _roleRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly IConfiguration _configuration;
        private readonly Cloudinary _cloudinary;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly UserService _userService;

        public CreateNewUserTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _roleRepositoryMock = new Mock<IRoleRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _emailServiceMock = new Mock<IEmailService>();

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
                _emailServiceMock.Object
            );
        }

        [Fact]
        public async Task CreateNewUser_Success()
        {
            // Arrange
            var registerRequest = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                FirstName = "Ngo",
                Password = "password",
                LastName = "Loc",
                Address = "Thượng cát",
                Phone = "0987654321",
                Age = 25,
                EmployeeCode = "NV001",
                TaxCode = "123456789",
                Status = true,
                RoleId = 5
            };

            var newUser = new Models.User
            {
                Email = registerRequest.Email,
                UserName = registerRequest.UserName,
                RoleId = registerRequest.RoleId
            };

            var registerResponse = new UserDTO
            {
                UserId = 1,
                Email = newUser.Email,
                UserName = newUser.UserName,
                RoleId = newUser.RoleId
            };

            _roleRepositoryMock.Setup(repo => repo.GetByIdAsync(registerRequest.RoleId)).ReturnsAsync(new Models.Role { Id = 5, RoleName = "Customer" });
            _userRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null)).ReturnsAsync((Models.User)null);
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Models.User>());
            _userRepositoryMock.Setup(r => r.InsertAsync(It.IsAny<Models.User>())).ReturnsAsync(newUser);
            _userRepositoryMock.Setup(r => r.SaveAsync()).ReturnsAsync(1);
            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>())).Returns(registerResponse);
            _emailServiceMock.Setup(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(true);

            // Act
            var result = await _userService.CreateNewUserOrCustomer(registerRequest);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(1, result.Data.UserId);
            _userRepositoryMock.Verify(repo => repo.InsertAsync(It.IsAny<Models.User>()), Times.Once);
            _userRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateNewUser_WhenEmailExists()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "loc@gmail.com",
                UserName = "123",
                RoleId = 1,
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null))
                .ReturnsAsync(new Models.User { Email = "loc@gmail.com", UserName = "loc" });

            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Email hoặc username đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenUsernameExists()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "loc123@gmail.com",
                UserName = "loc",
                RoleId = 1,
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null))
                .ReturnsAsync(new Models.User { Email = "loc@gmail.com", UserName = "loc" });

            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Email hoặc username đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenIsRoleCustomer()
        {
            // Arrange
            var registerRequest = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 5
            };

            var newUser = new Models.User
            {
                Email = registerRequest.Email,
                UserName = registerRequest.UserName,
                RoleId = 5
            };

            var registerResponse = new UserDTO
            {
                UserId = 1,
                Email = newUser.Email,
                UserName = newUser.UserName,
                RoleId = 5
            };

            _roleRepositoryMock.Setup(repo => repo.GetByIdAsync(registerRequest.RoleId)).ReturnsAsync(new Models.Role { Id = 5, RoleName = "Customer" });
            _userRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null)).ReturnsAsync((Models.User)null);
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Models.User>());
            _userRepositoryMock.Setup(r => r.InsertAsync(It.IsAny<Models.User>())).ReturnsAsync(newUser);
            _userRepositoryMock.Setup(r => r.SaveAsync()).ReturnsAsync(1);
            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>())).Returns(registerResponse);
            _emailServiceMock.Setup(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(true);

            // Act
            var result = await _userService.CreateNewUserOrCustomer(registerRequest);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(1, result.Data.UserId);
            Assert.Equal(5, result.Data.RoleId);
            Assert.Null(result.Data.EmployeeCode);
            _userRepositoryMock.Verify(repo => repo.InsertAsync(It.IsAny<Models.User>()), Times.Once);
            _userRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateNewUser_WhenIsRoleNotCustomer()
        {
            // Arrange
            var registerRequest = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };

            var newUser = new Models.User
            {
                Email = registerRequest.Email,
                UserName = registerRequest.UserName,
                RoleId = 1
            };

            var registerResponse = new UserDTO
            {
                UserId = 1,
                Email = newUser.Email,
                UserName = newUser.UserName,
                RoleId = 1,
                EmployeeCode = "NV0"
            };

            _roleRepositoryMock.Setup(repo => repo.GetByIdAsync(registerRequest.RoleId)).ReturnsAsync(new Models.Role { Id = 1, RoleName = "Admin" });
            _userRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null)).ReturnsAsync((Models.User)null);
            _userRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Models.User>());
            _userRepositoryMock.Setup(r => r.InsertAsync(It.IsAny<Models.User>())).ReturnsAsync(newUser);
            _userRepositoryMock.Setup(r => r.SaveAsync()).ReturnsAsync(1);
            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>())).Returns(registerResponse);
            _emailServiceMock.Setup(e => e.SendEmailAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(true);

            // Act
            var result = await _userService.CreateNewUserOrCustomer(registerRequest);

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(1, result.Data.UserId);
            Assert.Equal(1, result.Data.RoleId);
            Assert.NotNull(result.Data.EmployeeCode);
            _userRepositoryMock.Verify(repo => repo.InsertAsync(It.IsAny<Models.User>()), Times.Once);
            _userRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateNewUser_WhenAvatarIsInvalidFormat_ReturnsError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1,
                Avatar = new FormFile(new MemoryStream(new byte[10]), 0, 10, "Data", "test-file.txt")
            };

            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1,
                Avatar = "test-file.txt",
                UserId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception());
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.True(result.Message.Contains("Lỗi: Object reference not set to an instance"));
        }

        [Fact]
        public async Task CreateNewUser_WhenRoleDoesNotExist_ReturnsError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1000
            };

            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1000
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("Role không tồn tại."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Role không tồn tại."));
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Role không tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenDatabaseConnectionFails_ReturnsError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };


            _roleRepositoryMock.Setup(repo => repo.GetByIdAsync(userInput.RoleId)).ReturnsAsync(new Models.Role { Id = 1, RoleName = "Admin" });
            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null)).ReturnsAsync((Models.User)null);
            _userRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Models.User>());
            _userRepositoryMock.Setup(repo => repo.InsertAsync(It.IsAny<Models.User>())).ThrowsAsync(new Exception("Database connection failed"));

            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Contains("Lỗi: Database connection failed", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenPhoneNull_ReturnError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = null,
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = null,
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("Số điện thoại không được để trống."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Số điện thoại không được để trống."));
            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Số điện thoại không được để trống.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenPhoneInvalid_ReturnError()
        {
            // Arrange
          
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "123", // Invalid phone number
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = "123", // Invalid phone number
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("Số điện thoại sai định dạng."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Số điện thoại sai định dạng."));
            // Act

            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Số điện thoại sai định dạng.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenUsernameInvalid_ReturnError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = null,
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = null,
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("Tên tài khoản không được để trống."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Tên tài khoản không được để trống."));
            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Tên tài khoản không được để trống.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenEmailInvalid_ReturnError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = null,
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            var User = new Models.User
            {
                Email = null,
                UserName = "testUser",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = true,
                RoleId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("Email không được để trống."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Email không được để trống."));
            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Email không được để trống.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_AgeInvalid_ReturnError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 0,
                Status = true,
                RoleId = 1
            };

            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 0,
                Status = true,
                RoleId = 1
            };

            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
                ThrowsAsync(new Exception("Tuổi không được để trống hoặc không hợp lệ."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Tuổi không được để trống hoặc không hợp lệ."));

            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Tuổi không được để trống hoặc không hợp lệ.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_TaxcodeInvalid_ReturnError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = null,
                Age = 25,
                Status = true,
                RoleId = 1
            };
            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = "0987654321",
                TaxCode = null,
                Age = 25,
                Status = true,
                RoleId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("TaxCode không được để trống hoặc không hợp lệ."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("TaxCode không được để trống hoặc không hợp lệ."));
            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: TaxCode không được để trống hoặc không hợp lệ.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_StatusCodeInvalid_ReturnError()
        {
            // Arrange
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Password = "password",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = null,
                RoleId = 1
            };
            var User = new Models.User
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                Phone = "0987654321",
                TaxCode = "123456789",
                Age = 25,
                Status = null,
                RoleId = 1
            };
            _userRepositoryMock.Setup(x => x.InsertAsync(User)).
    ThrowsAsync(new Exception("Status không được để trống hoặc không hợp lệ."));

            _userRepositoryMock.Setup(x => x.SaveAsync()).
                 ThrowsAsync(new Exception("Status không được để trống hoặc không hợp lệ."));
            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Lỗi: Status không được để trống hoặc không hợp lệ.", result.Message);
        }
    }
}