using Xunit;
using Moq;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories;
using PharmaDistiPro.DTO;
using CloudinaryDotNet;
using System.Linq;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.UnitTest.ProductServiceTest
{
    public class GetProductList
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Cloudinary _cloudinary;
        private readonly ProductService _productService;

        public GetProductList()
        {
            _mockProductRepository = new Mock<IProductRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockCategoryRepository = new Mock<ICategoryRepository>();
            _cloudinary = new Cloudinary(new Account("cloud", "key", "secret"));

            _productService = new ProductService(
                _mockProductRepository.Object,
                _mockMapper.Object,
                _cloudinary,
                _mockCategoryRepository.Object
            );
        }

        [Fact]
        public async Task GetProductList_ShouldReturnProductDTOsWithImages()
        {
            var products = new List<Product>
            {
                new Product
                {
                    ProductId = 1,
                    ProductName = "Test Product",
                    ImageProducts = new List<ImageProduct>
                    {
                        new ImageProduct { Image = "image1.jpg" },
                        new ImageProduct { Image = "image2.jpg" }
                    }
                }
            };

            var productDtos = new List<ProductDTO>
            {
                new ProductDTO
                {
                    ProductId = 1,
                    ProductName = "Test Product",
                    Images = new List<string>()
                }
            };

            _mockProductRepository
                .Setup(repo => repo.GetAllAsyncProduct())
                .ReturnsAsync(products);

            _mockMapper
                .Setup(mapper => mapper.Map<IEnumerable<ProductDTO>>(products))
                .Returns(productDtos);

            var result = await _productService.GetProductList();

            Assert.True(result.Success);
            Assert.NotNull(result.Data);
            var dto = result.Data.First();
            Assert.Equal(1, dto.ProductId);
            Assert.Equal(2, dto.Images.Count);
            Assert.Contains("image1.jpg", dto.Images);
            Assert.Contains("image2.jpg", dto.Images);
        }

        [Fact]
        public async Task GetProductList_WhenNoProducts_ReturnsEmptyList()
        {
            _mockProductRepository
                .Setup(repo => repo.GetAllAsyncProduct())
                .ReturnsAsync((List<Product>)null);

            _mockMapper
                .Setup(mapper => mapper.Map<IEnumerable<ProductDTO>>(It.IsAny<IEnumerable<Product>>()))
                .Returns(new List<ProductDTO>());

            var result = await _productService.GetProductList();

            Assert.True(result.Success);
            Assert.Empty(result.Data);
            Assert.Equal("Không có sản phẩm nào.", result.Message);
        }

        [Fact]
        public async Task GetProductList_WhenExceptionThrown_ReturnsFailureResponse()
        {
            _mockProductRepository
                .Setup(repo => repo.GetAllAsyncProduct())
                .ThrowsAsync(new Exception());

            var result = await _productService.GetProductList();

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Đã xảy ra lỗi khi lấy danh sách sản phẩm.", result.Message);
        }
    }
}
