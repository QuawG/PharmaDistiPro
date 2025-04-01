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
using System.Linq.Expressions;
using CloudinaryDotNet.Actions;
using PharmaDistiPro.Helper;
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
        private readonly Mock<UserHelper> _userHelperMock;
        private readonly UserService _userService;

        public CreateNewUserTest()
        {
            _roleRepositoryMock = new Mock<IRoleRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _userHelperMock = new Mock<UserHelper>();

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
        public async Task CreateNewUser_Success()
        {
            var registerRequest = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser"
            };

            var newUser = new Models.User
            {
                Email = registerRequest.Email,
                UserName = registerRequest.UserName
            };

            var registerResponse = new UserDTO
            {
                UserId = 1,
                Email = newUser.Email,
                UserName = newUser.UserName
            };

            var roles = new List<Models.Role>
    {
        new Models.Role { Id = 1, RoleName = "Admin" },
        new Models.Role { Id = 5, RoleName = "Customer" }
    }; 
            _roleRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(roles);

            _mapperMock.Setup(m => m.Map<Models.User>(It.IsAny<UserInputRequest>())).Returns(newUser);
            _userRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null)).ReturnsAsync((Models.User)null);
            _userRepositoryMock.Setup(r => r.InsertAsync(It.IsAny<Models.User>())).ReturnsAsync(newUser);
            _userRepositoryMock.Setup(r => r.SaveAsync()).Returns(Task.FromResult(1));
            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>())).Returns(registerResponse);

            var result = await _userService.CreateNewUserOrCustomer(registerRequest);

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
            var userInput = new UserInputRequest
            {
                Email = "loc@gmail.com",
                UserName = "123",
                RoleId = 1
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null))
            .ReturnsAsync(new Models.User 
             {
                Email = "loc@gmail.com",
                UserName = "loc"
            });



            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.Equal("Email hoặc username đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenUsernameExists()
        {
            var userInput = new UserInputRequest
            {
                Email = "loc123@gmail.com",
                UserName = "loc",
                RoleId = 1
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null))
            .ReturnsAsync(new Models.User 
            {
                Email = "loc@gmail.com",
                UserName = "loc"
            });

            var result = await _userService.CreateNewUserOrCustomer(userInput);

            Assert.False(result.Success);
            Assert.Equal("Email hoặc username đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewUser_WhenIsRoleCustomer()
        {
            var registerRequest = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser"
            };

            var newUser = new Models.User
            {
                Email = registerRequest.Email,
                UserName = registerRequest.UserName
            };

            var registerResponse = new UserDTO
            {
                UserId = 1,
                Email = newUser.Email,
                UserName = newUser.UserName
            };

            var roles = new List<Models.Role>
    {
        new Models.Role { Id = 1, RoleName = "Admin" },
        new Models.Role { Id = 5, RoleName = "Customer" }
    };
            _roleRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(roles);

            _mapperMock.Setup(m => m.Map<Models.User>(It.IsAny<UserInputRequest>())).Returns(newUser);
            _userRepositoryMock.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null)).ReturnsAsync((Models.User)null);
            _userRepositoryMock.Setup(r => r.InsertAsync(It.IsAny<Models.User>())).ReturnsAsync(newUser);
            _userRepositoryMock.Setup(r => r.SaveAsync()).Returns(Task.FromResult(1));
            _mapperMock.Setup(m => m.Map<UserDTO>(It.IsAny<Models.User>())).Returns(registerResponse);

            var result = await _userService.CreateNewUserOrCustomer(registerRequest);

            Assert.True(result.Success);
            Assert.Equal("Tạo mới thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(1, result.Data.UserId); 
            Assert.Null(result.Data.EmployeeCode); 

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
                RoleId = 1,
                Avatar = new FormFile(new MemoryStream(new byte[10]), 0, 10, "Data", "test-file.txt") //Tệp không hợp lệ
            };

            var fakeUser = new Models.User
            {
                Email = userInput.Email,
                UserName = userInput.UserName
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null))
                .ReturnsAsync((Models.User)null);

            _userRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(new List<Models.User>());

            var result = await _userService.CreateNewUserOrCustomer(userInput);

            Assert.False(result.Success);
        }

        [Fact]
        public async Task CreateNewUser_WhenRoleDoesNotExist_ReturnsError()
        {
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1000 
            };

            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
          
        }

        [Fact]
        public async Task CreateNewUser_WhenDatabaseConnectionFails_ReturnsError()
        {
            var userInput = new UserInputRequest
            {
                Email = "test@gmail.com",
                UserName = "testUser",
                RoleId = 1
            };

            _userRepositoryMock.Setup(repo => repo.GetSingleByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), null))
                .ThrowsAsync(new Exception()); 

            // Act
            var result = await _userService.CreateNewUserOrCustomer(userInput);

            // Assert
            Assert.False(result.Success);
            Assert.NotEmpty(result.Message); 
        }
    }
}
