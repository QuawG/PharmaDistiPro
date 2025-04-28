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
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.CategoryServiceTest
{
    public class GetAllSubCategoriesTest
    {
        private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<CloudinaryDotNet.Cloudinary> _cloudinaryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly CategoryService _categoryService;

        public GetAllSubCategoriesTest()
        {
            _categoryRepositoryMock = new Mock<ICategoryRepository>();
            _mapperMock = new Mock<IMapper>();
            var dummyCloudinaryUrl = "cloudinary://1234567890:abcdefg@dummy-cloud";
            _cloudinaryMock = new Mock<CloudinaryDotNet.Cloudinary>(dummyCloudinaryUrl);
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

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
        public async Task GetAllSubCategoriesAsync_SubCategoriesExist_ReturnsList()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "Parent", CategoryMainId = null },
                new Category { Id = 2, CategoryName = "Child", CategoryMainId = 1 }
            };
            var subCategoryDTOs = new List<CategoryDTO>
            {
                new CategoryDTO { Id = 2, CategoryName = "Child", CategoryMainId = 1 }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Returns(subCategoryDTOs);

            // Act
            var result = await _categoryService.GetAllSubCategoriesAsync();

            // Assert
            Assert.True(result.Success);
            Assert.Single(result.Data);
            Assert.Equal("Child", result.Data.First().CategoryName);
            Assert.Equal("Lấy danh sách tất cả danh mục con thành công.", result.Message);
        }

        [Fact]
        public async Task GetAllSubCategoriesAsync_NoSubCategories_ReturnsEmpty()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "Parent", CategoryMainId = null }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Returns(new List<CategoryDTO>());

            // Act
            var result = await _categoryService.GetAllSubCategoriesAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có danh mục con nào.", result.Message);
        }

        [Fact]
        public async Task GetAllSubCategoriesAsync_NoCategories_ReturnsEmpty()
        {
            // Arrange
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Category>());

            // Act
            var result = await _categoryService.GetAllSubCategoriesAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Không có dữ liệu danh mục.", result.Message);
        }

        [Fact]
        public async Task GetAllSubCategoriesAsync_RepositoryThrowsException_ReturnsError()
        {
            // Arrange
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _categoryService.GetAllSubCategoriesAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Lỗi: Database error", result.Message);
        }

        [Fact]
        public async Task GetAllSubCategoriesAsync_MultipleSubCategories_ReturnsList()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, CategoryName = "Parent", CategoryMainId = null },
                new Category { Id = 2, CategoryName = "Child1", CategoryMainId = 1 },
                new Category { Id = 3, CategoryName = "Child2", CategoryMainId = 1 }
            };
            var subCategoryDTOs = new List<CategoryDTO>
            {
                new CategoryDTO { Id = 2, CategoryName = "Child1", CategoryMainId = 1 },
                new CategoryDTO { Id = 3, CategoryName = "Child2", CategoryMainId = 1 }
            };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Returns(subCategoryDTOs);

            // Act
            var result = await _categoryService.GetAllSubCategoriesAsync();

            // Assert
            Assert.True(result.Success);
            Assert.Equal(2, result.Data.Count());
            Assert.Equal("Lấy danh sách tất cả danh mục con thành công.", result.Message);
        }

        [Fact]
        public async Task GetAllSubCategoriesAsync_MappingFails_ReturnsError()
        {
            // Arrange
            var categories = new List<Category> { new Category { Id = 1, CategoryName = "Child", CategoryMainId = 2 } };
            _categoryRepositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(categories);
            _mapperMock.Setup(m => m.Map<IEnumerable<CategoryDTO>>(It.IsAny<IEnumerable<Category>>())).Throws(new Exception("Mapping error"));

            // Act
            var result = await _categoryService.GetAllSubCategoriesAsync();

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Equal("Lỗi: Mapping error", result.Message);
        }
    }
}

