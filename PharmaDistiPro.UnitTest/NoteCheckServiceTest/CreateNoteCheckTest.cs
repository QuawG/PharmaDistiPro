using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.NoteChecks; // Ensure correct namespace
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;
using Xunit.Sdk;

namespace PharmaDistiPro.UnitTest.NoteCheckServiceTest
{
    public class CreateNoteCheckTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;

        public CreateNoteCheckTest()
        {
            _noteCheckRepositoryMock = new Mock<INoteCheckRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            var httpContext = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            _noteCheckService = new NoteCheckService(
                _noteCheckRepositoryMock.Object,
                _mapperMock.Object,
                _productLotRepositoryMock.Object,
                _userRepositoryMock.Object,
                _httpContextAccessorMock.Object
            );
        }

        [Fact]
        public async Task CreateNoteCheckAsync_WhenValidData_ReturnsSuccess()
        {
            // Arrange
            var userId = "1";
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>
                {
                    new NoteCheckDetailRequestDTO { ProductLotId = 1, ActualQuantity = 8, ErrorQuantity = 2 }
                }
            };

            var productLot = new ProductLot { ProductLotId = 1, ProductId = 101, Quantity = 10, LotId = 1 };
            var product = new Product { ProductId = 101, ProductName = "Paracetamol" };
            var noteCheck = new NoteCheck
            {
                NoteCheckId = 1,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                CreatedBy = int.Parse(userId), // Convert string to int
                CreatedDate = DateTime.UtcNow,
                Status = false,
                NoteCheckDetails = new List<NoteCheckDetail>
                {
                    new NoteCheckDetail
                    {
                        ProductLotId = 1,
                        StorageQuantity = 10,
                        ActualQuantity = 8,
                        ErrorQuantity = 2,
                        DifferenceQuatity = 2,
                        Status = 0
                    }
                },
                Result = "Sản phẩm Paracetamol của lô 1 này đủ (hỏng 2)"
            };
            var noteCheckDto = new NoteCheckDTO
            {
                NoteCheckId = 1,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                CreatedBy = 1,
                Status = false
            };

            _httpContextAccessorMock.Setup(x => x.HttpContext.User.Identity.Name).Returns(userId);
            _mapperMock.Setup(m => m.Map<NoteCheck>(It.IsAny<NoteCheckRequestDTO>())).Returns(noteCheck);
            _productLotRepositoryMock
                .Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<ProductLot, bool>>>(), null))
                .ReturnsAsync(productLot);
            _productLotRepositoryMock.Setup(r => r.GetProductByIdAsync(101)).ReturnsAsync(product);
            _mapperMock
                .Setup(m => m.Map<NoteCheckDetail>(It.IsAny<NoteCheckDetailRequestDTO>()))
                .Returns(new NoteCheckDetail { ProductLotId = 1, ActualQuantity = 8, ErrorQuantity = 2 });
            _noteCheckRepositoryMock.Setup(r => r.InsertNoteCheckAsync(It.IsAny<NoteCheck>())).Returns(Task.CompletedTask);
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(noteCheckDto);

            // Act
            var result = await _noteCheckService.CreateNoteCheckAsync(request);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(noteCheckDto.NoteCheckId, result.NoteCheckId);
            _noteCheckRepositoryMock.Verify(r => r.InsertNoteCheckAsync(It.IsAny<NoteCheck>()), Times.Once);
        }

   
  [Fact]
public async Task CreateNoteCheckAsync_WhenProductLotNotFound_ThrowsException()
        {
            // Arrange
            var request = new NoteCheckRequestDTO
            {
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                NoteCheckDetails = new List<NoteCheckDetailRequestDTO>
        {
            new NoteCheckDetailRequestDTO
            {
                ProductLotId = 1,
                ActualQuantity = 8,
                ErrorQuantity = 2
            }
        }
            };

            // Setup HttpContext
            _httpContextAccessorMock.Setup(x => x.HttpContext.User.Identity.Name).Returns("1");

            // Setup AutoMapper
            var noteCheck = new NoteCheck
            {
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                CreatedBy = 1,
                CreatedDate = DateTime.UtcNow,
                Status = false,
                NoteCheckDetails = new List<NoteCheckDetail>() // Ensure non-null
            };
            _mapperMock.Setup(m => m.Map<NoteCheck>(It.IsAny<NoteCheckRequestDTO>())).Returns(noteCheck);
            _mapperMock.Setup(m => m.Map<NoteCheckDTO>(It.IsAny<NoteCheck>())).Returns(new NoteCheckDTO
            {
                NoteCheckId = 1,
                StorageRoomId = 1,
                ReasonCheck = "Kiểm kê định kỳ",
                CreatedBy = 1,
                Status = false
            });

            // Setup ProductLotRepository to return null for ProductLot
            _productLotRepositoryMock
                .Setup(r => r.GetSingleByConditionAsync(
                    It.Is<Expression<Func<ProductLot, bool>>>(expr => expr.Compile()(new ProductLot { ProductLotId = 1 })),
                    null))
                .ReturnsAsync((ProductLot)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.CreateNoteCheckAsync(request));
            Assert.Equal("Không tìm thấy ProductLot với ID: 1", exception.Message);
        }
    }
}