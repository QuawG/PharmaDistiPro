using System;
using System.IO;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using Xunit;

namespace PharmaDistiPro.UnitTest.CategoryServiceTest
{
    public class CreateCategoryServiceTest
    {
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Cloudinary _cloudinary;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly CategoryService _categoryService;

        public CreateCategoryServiceTest()
        {
            _mockCategoryRepository = new Mock<ICategoryRepository>();
            _mockMapper = new Mock<IMapper>();

            // Initialize Cloudinary directly
            var account = new Account("test", "test", "test");
            _cloudinary = new Cloudinary(account);

            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();

            _categoryService = new CategoryService(
                _mockCategoryRepository.Object,
                _cloudinary,
                _mockMapper.Object,
                _mockHttpContextAccessor.Object
            );
        }

        private IFormFile CreateFakeFormFile(string fileName = "https://res.cloudinary.com/dznwqg14m/image/upload/v1740304370/logo_fb.png")
        {
            var content = "Fake image content";
            var stream = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(content));
            var fileMock = new Mock<IFormFile>();
            fileMock.Setup(f => f.FileName).Returns(fileName);
            fileMock.Setup(f => f.OpenReadStream()).Returns(stream);
            fileMock.Setup(f => f.Length).Returns(stream.Length);
            return fileMock.Object;
        }

       [Fact]
public async Task CreateCategoryAsync_NoParentNoImage_ShouldSucceed()
{
    var request = new CategoryInputRequest { CategoryName = "Test Category" };
    var category = new Category { Id = 1, CategoryName = "Test Category", CategoryCode = "TES", CreatedDate = DateTime.Now };
    var categoryDto = new CategoryDTO { Id = 1, CategoryName = "Test Category", CategoryCode = "TES" };

    _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), null)).ReturnsAsync((Category)null);
    _mockMapper.Setup(m => m.Map<Category>(request)).Returns(category);
    _mockMapper.Setup(m => m.Map<CategoryDTO>(category)).Returns(categoryDto);
    _mockCategoryRepository.Setup(r => r.InsertAsync(It.IsAny<Category>())).ReturnsAsync(category);
    _mockCategoryRepository.Setup(r => r.SaveAsync()).ReturnsAsync(1);

    var result = await _categoryService.CreateCategoryAsync(request);

    Assert.True(result.Success);
    Assert.Equal("Tạo danh mục thành công", result.Message);
    Assert.Equal(1, result.Data.Id);
    // Removed Verify line as it's not necessary when using the real Cloudinary instance.
}
        //[Fact]
        //public async Task CreateCategoryAsync_WithParentAndImage_ShouldSucceed()
        //{
        //    var request = new CategoryInputRequest { CategoryName = "Sub Category", CategoryMainId = 1 };
        //    request.Image = CreateFakeFormFile(); // This creates a fake image file for testing.

        //    var parentCategory = new Category { Id = 1, CategoryCode = "PAR" };
        //    var category = new Category { Id = 2, CategoryName = "Sub Category", CategoryCode = "PAR_SUB", CategoryMainId = 1 };
        //    var categoryDto = new CategoryDTO { Id = 2, CategoryName = "Sub Category", CategoryCode = "PAR_SUB" };

        //    _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), null)).ReturnsAsync((Category)null);
        //    _mockCategoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(parentCategory);

        //    // Try uploading the image to Cloudinary directly
        //    try
        //    {
        //        var uploadParams = new ImageUploadParams
        //        {
        //            File = new FileDescription("https://res.cloudinary.com/dznwqg14m/image/upload/v1740304370/logo_fb.png", request.Image.OpenReadStream())
        //        };

        //        // Perform the upload with real Cloudinary (ensure Cloudinary is working properly)
        //        var uploadResult = _cloudinary.Upload(uploadParams);

        //        // If the upload is successful, continue with the rest of the logic
        //        _mockMapper.Setup(m => m.Map<Category>(request)).Returns(category);
        //        _mockMapper.Setup(m => m.Map<CategoryDTO>(category)).Returns(categoryDto);
        //        _mockCategoryRepository.Setup(r => r.InsertAsync(It.IsAny<Category>())).ReturnsAsync(category);
        //        _mockCategoryRepository.Setup(r => r.SaveAsync()).ReturnsAsync(1);

        //        var result = await _categoryService.CreateCategoryAsync(request);

        //        Assert.True(result.Success);
        //        Assert.Equal("Tạo danh mục thành công", result.Message);
        //        Assert.Equal("PAR_SUB", result.Data.CategoryCode);
        //    }
        //    catch (Exception ex)
        //    {
        //        // If the upload fails, assert that the correct error message is thrown
        //        Assert.Contains("Lỗi tải ảnh lên Cloudinary", ex.Message);
        //    }
        //}


        [Fact]
        public async Task CreateCategoryAsync_DuplicateName_ShouldFail()
        {
            var request = new CategoryInputRequest { CategoryName = "Test Category" };
            var existingCategory = new Category { Id = 1, CategoryName = "Test Category" };

            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), null)).ReturnsAsync(existingCategory);

            var result = await _categoryService.CreateCategoryAsync(request);

            Assert.False(result.Success);
            Assert.Equal("Tên danh mục đã tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateCategoryAsync_InvalidParentId_ShouldFail()
        {
            var request = new CategoryInputRequest { CategoryName = "Sub Category", CategoryMainId = 99 };

            _mockCategoryRepository.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Category)null);

            var result = await _categoryService.CreateCategoryAsync(request);

            Assert.False(result.Success);
            Assert.Equal("Danh mục cha không tồn tại.", result.Message);
        }

        [Fact]
        public async Task CreateCategoryAsync_DuplicateCode_ShouldFail()
        {
            var request = new CategoryInputRequest { CategoryName = "Test Category" };
            var category = new Category { Id = 1, CategoryName = "Test Category", CategoryCode = "TC" };

            _mockCategoryRepository.SetupSequence(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), null))
                .ReturnsAsync((Category)null)
                .ReturnsAsync(category);
            _mockMapper.Setup(m => m.Map<Category>(request)).Returns(category);

            var result = await _categoryService.CreateCategoryAsync(request);

            Assert.False(result.Success);
            Assert.Equal("Mã danh mục 'TC' đã tồn tại.", result.Message);
        }



        [Fact]
        public async Task CreateCategoryAsync_SystemException_ShouldFail()
        {
            var request = new CategoryInputRequest { CategoryName = "Test Category" };

            _mockCategoryRepository.Setup(r => r.GetSingleByConditionAsync(It.IsAny<Expression<Func<Category, bool>>>(), null))
                .ThrowsAsync(new Exception("Lỗi hệ thống"));

            var result = await _categoryService.CreateCategoryAsync(request);

            Assert.False(result.Success);
            Assert.Contains("Lỗi: Lỗi hệ thống", result.Message);
        }
    }
}
