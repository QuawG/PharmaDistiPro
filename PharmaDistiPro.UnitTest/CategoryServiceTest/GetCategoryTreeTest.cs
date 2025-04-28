using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.DTO.Categorys;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.UnitTest.CategoryServiceTest
{
    public class GetCategoryTreeTest
    {
        private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<CloudinaryDotNet.Cloudinary> _cloudinaryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly CategoryService _categoryService;

        public GetCategoryTreeTest()
        {
            _categoryRepositoryMock = new Mock<ICategoryRepository>();
            _mapperMock = new Mock<IMapper>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            // Setup Cloudinary with a dummy configuration
            var dummyCloudinaryUrl = "cloudinary://1234567890:abcdefg@dummy-cloud";
            _cloudinaryMock = new Mock<CloudinaryDotNet.Cloudinary>(dummyCloudinaryUrl);

            // Setup HttpContext
            var httpContext = new DefaultHttpContext();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            _categoryService = new CategoryService(
                _categoryRepositoryMock.Object,
                _cloudinaryMock.Object,
                _mapperMock.Object,
                _httpContextAccessorMock.Object
            );
        }

        [Fact]
        public async Task GetCategoryTreeAsync_CategoriesExist_ReturnsTree()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "Parent", CategoryMainId = null },
                new Category { Id = 2, CategoryName = "Child", CategoryMainId = 1 }
            };
            var categoryDTOs = new List<CategoryDTO>
            {
                new CategoryDTO { Id = 1, CategoryName = "Parent", SubCategories = new List<CategoryDTO>() },
                new CategoryDTO { Id = 2, CategoryName = "Child", CategoryMainId = 1, SubCategories = new List<CategoryDTO>() }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Returns(categoryDTOs);

            // Act
            var result = await _categoryService.GetCategoryTreeAsync();

            // Assert
            Assert.True(result.Success);
            Assert.Single(result.Data);
            Assert.Equal("Parent", result.Data.First().CategoryName);
            Assert.Single(result.Data.First().SubCategories);
            Assert.Equal("Child", result.Data.First().SubCategories.First().CategoryName);
            Assert.Equal("Lấy danh sách danh mục thành công", result.Message);
        }

        [Fact]
        public async Task GetCategoryTreeAsync_NoCategories_ReturnsEmpty()
        {
            // Arrange
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Category>());

            // Act
            var result = await _categoryService.GetCategoryTreeAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có dữ liệu danh mục", result.Message);
        }

        [Fact]
        public async Task GetCategoryTreeAsync_SingleRootCategory_ReturnsSingleNode()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "Root", CategoryMainId = null }
            };
            var categoryDTOs = new List<CategoryDTO>
            {
                new CategoryDTO { Id = 1, CategoryName = "Root", SubCategories = new List<CategoryDTO>() }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Returns(categoryDTOs);

            // Act
            var result = await _categoryService.GetCategoryTreeAsync();

            // Assert
            Assert.True(result.Success);
            Assert.Single(result.Data);
            Assert.Empty(result.Data.First().SubCategories);
            Assert.Equal("Lấy danh sách danh mục thành công", result.Message);
        }

        [Fact]
        public async Task GetCategoryTreeAsync_RepositoryThrowsException_ReturnsError()
        {
            // Arrange
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _categoryService.GetCategoryTreeAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Lỗi: Database error", result.Message);
        }

        [Fact]
        public async Task GetCategoryTreeAsync_MappingFails_ReturnsError()
        {
            // Arrange
            var categories = new List<Category> { new Category { Id = 1, CategoryName = "Test" } };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Throws(new Exception("Mapping error"));

            // Act
            var result = await _categoryService.GetCategoryTreeAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Lỗi: Mapping error", result.Message);
        }

        [Fact]
        public async Task GetCategoryTreeAsync_MultipleRootCategories_ReturnsMultipleNodes()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "Root1", CategoryMainId = null },
                new Category { Id = 2, CategoryName = "Root2", CategoryMainId = null }
            };
            var categoryDTOs = new List<CategoryDTO>
            {
                new CategoryDTO { Id = 1, CategoryName = "Root1", SubCategories = new List<CategoryDTO>() },
                new CategoryDTO { Id = 2, CategoryName = "Root2", SubCategories = new List<CategoryDTO>() }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Returns(categoryDTOs);

            // Act
            var result = await _categoryService.GetCategoryTreeAsync();

            // Assert
            Assert.True(result.Success);
            Assert.Equal(2, result.Data.Count());
            Assert.Equal("Lấy danh sách danh mục thành công", result.Message);
        }
    }
}