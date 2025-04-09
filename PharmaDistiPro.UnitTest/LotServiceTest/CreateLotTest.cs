using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Models;
using PharmaDistiPro.DTO.Lots;
using System.Security.Claims;

namespace PharmaDistiPro.UnitTest.LotServiceTest
{
    public class CreateLotTest
    {
        private readonly Mock<ILotRepository> _lotRepositoryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly LotService _lotService;

        public CreateLotTest()
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
        public async Task CreateLot_WhenLotIsCreated_ReturnSuccess()
        {
            var lotRequest = new LotRequest();

            var lastLot = new Lot { LotCode = "LOT005" };

            _lotRepositoryMock.Setup(repo => repo.GetLastLot())
                              .ReturnsAsync(lastLot);

            _lotRepositoryMock.Setup(repo => repo.CreateLot(It.IsAny<Lot>()))
                              .ReturnsAsync((Lot l) => l);

            var result = await _lotService.CreateLot(lotRequest);

            Assert.Equal(200, result.StatusCode);
            Assert.StartsWith("LOT", result.Data.LotCode);
            Assert.True(result.Data.CreatedDate <= DateTime.Now);
        }

        [Fact]
        public async Task CreateLot_WhenLotIsNull_ReturnFalse()
        {
            var result = await _lotService.CreateLot(null);

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Dữ liệu không hợp lệ!", result.Message);
        }

        [Fact]
        public async Task CreateLot_WhenLastLotIsLOT009_ReturnsLotCodeLOT010()
        {
            var lotRequest = new LotRequest();
            var lastLot = new Lot { LotCode = "LOT009" };

            _lotRepositoryMock.Setup(repo => repo.GetLastLot())
                              .ReturnsAsync(lastLot);

            _lotRepositoryMock.Setup(repo => repo.CreateLot(It.IsAny<Lot>()))
                              .ReturnsAsync((Lot l) => l);

            var result = await _lotService.CreateLot(lotRequest);

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("LOT010", result.Data.LotCode);
        }

        [Fact]
        public async Task CreateLot_WhenDatabaseError_ReturnFalse()
        {
            var lotRequest = new LotRequest();
            _lotRepositoryMock.Setup(repo => repo.GetLastLot()).ThrowsAsync(new Exception("Unexpected error"));

            var result = await _lotService.CreateLot(lotRequest);

            Assert.Equal(500, result.StatusCode);
            Assert.Contains("Lỗi khi tạo lô!", result.Message);
        }
    }
}
