using Xunit;
using Moq;
using AutoMapper;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories;
using CloudinaryDotNet;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.UnitTest.ProductServiceTest
{
    public class ActivateDeactivateProduct
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Cloudinary _cloudinary;
        private readonly ProductService _productService;

        public ActivateDeactivateProduct()
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
        public async Task ActivateDeactivateProduct_WithValidId_ShouldUpdateStatus()
        {
            var product = new Product { ProductId = 1, Status = false };
            var productDto = new ProductDTO { ProductId = 1, Status = true };

            _mockProductRepository
                .Setup(r => r.GetByIdAsync(1))
                .ReturnsAsync(product);

            _mockProductRepository
                .Setup(r => r.UpdateAsync(product));

            _mockProductRepository
                .Setup(r => r.SaveAsync());

            _mockMapper
                .Setup(m => m.Map<ProductDTO>(product))
                .Returns(productDto);

            var result = await _productService.ActivateDeactivateProduct(1, true);

            Assert.True(result.Success);
            Assert.Equal(1, result.Data.ProductId);
            Assert.Equal("Cập nhật thành công", result.Message);
        }

        [Fact]
        public async Task ActivateDeactivateProduct_WhenWithInvalidId_ShouldReturnNotFound()
        {
            _mockProductRepository
                .Setup(r => r.GetByIdAsync(99))
                .ReturnsAsync((Product)null);

            var result = await _productService.ActivateDeactivateProduct(99, true);

            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không tìm thấy sản phẩm", result.Message);
        }



        [Fact]
        public async Task ActivateDeactivateProduct_WhenStatusNull_ShouldNotCallUpdate()
        {
            var product = new Product { ProductId = 5, Status = true };
            var productDto = new ProductDTO { ProductId = 5, Status = null };

            _mockProductRepository.Setup(r => r.GetByIdAsync(5)).ReturnsAsync(product);

            _mockMapper.Setup(m => m.Map<ProductDTO>(product)).Throws(new Exception("Trạng thái không được rỗng"));

            var result = await _productService.ActivateDeactivateProduct(5, true);

            _mockProductRepository.Verify(r => r.UpdateAsync(It.IsAny<Product>()), Times.Once);
            _mockProductRepository.Verify(r => r.SaveAsync(), Times.Once);

            Assert.False(result.Success);
            Assert.Equal("Trạng thái không được rỗng", result.Message);
        }


        // Bổ sung

        [Fact]
        public async Task ActivateDeactivateProduct_WithNegativeProductId_ShouldReturnNotFound()
        {
            // Arrange
            _mockProductRepository.Setup(r => r.GetByIdAsync(-1)).ReturnsAsync((Product)null);

            // Act
            var result = await _productService.ActivateDeactivateProduct(-1, true);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không tìm thấy sản phẩm", result.Message);
        }

        [Fact]
        public async Task ActivateDeactivateProduct_WhenRepositoryUpdateFails_ShouldReturnFailure()
        {
            // Arrange
            var product = new Product { ProductId = 1, Status = false };
            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
            _mockProductRepository.Setup(r => r.UpdateAsync(product)).ThrowsAsync(new Exception("Lỗi cập nhật cơ sở dữ liệu"));
            _mockMapper.Setup(m => m.Map<ProductDTO>(product)).Returns(new ProductDTO { ProductId = 1, Status = true });

            // Act
            var result = await _productService.ActivateDeactivateProduct(1, true);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Lỗi cập nhật cơ sở dữ liệu", result.Message);
        }





        


       

    }

}
