using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoMapper;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
namespace PharmaDistiPro.Test.User
{
    public class GetUserTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly UserService _userService;

        public GetUserTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>();

            _userService = new UserService(
                _userRepositoryMock.Object,
                _mapperMock.Object,
                null,
                null,
                null
            );
        }

        [Fact]
        public async Task GetCustomerList_ShouldReturnCustomers_WhenUsersExist()
        {
            var users = new List<Models.User>
        {
            new Models.User { UserId = 1, UserName = "loc", RoleId = 5 },
            new Models.User { UserId = 2, UserName = "loc2", RoleId = 5 },
            new Models.User { UserId = 3, UserName = "loc3", RoleId = 1 }
        };

            var userDTOs = new List<UserDTO>
        {
            new UserDTO { UserId = 1, UserName = "loc" },
            new UserDTO { UserId = 2, UserName = "loc2" }
        };

            users = users.OrderByDescending(x => x.UserId).ToList();

            _userRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), It.IsAny<string[]>(),
                It.IsAny<Func<IQueryable<Models.User>, IOrderedQueryable<Models.User>>>()))
                .ReturnsAsync(users);

            _mapperMock
                .Setup(mapper => mapper.Map<IEnumerable<UserDTO>>(users))
                .Returns(userDTOs);


            var result = await _userService.GetCustomerList();

            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetCustomerList_ShouldReturnNoDataUser_WhenNoUsersExist()
        {
            var emptyUsers = new List<Models.User>();

            _userRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(),
                It.IsAny<string[]>(), It.IsAny<Func<IQueryable<Models.User>, IOrderedQueryable<Models.User>>>()))
                .ReturnsAsync(emptyUsers);

            var result = await _userService.GetCustomerList();

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetCustomerList_ShouldReturnNoDataCustomer_WhenNoUsersExist()
        {
            var emptyUsers = new List<Models.User>();

            _userRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(),
                It.IsAny<string[]>(), It.IsAny<Func<IQueryable<Models.User>, IOrderedQueryable<Models.User>>>()))
                .ReturnsAsync(emptyUsers);

            var result = await _userService.GetCustomerList();

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetCustomerList_ShouldReturnError_WhenExceptionThrown()
        {
            _userRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(), It.IsAny<string[]>(), 
                It.IsAny<Func<IQueryable<Models.User>, IOrderedQueryable<Models.User>>>()))
                .ThrowsAsync(new Exception("Lỗi hệ thống"));

            var result = await _userService.GetCustomerList();

            Assert.False(result.Success);
            Assert.Equal("Lỗi hệ thống", result.Message);
        }

        [Fact]
        public async Task GetUserList_ShouldReturnUser_WhenUsersExist()
        {
            var users = new List<Models.User>
        {
            new Models.User { UserId = 1, UserName = "loc", RoleId = 1 },
            new Models.User { UserId = 2, UserName = "loc2", RoleId = 2 }
        };
            users = users.OrderByDescending(x => x.UserId).ToList();

            var userDTOs = new List<UserDTO>
        {
            new UserDTO { UserId = 1, UserName = "loc" },
            new UserDTO { UserId = 2, UserName = "loc2" }
        };

            _userRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<Models.User, bool>>>(),
                It.IsAny<string[]>(), It.IsAny<Func<IQueryable<Models.User>, IOrderedQueryable<Models.User>>>()))
                .ReturnsAsync(users);

            _mapperMock
                .Setup(mapper => mapper.Map<IEnumerable<UserDTO>>(users))
                .Returns(userDTOs);

            var result = await _userService.GetCustomerList();

            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
        }
    }
}