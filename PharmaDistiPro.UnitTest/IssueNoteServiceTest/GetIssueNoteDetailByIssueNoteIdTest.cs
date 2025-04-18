using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.IssueNoteDetails;
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
    public class GetIssueNoteDetailByIssueNoteIdTest
    {
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IIssueNoteRepository> _issueNoteRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IIssueNoteDetailsRepository> _issueNoteDetailsRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IStorageRoomRepository> _storageRoomRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly IssueNoteService _issueNoteService;

        public GetIssueNoteDetailByIssueNoteIdTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _issueNoteRepositoryMock = new Mock<IIssueNoteRepository>();
            _issueNoteDetailsRepositoryMock = new Mock<IIssueNoteDetailsRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _storageRoomRepositoryMock = new Mock<IStorageRoomRepository>();
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
                _httpContextAccessorMock.Object,
                _productRepositoryMock.Object,
                _storageRoomRepositoryMock.Object
            );
        }

        [Fact]
        public async Task GetIssueNoteDetailByIssueNoteIdTest_WhenNotIssuedFound_ReturnNullData()
        {
            _issueNoteRepositoryMock
            .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<IssueNote, bool>>>(), null, null))
            .ReturnsAsync(new List<IssueNote>());


            var result = await _issueNoteService.GetIssueNoteDetailByIssueNoteId(999);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetIssueNoteDetailByIssueNoteIdTest_WhenIssuedFound_ReturnSuccess()
        {
            int issueNoteId = 1;

            var issueNote = new IssueNote
            {
                IssueNoteId = issueNoteId,
                Status = (int)Common.Enums.IssueNotesStatus.DA_XUAT,
                CreatedBy = 1,
                UpdatedStatusDate = DateTime.Now
            };

            var issueNoteDetails = new List<IssueNoteDetail>
    {
        new IssueNoteDetail { IssueNoteDetailId = 1, IssueNoteId = issueNoteId, ProductLotId = 100, Quantity = 10 },
        new IssueNoteDetail { IssueNoteDetailId = 2, IssueNoteId = issueNoteId, ProductLotId = 101, Quantity = 5 }
    };

            var issueNoteDetailsDto = new List<IssueNoteDetailDto>
    {
        new IssueNoteDetailDto { IssueNoteDetailId = 1, IssueNoteId = issueNoteId, ProductLotId = 100, Quantity = 10 },
        new IssueNoteDetailDto { IssueNoteDetailId = 2, IssueNoteId = issueNoteId, ProductLotId = 101, Quantity = 5 }
    };

            _issueNoteDetailsRepositoryMock.Setup(repo => repo.GetByConditionAsync(
    It.IsAny<Expression<Func<IssueNoteDetail, bool>>>(),
    It.Is<string[]>(includes => includes != null && includes.Contains("ProductLot") && includes.Contains("ProductLot.Product")),
    It.IsAny<Func<IQueryable<IssueNoteDetail>, IOrderedQueryable<IssueNoteDetail>>>())) // Tham số orderBy nếu có
    .ReturnsAsync(issueNoteDetails);

            // Fix setup của Mapper
            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<IssueNoteDetailDto>>(issueNoteDetails))
                .Returns(issueNoteDetailsDto);

            var result = await _issueNoteService.GetIssueNoteDetailByIssueNoteId(issueNoteId);

            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetIssueNoteDetailByIssueNoteIdTest_WhenIssuedFoundButNotHasProduct_ReturnFalse()
        {
            int issueNoteId = 1;

            var issueNote = new IssueNote
            {
                IssueNoteId = issueNoteId,
                Status = (int)Common.Enums.IssueNotesStatus.DA_XUAT,
                CreatedBy = 1,
                UpdatedStatusDate = DateTime.Now
            };

            var issueNoteDetails = new List<IssueNoteDetail>   
            {   new IssueNoteDetail { IssueNoteDetailId = 1, IssueNoteId = issueNoteId, ProductLotId = 100, Quantity = 10 },
                new IssueNoteDetail { IssueNoteDetailId = 2, IssueNoteId = issueNoteId, ProductLotId = 101, Quantity = 5 }
            };

            var issueNoteDetailsDto = new List<IssueNoteDetailDto>  
            { new IssueNoteDetailDto { IssueNoteDetailId = 1, IssueNoteId = issueNoteId, ProductLotId = 100, Quantity = 10 },
              new IssueNoteDetailDto { IssueNoteDetailId = 2, IssueNoteId = issueNoteId, ProductLotId = 101, Quantity = 5 }
            };

            _issueNoteDetailsRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<IssueNoteDetail, bool>>>(), null, null))                   
                .ReturnsAsync(issueNoteDetails);

            _mapperMock.Setup(mapper => mapper.Map<IEnumerable<IssueNoteDetailDto>>(issueNoteDetails))
                .Returns(issueNoteDetailsDto);

            var result = await _issueNoteService.GetIssueNoteDetailByIssueNoteId(issueNoteId);

            Assert.False(result.Success);
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task GetIssueNoteDetailByIssueNoteIdTest_WhenDatabaseException_ReturnNullData()
        {
            _issueNoteDetailsRepositoryMock.Setup(repo => repo.GetByConditionAsync(
                    It.IsAny<Expression<Func<IssueNoteDetail, bool>>>(),
                    It.Is<string[]>(includes => includes != null && includes.Contains("ProductLot") && includes.Contains("ProductLot.Product")),
                    It.IsAny<Func<IQueryable<IssueNoteDetail>, IOrderedQueryable<IssueNoteDetail>>>())) // Tham số orderBy nếu có
                    .ThrowsAsync(new Exception("Lỗi kết nối dữ liệu"));


            var result = await _issueNoteService.GetIssueNoteDetailByIssueNoteId(999);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối dữ liệu", result.Message);
        }

    }
}
