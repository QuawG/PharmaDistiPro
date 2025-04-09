using Moq;
using Xunit;
using System.Threading.Tasks;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.DTO.ProductLots;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace PharmaDistiPro.UnitTest.ProductLotServiceTest
{
    public class GetProductLotListTest
    {
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly ProductLotService _productLotService;

        public GetProductLotListTest()
        {
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _productLotService = new ProductLotService(_productLotRepositoryMock.Object);
        }

        [Fact]
        public async Task GetProductLotList_WhenDataExists_ReturnsSuccess()
        {
            var productLots = new List<ProductLot>
            {
                new ProductLot
                {
                    ProductLotId = 1,
                    SupplyPrice = 1000,
                    Quantity = 10,
                    ManufacturedDate = DateTime.Now.AddMonths(-1),
                    ExpiredDate = DateTime.Now.AddMonths(11),
                    ProductId = 1,
                    LotId = 1,
                    Status = 1,
                    Product = new Product { ProductId = 1, ProductName = "Panadol" },
                    Lot = new Lot { LotId = 1, LotCode = "LOT001" }
                }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetProductLotList())
                                     .ReturnsAsync(productLots);

            var result = await _productLotService.GetProductLotList();

            Assert.Equal(200, result.StatusCode);
            Assert.Single(result.Data);
            Assert.Equal("Panadol", result.Data.First().ProductName);
        }

        [Fact]
        public async Task GetProductLotList_WhenListIsEmpty_ReturnsNotFound()
        {
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotList())
                                     .ReturnsAsync(new List<ProductLot>());

            var result = await _productLotService.GetProductLotList();

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không có lô hàng nào!", result.Message);
        }

    }
}
