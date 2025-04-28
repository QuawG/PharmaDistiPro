using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.NoteCheckDetails;
using PharmaDistiPro.DTO.NoteChecks;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;
using PharmaDistiPro.DTO;
using PharmaDistiPro.DTO.Products;// For ProductDTO

namespace PharmaDistiPro.UnitTest.NoteCheckServiceTest
{
    public class GetAllErrorProductsTest
    {
        private readonly Mock<INoteCheckRepository> _noteCheckRepositoryMock;
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly NoteCheckService _noteCheckService;

        public GetAllErrorProductsTest()
        {
            _noteCheckRepositoryMock = new Mock<INoteCheckRepository>();
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            // Setup HttpContext
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
        public async Task GetAllErrorProductsAsync_ErrorProductsExist_ReturnsList()
        {
            // Arrange
            var noteChecks = new List<NoteCheck>
            {
                new NoteCheck
                {
                    NoteCheckId = 1,
                    NoteCheckCode = "NC001",
                    NoteCheckDetails = new List<NoteCheckDetail>
                    {
                        new NoteCheckDetail { NoteCheckDetailId = 1, ProductLotId = 1, ErrorQuantity = 2, Status = 0 }
                    }
                }
            };
            var noteCheckDtos = new List<NoteCheckDTO>
            {
                new NoteCheckDTO
                {
                    NoteCheckId = 1,
                    NoteCheckCode = "NC001",
                    NoteCheckDetails = new List<NoteCheckDetailsDTO>
                    {
                        new NoteCheckDetailsDTO
                        {
                            NoteCheckDetailId = 1,
                            ProductLotId = 1,
                            ErrorQuantity = 2,
                            Status = 0,
                            ProductLot = new ProductLotCheckNoteDetailsDTO
                            {
                                ProductLotId = 1,
                                LotId = 1001, // int for LotId
                                Product = new ProductDTO { ProductId = 101, ProductName = "Paracetamol" }
                            }
                        }
                    }
                }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDTO>>(It.IsAny<List<NoteCheck>>())).Returns(noteCheckDtos);

            // Act
            var result = await _noteCheckService.GetAllErrorProductsAsync();

            // Assert
            Assert.NotEmpty(result);
            Assert.Equal("Paracetamol", result[0].ProductName);
            Assert.Equal(2, result[0].ErrorQuantity);
            Assert.Equal("Đang xử lý", result[0].ErrorStatus);
        }

        [Fact]
        public async Task GetAllErrorProductsAsync_NoNoteChecks_ThrowsException()
        {
            // Arrange
            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(new List<NoteCheck>());

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.GetAllErrorProductsAsync());
            Assert.Equal("Không có đơn kiểm kê nào.", exception.Message);
        }

        [Fact]
        public async Task GetAllErrorProductsAsync_NoErrorProducts_ThrowsException()
        {
            // Arrange
            var noteChecks = new List<NoteCheck>
            {
                new NoteCheck
                {
                    NoteCheckId = 1,
                    NoteCheckDetails = new List<NoteCheckDetail>
                    {
                        new NoteCheckDetail { NoteCheckDetailId = 1, ProductLotId = 1, ErrorQuantity = 0 }
                    }
                }
            };
            var noteCheckDtos = new List<NoteCheckDTO>
            {
                new NoteCheckDTO
                {
                    NoteCheckId = 1,
                    NoteCheckDetails = new List<NoteCheckDetailsDTO>
                    {
                        new NoteCheckDetailsDTO { NoteCheckDetailId = 1, ProductLotId = 1, ErrorQuantity = 0 }
                    }
                }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDTO>>(It.IsAny<List<NoteCheck>>())).Returns(noteCheckDtos);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _noteCheckService.GetAllErrorProductsAsync());
            Assert.Equal("Không có sản phẩm hỏng nào được tìm thấy.", exception.Message);
        }

        [Fact]
        public async Task GetAllErrorProductsAsync_MixedErrorAndNonError_ReturnsOnlyErrorProducts()
        {
            // Arrange
            var noteChecks = new List<NoteCheck>
            {
                new NoteCheck
                {
                    NoteCheckId = 1,
                    NoteCheckCode = "NC001",
                    NoteCheckDetails = new List<NoteCheckDetail>
                    {
                        new NoteCheckDetail { NoteCheckDetailId = 1, ProductLotId = 1, ErrorQuantity = 2, Status = 0 },
                        new NoteCheckDetail { NoteCheckDetailId = 2, ProductLotId = 2, ErrorQuantity = 0 }
                    }
                }
            };
            var noteCheckDtos = new List<NoteCheckDTO>
            {
                new NoteCheckDTO
                {
                    NoteCheckId = 1,
                    NoteCheckCode = "NC001",
                    NoteCheckDetails = new List<NoteCheckDetailsDTO>
                    {
                        new NoteCheckDetailsDTO
                        {
                            NoteCheckDetailId = 1,
                            ProductLotId = 1,
                            ErrorQuantity = 2,
                            Status = 0,
                            ProductLot = new ProductLotCheckNoteDetailsDTO
                            {
                                ProductLotId = 1,
                                LotId = 1001, // int for LotId
                                Product = new ProductDTO { ProductId = 101, ProductName = "Paracetamol" }
                            }
                        },
                        new NoteCheckDetailsDTO
                        {
                            NoteCheckDetailId = 2,
                            ProductLotId = 2,
                            ErrorQuantity = 0
                        }
                    }
                }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDTO>>(It.IsAny<List<NoteCheck>>())).Returns(noteCheckDtos);

            // Act
            var result = await _noteCheckService.GetAllErrorProductsAsync();

            // Assert
            Assert.Single(result);
            Assert.Equal(2, result[0].ErrorQuantity);
        }

        [Fact]
        public async Task GetAllErrorProductsAsync_CanceledErrorProduct_ReturnsCorrectStatus()
        {
            // Arrange
            var noteChecks = new List<NoteCheck>
            {
                new NoteCheck
                {
                    NoteCheckId = 1,
                    NoteCheckCode = "NC001",
                    NoteCheckDetails = new List<NoteCheckDetail>
                    {
                        new NoteCheckDetail { NoteCheckDetailId = 1, ProductLotId = 1, ErrorQuantity = 2, Status = 1 }
                    }
                }
            };
            var noteCheckDtos = new List<NoteCheckDTO>
            {
                new NoteCheckDTO
                {
                    NoteCheckId = 1,
                    NoteCheckCode = "NC001",
                    NoteCheckDetails = new List<NoteCheckDetailsDTO>
                    {
                        new NoteCheckDetailsDTO
                        {
                            NoteCheckDetailId = 1,
                            ProductLotId = 1,
                            ErrorQuantity = 2,
                            Status = 1,
                            ProductLot = new ProductLotCheckNoteDetailsDTO
                            {
                                ProductLotId = 1,
                                LotId = 1001, // int for LotId
                                Product = new ProductDTO { ProductId = 101, ProductName = "Paracetamol" }
                            }
                        }
                    }
                }
            };

            _noteCheckRepositoryMock.Setup(r => r.GetAllWithDetailsAsync()).ReturnsAsync(noteChecks);
            _mapperMock.Setup(m => m.Map<List<NoteCheckDTO>>(It.IsAny<List<NoteCheck>>())).Returns(noteCheckDtos);

            // Act
            var result = await _noteCheckService.GetAllErrorProductsAsync();

            // Assert
            Assert.NotEmpty(result);
            Assert.Equal("Đã hủy", result[0].ErrorStatus);
        }
    }
}