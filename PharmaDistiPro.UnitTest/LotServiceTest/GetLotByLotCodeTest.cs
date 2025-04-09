using Xunit;
using Moq;
using PharmaDistiPro.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;
using System.Threading.Tasks;
using System.Security.Claims;

namespace PharmaDistiPro.UnitTest.LotServiceTest
{
    public class GetLotByLotCodeTest
    {
        private readonly Mock<ILotRepository> _lotRepositoryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly LotService _lotService;

        public GetLotByLotCodeTest()
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
        public async Task GetLotByLotCode_WhenLotExists_ReturnsSuccess()
        {
            var lotCode = "LOT001";
            var lot = new Lot { LotCode = lotCode };

            _lotRepositoryMock.Setup(repo => repo.GetLotByLotCode(lotCode))
                              .ReturnsAsync(lot);

            var result = await _lotService.GetLotByLotCode(lotCode);

            Assert.Equal(200, result.StatusCode);
            Assert.Equal(lotCode, result.Data.LotCode);
        }

        [Fact]
        public async Task GetLotByLotCode_WhenLotNotFound_ReturnsNotFound()
        {
            var lotCode = "LOT999";

            _lotRepositoryMock.Setup(repo => repo.GetLotByLotCode(lotCode))
                              .ReturnsAsync((Lot)null);

            var result = await _lotService.GetLotByLotCode(lotCode);

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy lô", result.Message);
        }

        [Fact]
        public async Task GetLotByLotCode_WhenLoteCodeNull_ReturnNotFound()
        {
            string lotCode = null;

            _lotRepositoryMock.Setup(repo => repo.GetLotByLotCode(lotCode))
                              .ReturnsAsync((Lot)null);

            var result = await _lotService.GetLotByLotCode(lotCode);

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy lô", result.Message);
        }

    }
}
