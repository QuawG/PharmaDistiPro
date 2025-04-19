using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.ProductServiceTest
{
    public class UpdateProductTest
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Mock<Cloudinary> _mockCloudinary;
        private readonly ProductService _productService;

        public UpdateProductTest()
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
        public async Task UpdateProduct_WhenValidInput_ShouldSucceed()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "Updated Product",
                Images = new List<IFormFile>() ,
                SellingPrice = 100,
                Vat = 5,
                Weight = 20,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Cool,
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>()));
            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.True(response.Success);
            Assert.Equal("Cập nhật thành công.", response.Message);
            Assert.Equal("Updated Product", response.Data.ProductName);
        }

        [Fact]
        public async Task UpdateProduct_WhenProductNotFound_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest { ProductId = 99 };

            _mockProductRepository.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Product)null);

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Không tìm thấy sản phẩm.", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenTooManyImages_ReturnFail()
        {
            // Arrange
            var images = Enumerable.Range(1, 3).Select(i => Mock.Of<IFormFile>()).ToList();

            var request = new ProductInputRequest
            {
                ProductId = 1,
                Images = images
            };

            var product = new Product
            {
                ProductId = 1,
                ImageProducts = new List<ImageProduct>
                {
                    new ImageProduct(),
                    new ImageProduct(),
                    new ImageProduct()
                }
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Mỗi sản phẩm chỉ được tối đa 5 ảnh.", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenImageUploadFails_ReturnsFailure()
        {
            // Arrange
            var formFileMock = new Mock<IFormFile>();
            formFileMock.Setup(f => f.FileName).Returns("image.jpg");
            formFileMock.Setup(f => f.OpenReadStream()).Throws(new Exception("Lỗi khi tải ảnh lên"));

            var request = new ProductInputRequest
            {
                ProductId = 1,
                Images = new List<IFormFile> { formFileMock.Object }
            };

            var product = new Product
            {
                ProductId = 1,
                ImageProducts = new List<ImageProduct>()
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Contains("Lỗi khi tải ảnh lên", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenPriceInputNull_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "Updated Product",
                Images = new List<IFormFile>(),
                SellingPrice = null,
                Vat = 5,
                Weight = 20,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Cool,
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("Giá cập nhật không được rỗng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: Giá cập nhật không được rỗng", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenPriceInputLessThanZero_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "Updated Product",
                Images = new List<IFormFile>(),
                SellingPrice = -1,
                Vat = 5,
                Weight = 20,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Cool,
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("Giá cập nhật sai định dạng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: Giá cập nhật sai định dạng", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenPriceVatNull_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "Updated Product",
                Images = new List<IFormFile>(),
                SellingPrice = 1,
                Vat = null,
                Weight = 20,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Cool,
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("VAT cập nhật không được rỗng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: VAT cập nhật không được rỗng", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenVATLessThanZero_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "Updated Product",
                Images = new List<IFormFile>(),
                SellingPrice = 1,
                Vat = -5,
                Weight = 20,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Normal
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("VAT cập nhật sai định dạng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: VAT cập nhật sai định dạng", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenProductNameNull_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = null,
                Images = new List<IFormFile>(),
                SellingPrice = 1,
                Vat = null,
                Weight = 20,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Normal
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("Tên sản phẩm cập nhật không được rỗng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: Tên sản phẩm cập nhật không được rỗng", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenWeightNull_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "New product",
                Images = new List<IFormFile>(),
                SellingPrice = 1,
                Vat = 1,
                Weight = null,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Normal
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 2
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("Cân nặng cập nhật không được rỗng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: Cân nặng cập nhật không được rỗng", response.Message);
        }

        [Fact]
        public async Task UpdateProduct_WhenWeightLessThanZero_ReturnFail()
        {
            // Arrange
            var request = new ProductInputRequest
            {
                ProductId = 1,
                ProductName = "New product",
                Images = new List<IFormFile>(),
                SellingPrice = 1,
                Vat = 1,
                Weight = -1,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 1,
                Status = true,
                Storageconditions = StorageCondition.Normal
            };

            var existingProduct = new Product
            {
                ProductId = 1,
                ProductName = "Old Product",
                ImageProducts = new List<ImageProduct>(),
                SellingPrice = 200,
                Vat = 10,
                Weight = 10,
                Description = "Description",
                ProductCode = "ProductCode",
                CategoryId = 2,
                Status = true,
                Storageconditions = 1
            };

            _mockProductRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingProduct);
            _mockProductRepository.Setup(r => r.UpdateAsync(It.IsAny<Product>())).ThrowsAsync(
                new Exception("Cân nặng cập nhật sai định dạng"));

            _mockProductRepository.Setup(r => r.SaveAsync());

            _mockMapper.Setup(m => m.Map(request, existingProduct));
            _mockMapper.Setup(m => m.Map<ProductDTO>(existingProduct)).Returns(new ProductDTO { ProductName = request.ProductName });

            // Act
            var response = await _productService.UpdateProduct(request);

            // Assert
            Assert.False(response.Success);
            Assert.Equal("Đã xảy ra lỗi trong quá trình cập nhật sản phẩm: Cân nặng cập nhật sai định dạng", response.Message);
        }

    }
}
