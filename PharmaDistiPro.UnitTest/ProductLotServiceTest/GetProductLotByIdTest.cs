using Moq;
using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Threading.Tasks;
using Xunit;

namespace PharmaDistiPro.UnitTest.ProductLotServiceTest
{
    public class GetProductLotByIdTest
    {
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly ProductLotService _productLotService;

        public GetProductLotByIdTest()
        {
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _productLotService = new ProductLotService(_productLotRepositoryMock.Object);
        }

        [Fact]
        public async Task GetProductLotById_WhenProductLotExists_ReturnSuccess()
        {
            var productLot = new ProductLot
            {
                ProductLotId = 1,
                SupplyPrice = 10000,
                Quantity = 50,
                ManufacturedDate = new DateTime(2024, 1, 1),
                ExpiredDate = new DateTime(2026, 1, 1),
                ProductId = 1,
                LotId = 2,
                Status = 1,
                Product = new Product { ProductId = 1, ProductName = "Paracetamol" },
                Lot = new Lot { LotId = 2, LotCode = "LOT2024A" }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetProductLotById(1))
                                     .ReturnsAsync(productLot);

            var result = await _productLotService.GetProductLotById(1);

            Assert.Equal(200, result.StatusCode);
            Assert.NotNull(result.Data);
            Assert.Equal(1, result.Data.Id);
            Assert.Equal("Paracetamol", result.Data.ProductName);
            Assert.Equal("LOT2024A", result.Data.LotCode);
        }

        [Fact]
        public async Task GetProductLotById_WhenNotFound_Return404()
        {
            _productLotRepositoryMock.Setup(repo => repo.GetProductLotById(1))
                                     .ReturnsAsync((ProductLot)null);

            var result = await _productLotService.GetProductLotById(1);

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy lô hàng!", result.Message);
            Assert.Null(result.Data);
        }
    }
}
