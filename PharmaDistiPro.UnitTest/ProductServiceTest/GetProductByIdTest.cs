using AutoMapper;
using CloudinaryDotNet;
using Moq;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.UnitTest.ProductServiceTest
{
    public class GetProductByIdTest
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Mock<Cloudinary> _mockCloudinary;
        private readonly ProductService _productService;

        public GetProductByIdTest()
        {
            _mockProductRepository = new Mock<IProductRepository>();
            _mockMapper = new Mock<IMapper>();
            _mockCategoryRepository = new Mock<ICategoryRepository>();
            _mockCloudinary = new Mock<Cloudinary>(new Account("cloud", "key", "secret"));
            _productService = new ProductService(
                _mockProductRepository.Object,
                _mockMapper.Object,
                _mockCloudinary.Object,
                _mockCategoryRepository.Object
            );
        }

        [Fact]
        public async Task GetProductById_WhenProductExists_ReturnsSuccessResponse()
        {
            // Arrange
            int productId = 1;
            var product = new Product
            {
                ProductId = productId,
                ProductName = "Test Product",
                ImageProducts = new List<ImageProduct>
                {
                    new ImageProduct { Image = "image1.jpg" },
                    new ImageProduct { Image = "image2.jpg" }
                }
            };

            var productDto = new ProductDTO
            {
                ProductId = productId,
                ProductName = "Test Product"
            };

            _mockProductRepository
                .Setup(repo => repo.GetByIdAsyncProduct(productId))
                .ReturnsAsync(product);

            _mockMapper
                .Setup(mapper => mapper.Map<ProductDTO>(product))
                .Returns(productDto);

            // Act
            var response = await _productService.GetProductById(productId);

            // Assert
            Assert.True(response.Success);
            Assert.NotNull(response.Data);
            Assert.Equal(productId, response.Data.ProductId);
            Assert.Equal(2, response.Data.Images.Count);
            Assert.Contains("image1.jpg", response.Data.Images);
            Assert.Contains("image2.jpg", response.Data.Images);
        }

        [Fact]
        public async Task GetProductById_WhenProductDoesNotExist_ReturnsNotFoundResponse()
        {
            // Arrange
            int productId = 100;

            _mockProductRepository
                .Setup(repo => repo.GetByIdAsyncProduct(productId))
                .ReturnsAsync((Product)null);

            // Act
            var response = await _productService.GetProductById(productId);

            // Assert
            Assert.False(response.Success);
            Assert.Null(response.Data);
            Assert.Equal("Không tìm thấy sản phẩm", response.Message);
        }

        [Fact]
        public async Task GetProductById_WhenExceptionThrown_ReturnsFailedResponse()
        {
            // Arrange
            int productId = 1;

            _mockProductRepository
                .Setup(repo => repo.GetByIdAsyncProduct(productId))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var response = await _productService.GetProductById(productId);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Database error", response.Message);
        }
    }
}
