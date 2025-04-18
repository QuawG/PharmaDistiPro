using Xunit;
using Moq;
using AutoMapper;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.DTO.Products;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System;
using System.Linq.Expressions;
using CloudinaryDotNet.Actions;
using PharmaDistiPro.Helper.Enums;

namespace PharmaDistiPro.UnitTest.ProductServiceTest
{
    public class CreateNewProductTest
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Mock<Cloudinary> _mockCloudinary;
        private readonly ProductService _productService;

        public CreateNewProductTest()
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
        public async Task CreateNewProduct_CategoryIdNull_ShouldFail()
        {
            var request = new ProductInputRequest { CategoryId = null };

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("CategoryId là bắt buộc.", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_CategoryNotExist_ShouldFail()
        {
            var request = new ProductInputRequest { CategoryId = 1 };

            _mockCategoryRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync((Category)null);

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Danh mục không tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_CategoryIsMain_ShouldFail()
        {
            var request = new ProductInputRequest { CategoryId = 1 };
            var mainCategory = new Category { Id = 1, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(mainCategory);

            _mockCategoryRepository.Setup(repo => repo.GetSingleByConditionAsync(
    It.IsAny<Expression<Func<Category, bool>>>(), null)).ReturnsAsync((Category)null);

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Chỉ được chọn danh mục con.", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_ProductCodeNotGenerate()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1,
                ProductCode = null
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync( new Exception("ProductCode không được generate"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: ProductCode không được generate", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_StatusNull_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1,
                Status = null
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r =>
            r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Trạng thái rỗng"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Trạng thái rỗng", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_SellingPriceNull_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1,
                SellingPrice = null
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r => 
            r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Gía bán đang rỗng"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Gía bán đang rỗng", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_SellingPriceLessThan0_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1,
                SellingPrice = -1
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r =>
            r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Gía bán đang không hợp lệ"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Gía bán đang không hợp lệ", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_VatNull_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1,
                Vat = null
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r =>
            r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Vat đang rỗng"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Vat đang rỗng", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_VatLessThan0_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1,
                Vat = -1
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r =>
            r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Vat đang không hợp lệ"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Vat đang không hợp lệ", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_ProductNameNull_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = null,
                CategoryId = 1
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Tên sản phẩm trống"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Tên sản phẩm trống", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_ManufactureNameNull_ReturnFalse()
        {
            var request = new ProductInputRequest
            {
                ProductName = "Thuốc ho",
                CategoryId = 1,
                ManufactureName = null
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);

            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>())).ReturnsAsync(subCategory);


            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());

            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>())).ThrowsAsync(new Exception("Tên nhà sản xuất trống"));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Tên nhà sản xuất trống", result.Message);
        }


        [Fact]
        public async Task CreateNewProduct_ImagesMoreThan5_ShouldFail()
        {
            var mockImages = new List<IFormFile>();
            for (int i = 0; i < 6; i++)
            {
                var fileMock = new Mock<IFormFile>();
                fileMock.Setup(f => f.FileName).Returns($"image{i}.jpg");
                fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[1]));
                mockImages.Add(fileMock.Object);
            }

            var request = new ProductInputRequest
            {
                ProductName = "Test Product",
                CategoryId = 1,
                Images = mockImages
            };

            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);
            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>()))
                .ReturnsAsync(subCategory);

            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Throws(new Exception("Mỗi sản phẩm chỉ được tối đa 5 ảnh."));

            var result = await _productService.CreateNewProduct(request);

            Assert.False(result.Success);
            Assert.Equal("Lỗi: Mỗi sản phẩm chỉ được tối đa 5 ảnh.", result.Message);
        }

        [Fact]
        public async Task CreateNewProduct_ValidImages_ShouldSucceed()
        {
            var mockImages = new List<IFormFile>();

            for (int i = 0; i < 3; i++)
            {
                var fileMock = new Mock<IFormFile>();
                fileMock.Setup(f => f.FileName).Returns($"image{i}.jpg");
                fileMock.Setup(f => f.OpenReadStream()).Returns(new MemoryStream(new byte[1]));
                mockImages.Add(fileMock.Object);
            }
            var request = new ProductInputRequest
            {
                ProductName = "Valid Product",
                CategoryId = 1,
                Vat = 10,
                Status = true,
                Storageconditions = StorageCondition.Normal,
                SellingPrice = 10
            };
          
            var category = new Category { Id = 1, CategoryMainId = 1, CategoryCode = "TH" };
            var subCategory = new Category { Id = 2, CategoryMainId = 1 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(category);
            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), It.IsAny<string[]>()))
                .ReturnsAsync(subCategory);

            _mockMapper.Setup(m => m.Map<Product>(It.IsAny<ProductInputRequest>()))
                .Returns(new Product { ImageProducts = new List<ImageProduct>() });

            _mockMapper.Setup(m => m.Map<ProductDTO>(It.IsAny<Product>()))
                .Returns(new ProductDTO());


            _mockProductRepository.Setup(r => r.InsertAsync(It.IsAny<Product>()));
            _mockProductRepository.Setup(r => r.SaveAsync());

            var result = await _productService.CreateNewProduct(request);

            Assert.True(result.Success);
            Assert.Equal("Tạo mới sản phẩm thành công", result.Message);
        }
    }
}
