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
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.IssueNoteServiceTest
{
    public class GetIssueNoteListTest
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

        public GetIssueNoteListTest()
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
        public async Task GetIssueNoteListTest_WhenEmptyData_ReturnNull()
        {
            var issueNoteList = new List<IssueNote>(); 

            _issueNoteRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(issueNoteList.AsEnumerable());

            var result = await _issueNoteService.GetIssueNoteList();

            Assert.Equal("Không có dữ liệu", result.Message);
        }
        [Fact]
        public async Task GetIssueNoteListTest_WhenDatabaseException_ReturnException()
        {
            var issueNoteList = new List<IssueNote>(); 

            _issueNoteRepositoryMock.Setup(repo => repo.GetAllAsync()).ThrowsAsync(new Exception("Lỗi kết nối database"));

            var result = await _issueNoteService.GetIssueNoteList();

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Lỗi kết nối database", result.Message);
        }
        [Fact]
        public async Task GetIssueNoteListTest_WhenHasData_ReturnSuccess()
        {      
            var issueNoteList = new List<IssueNote>
            { new IssueNote { IssueNoteId = 1, OrderId = 2 } };

            _issueNoteRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(issueNoteList.AsEnumerable());

            _mapperMock.Setup(map => map.Map<IEnumerable<IssueNoteDto>>(issueNoteList))
                .Returns(new List<IssueNoteDto> { new IssueNoteDto { IssueNoteId = 1, OrderId = 2 } });

            var result = await _issueNoteService.GetIssueNoteList();

            Assert.True(result.Success); 
            Assert.NotNull(result.Data);
            Assert.Single(result.Data); 
        }


    }
}
