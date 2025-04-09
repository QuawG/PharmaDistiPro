using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.IssueNote;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.IssueNoteServiceTest
{
    public class GetIssueNotByWarehouseList
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IIssueNoteRepository> _issueNoteRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IIssueNoteDetailsRepository> _issueNoteDetailsRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly IssueNoteService _issueNoteService;

        public GetIssueNotByWarehouseList()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _issueNoteRepositoryMock = new Mock<IIssueNoteRepository>();
            _issueNoteDetailsRepositoryMock = new Mock<IIssueNoteDetailsRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _issueNoteService = new IssueNoteService(
                _orderRepositoryMock.Object,
                _issueNoteRepositoryMock.Object,
                _issueNoteDetailsRepositoryMock.Object,
                _ordersDetailRepositoryMock.Object,
                _productLotRepositoryMock.Object,
                _mapperMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object
            );
        }

        [Fact]
        public async Task GetIssueNoteByWarehouseId_WhenSuccess_ReturnData()
        {
            // Arrange
            var userId = 1;
            var issueNotes = new List<IssueNote>

            {
               new IssueNote { IssueNoteId = 1, Status = 2, CreatedBy = 1 },
               new IssueNote { IssueNoteId = 2, Status = 2, CreatedBy = 1 }
            };
            issueNotes = issueNotes.Where(x => x.CreatedBy == userId)
                .OrderByDescending(x => x.IssueNoteId)
                .ToList();

            _issueNoteRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<IssueNote, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<IssueNote>, IOrderedQueryable<IssueNote>>>()))
                .ReturnsAsync(issueNotes);

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<IssueNoteDto>>(issueNotes))
                .Returns(issueNotes.Select(x => new IssueNoteDto { IssueNoteId = x.IssueNoteId, Status = x.Status }));

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", userId.ToString()) });

            var result = await _issueNoteService.GetIssueNoteByWarehouseId(null);


            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetIssueNoteByWarehouseId_WhenStatusFiltered_ReturnFilteredData()
        {
            var userId = 1;
           var issueNotes = new List<IssueNote> 
            {  
                new IssueNote { IssueNoteId = 1, Status = 1, CreatedBy = userId },
                new IssueNote { IssueNoteId = 2, Status = 2, CreatedBy = userId }
            };

            issueNotes = issueNotes.Where(x => x.CreatedBy == userId && x.Status == 1).ToList();

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims) 
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", userId.ToString()) });

            _issueNoteRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<IssueNote, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<IssueNote>, IOrderedQueryable<IssueNote>>>()))
                .ReturnsAsync(issueNotes);

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<IssueNoteDto>>(issueNotes))   
                .Returns(issueNotes.Select(x => new IssueNoteDto { IssueNoteId = x.IssueNoteId, Status = x.Status }));

            var result = await _issueNoteService.GetIssueNoteByWarehouseId(new[] { 1 });

            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Single(result.Data);
        }

        [Fact]
        public async Task GetIssueNoteByWarehouseId_WhenExceptionThrown_ReturnFail()
        {
            var userId = 1;

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
             .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", userId.ToString()) });


            _issueNoteRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<IssueNote, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<IssueNote>, IOrderedQueryable<IssueNote>>>()))
                .ThrowsAsync(new Exception("Lỗi kết nối database"));

            var result = await _issueNoteService.GetIssueNoteByWarehouseId(null);

            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối database", result.Message);
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task GetIssueNoteByWarehouseId_WhenNoDataFound_ReturnFail()
        {
            var userId = 1;
            var issueNotes = new List<IssueNote>();

            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", userId.ToString()) });


            _issueNoteRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<IssueNote, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<IssueNote>, IOrderedQueryable<IssueNote>>>()))
                .ReturnsAsync(issueNotes);

            var result = await _issueNoteService.GetIssueNoteByWarehouseId(null);


            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task GetIssueNoteByWarehouseId_WhenUserIdNotExist_ReturnFail()
        {
            var userId = 0; // giả sử userId không tồn tại hoặc không hợp lệ
           
            _httpContextAccessorMock.Setup(http => http.HttpContext.User.Claims)
                .Returns(new List<System.Security.Claims.Claim> { new System.Security.Claims.Claim("userId", userId.ToString()) });


            _issueNoteRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<IssueNote, bool>>>(),
                    It.IsAny<string[]>(),
                    It.IsAny<Func<IQueryable<IssueNote>, IOrderedQueryable<IssueNote>>>()))
                .ThrowsAsync(new Exception("Không tồn tại người dùng"));

            var result = await _issueNoteService.GetIssueNoteByWarehouseId(null);

            Assert.False(result.Success);
            Assert.Equal("Không tồn tại người dùng", result.Message);
            Assert.Null(result.Data);
        }
    }
}
