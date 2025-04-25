using AutoMapper;
using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.CategoryServiceTest
{
    public class FilterCategoriesTest
    {
        private readonly Mock<ICategoryRepository> _categoryRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<CloudinaryDotNet.Cloudinary> _cloudinaryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly CategoryService _categoryService;

        public FilterCategoriesTest()
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
    }
}
