using Microsoft.AspNetCore.Http;
using Moq;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.LotServiceTest
{
    public class GetLotListTest
    {
        private readonly Mock<ILotRepository> _lotRepositoryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly LotService _lotService;

        public GetLotListTest()
        {
            _lotRepositoryMock = new Mock<ILotRepository>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            var httpContext = new DefaultHttpContext();
            httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "test-user-id")
            }));

            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(httpContext);

            _lotService = new LotService(_lotRepositoryMock.Object, _httpContextAccessorMock.Object);
        }

        [Fact]
        public async Task GetLotList_WhenLotsExist_ReturnSuccess()
        {
            // Arrange
            var lotList = new List<Lot>
            {
                new Lot { LotCode = "LOT001", CreatedDate = DateTime.Now },
                new Lot { LotCode = "LOT002", CreatedDate = DateTime.Now }
            };

            _lotRepositoryMock.Setup(repo => repo.GetLotList())
                              .ReturnsAsync(lotList);

            // Act
            var result = await _lotService.GetLotList();

            // Assert
            Assert.Equal(200, result.StatusCode);
            Assert.Equal(2, result.Data.Count());
        }

        [Fact]
        public async Task GetLotList_WhenRepositoryReturnsNull_ReturnsServerError()
        {
            _lotRepositoryMock.Setup(repo => repo.GetLotList())
                              .ReturnsAsync((List<Lot>)null);

            var result = await _lotService.GetLotList();

            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Lỗi khi lấy dữ liệu lô!", result.Message);
        }


    }
}
