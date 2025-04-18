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
    public class CancelIssueNoteTest
    {
        
            private readonly Mock<IOrderRepository> _orderRepositoryMock;
            private readonly Mock<IOrdersDetailRepository> _ordersDetailRepositoryMock;
            private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
            private readonly Mock<IIssueNoteRepository> _issueNoteRepositoryMock;
            private readonly Mock<IUserRepository> _userRepositoryMock;
            private readonly Mock<IIssueNoteDetailsRepository> _issueNoteDetailsRepositoryMock;
            private readonly Mock<IProductRepository> _productRepositoryMock; // Thêm
            private readonly Mock<IStorageRoomRepository> _storageRoomRepositoryMock; // Thêm
            private readonly Mock<IMapper> _mapperMock;
            private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
            private readonly IssueNoteService _issueNoteService;

            public CancelIssueNoteTest()
            {
                _userRepositoryMock = new Mock<IUserRepository>();
                _orderRepositoryMock = new Mock<IOrderRepository>();
                _ordersDetailRepositoryMock = new Mock<IOrdersDetailRepository>();
                _productLotRepositoryMock = new Mock<IProductLotRepository>();
                _issueNoteRepositoryMock = new Mock<IIssueNoteRepository>();
                _issueNoteDetailsRepositoryMock = new Mock<IIssueNoteDetailsRepository>();
                _productRepositoryMock = new Mock<IProductRepository>(); // Khởi tạo
                _storageRoomRepositoryMock = new Mock<IStorageRoomRepository>(); // Khởi tạo
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
                    _productRepositoryMock.Object, // Thêm
                    _storageRoomRepositoryMock.Object // Thêm
                );
            }
            [Fact]
        public async Task CreateIssueNoteTest_WhenNotIssuedFound_ReturnNullData()
        {
            _issueNoteRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<IssueNote, bool>>>(), null, null))
                .ReturnsAsync(new List<IssueNote>());


            var result = await _issueNoteService.CancelIssueNote(999);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy phiếu xuất kho", result.Message);
        }
        [Fact]
        public async Task CreateIssueNoteTest_WhenNotIssuedDetailFound_ReturnNullData()
        {
            IssueNote issueNotes = new IssueNote
                {
                    IssueNoteId = 999,
                    IssueNoteDetails = new List<IssueNoteDetail>()
                
            };
            _issueNoteRepositoryMock
                .Setup(repo => repo.GetByIdAsync(999))
                .ReturnsAsync(issueNotes);

            _issueNoteRepositoryMock
                .Setup(repo => repo.UpdateAsync(It.IsAny<IssueNote>()))
                .ReturnsAsync(new IssueNote());

            _issueNoteRepositoryMock
                .Setup(repo => repo.SaveAsync());


            _issueNoteDetailsRepositoryMock
                .Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<IssueNoteDetail, bool>>>(), null, null))
                .ReturnsAsync(new List<IssueNoteDetail>());

            var result = await _issueNoteService.CancelIssueNote(999);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Không tìm thấy chi tiết phiếu xuất kho", result.Message);
        }

        [Fact]
        public async Task CancelIssueNote_WhenSuccess_ReturnSuccessResponse()
        {
            // Arrange
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

            var productLots = new List<ProductLot>
    {
        new ProductLot { ProductLotId = 100, Quantity = 50 },
        new ProductLot { ProductLotId = 101, Quantity = 30 }
    };

            _issueNoteRepositoryMock.Setup(repo => repo.GetByIdAsync(issueNoteId))
                .ReturnsAsync(issueNote);

            _issueNoteDetailsRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<IssueNoteDetail, bool>>>(), null, null))
                .ReturnsAsync(issueNoteDetails);

            _productLotRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null, null))
                .ReturnsAsync(productLots);

            _mapperMock.Setup(mapper => mapper.Map<IssueNoteDto>(issueNote))
                .Returns(new IssueNoteDto { IssueNoteId = issueNoteId, Status = (int)Common.Enums.IssueNotesStatus.HUY });

            // Act
            var result = await _issueNoteService.CancelIssueNote(issueNoteId);

            // Assert
            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            Assert.Equal((int)Common.Enums.IssueNotesStatus.HUY, result.Data.Status);

            // Kiểm tra cập nhật số lượng sản phẩm trong lô hàng
            Assert.Equal(60, productLots.First(x => x.ProductLotId == 100).Quantity);
            Assert.Equal(35, productLots.First(x => x.ProductLotId == 101).Quantity);

            // Kiểm tra gọi phương thức lưu thay đổi
            _issueNoteRepositoryMock.Verify(repo => repo.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task CancelIssueNote_WhenDatabaseError_ReturnException()
        {
            _issueNoteRepositoryMock.Setup(repo => repo.GetByIdAsync(999)).ThrowsAsync(new Exception("Lỗi kết nối dữ liệu"));


            var result = await _issueNoteService.CancelIssueNote(999);

            Assert.Null(result.Data);
            Assert.False(result.Success);
            Assert.Equal("Lỗi kết nối dữ liệu", result.Message);
        }

        [Fact]
        public async Task CancelIssueNote_WhenProductLotFail_ReturnFalase()
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

            var productLots = new List<ProductLot>
    {
        new ProductLot { ProductLotId = 100, Quantity = 50 },
        new ProductLot { ProductLotId = 101, Quantity = 30 }
    };

            _issueNoteRepositoryMock.Setup(repo => repo.GetByIdAsync(issueNoteId))
                .ReturnsAsync(issueNote);

            _issueNoteDetailsRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<IssueNoteDetail, bool>>>(), null, null))
                .ReturnsAsync(issueNoteDetails);

            _productLotRepositoryMock.Setup(repo => repo.GetByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null, null))
                .ThrowsAsync(new Exception("Không có kho chứa"));

            var result = await _issueNoteService.CancelIssueNote(issueNoteId);

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có kho chứa", result.Message);
        }
    }
}
