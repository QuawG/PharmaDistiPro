using Moq;
using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using Xunit;
using System.Threading.Tasks;
using AutoMapper;

namespace PharmaDistiPro.UnitTest.ProductLotServiceTest
{
    public class CheckQuantityProductTest
    {
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IStorageRoomRepository> _storageRoomRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILotRepository> _lotRepositoryMock;
        private readonly ProductLotService _productLotService;
        public CheckQuantityProductTest()
        {
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _storageRoomRepositoryMock = new Mock<IStorageRoomRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _lotRepositoryMock = new Mock<ILotRepository>();
            _productLotService = new ProductLotService(
                _productLotRepositoryMock.Object,
                _storageRoomRepositoryMock.Object,
                _productRepositoryMock.Object,
                _mapperMock.Object,
                _lotRepositoryMock.Object);
        }

        [Fact]
        public async Task CheckQuantityProduct_WhenProductLotExists_ReturnSuccess()
        {
            var productLot = new ProductLot
            {
                ProductId = 1,
                Quantity = 100
            };

            _productLotRepositoryMock.Setup(repo => repo.CheckQuantityProduct(1))
                                     .ReturnsAsync(productLot);

            var result = await _productLotService.CheckQuantityProduct(1);

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Thành công", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(1, result.Data.ProductId);
            Assert.Equal(100, result.Data.Quantity);
        }

        [Fact]
        public async Task CheckQuantityProduct_WhenProductLotNotFound_ReturnMessage()
        {
            _productLotRepositoryMock.Setup(repo => repo.CheckQuantityProduct(1))
                                     .ReturnsAsync((ProductLot)null);

            var result = await _productLotService.CheckQuantityProduct(1);

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Không tìm thấy sản phẩm trong kho", result.Message);
            Assert.Null(result.Data);
        }

        [Fact]
        public async Task CheckQuantityProduct_WhenExceptionThrown_ReturnError()
        {
            _productLotRepositoryMock.Setup(repo => repo.CheckQuantityProduct(1))
                                     .ThrowsAsync(new System.Exception("Lỗi truy vấn dữ liệu"));

            var result = await _productLotService.CheckQuantityProduct(1);

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Lỗi truy vấn dữ liệu", result.Message);
        }

        [Fact]
        public async Task CheckQuantityProduct_WhenIdNull_ReturnError()
        {
            _productLotRepositoryMock.Setup(repo => repo.CheckQuantityProduct(1))
                         .ReturnsAsync((ProductLot)null);

            var result = await _productLotService.CheckQuantityProduct(0);

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Không tìm thấy sản phẩm trong kho", result.Message);
        }
    }
}
