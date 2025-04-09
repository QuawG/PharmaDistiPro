using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;

namespace PharmaDistiPro.UnitTest.ProductLotServiceTest
{
    public class CreateProductLotTest
    {
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly ProductLotService _productLotService;

        public CreateProductLotTest()
        {
            _productLotRepositoryMock = new Mock<IProductLotRepository>();
            _productLotService = new ProductLotService(_productLotRepositoryMock.Object);
        }

        [Fact]
        public async Task CreateProductLot_WhenProductLotListIsNull_ReturnBadRequest()
        {
            var result = await _productLotService.CreateProductLot(null);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Danh sách lô hàng không có giá trị!", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenProductLotListIsEmpty_ReturnBadRequest()
        {
            var result = await _productLotService.CreateProductLot(new List<ProductLotRequest>());
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Danh sách lô hàng không có giá trị!", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenLotIdIsNull_ReturnBadRequest()
        {
            var productLots = new List<ProductLotRequest>
            {
                new ProductLotRequest { ProductId = 1, LotId = 0 } // LotId = 0 sẽ giả định là không hợp lệ
            };

            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy lô có ID 0!", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenLotDoesNotExist_ReturnNotFound()
        {
            var productLots = new List<ProductLotRequest>
            {
                new ProductLotRequest { LotId = 1, ProductId = 1 }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync((Lot)null);

            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy lô có ID 1!", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenInsertFails_ReturnServerError()
        {
            var productLots = new List<ProductLotRequest>
            {
                new ProductLotRequest { LotId = 1, ProductId = 1 }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(new Lot { LotId = 1 });

            _productLotRepositoryMock.Setup(repo => repo.CreateProductLots(It.IsAny<List<ProductLot>>()))
                                     .ReturnsAsync(new List<ProductLot>());

            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Lỗi khi tạo lô hàng!", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenValidProductLots_ReturnSuccess()
        {
            var productLots = new List<ProductLotRequest>
            {
                new ProductLotRequest
                {
                    LotId = 1,
                    ProductId = 2,
                    ManufacturedDate = DateTime.Now,
                    ExpiredDate = DateTime.Now.AddYears(1),
                    SupplyPrice = 50000,
                    Status = 1
                }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(new Lot { LotId = 1, LotCode = "LOT001" });

            _productLotRepositoryMock.Setup(repo => repo.CreateProductLots(It.IsAny<List<ProductLot>>()))
                                     .ReturnsAsync(new List<ProductLot>
                                     {
                                         new ProductLot
                                         {
                                             ProductLotId = 10,
                                             LotId = 1,
                                             ProductId = 2,
                                             SupplyPrice = 50000,
                                             ManufacturedDate = DateTime.Now,
                                             ExpiredDate = DateTime.Now.AddYears(1),
                                             Status = 1,
                                             Product = new Product { ProductName = "Paracetamol" },
                                             Lot = new Lot { LotCode = "LOT001" }
                                         }
                                     });

            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(200, result.StatusCode);
            Assert.Single(result.Data);
            Assert.Equal("Paracetamol", result.Data[0].ProductName);
            Assert.Equal("LOT001", result.Data[0].LotCode);
        }

        [Fact]
        public async Task CreateProductLot_WhenManufacturedGreathThanDate_ReturnFalse()
        {
            var lot= new Lot
            {  LotId = 1   };

            var product = new Product
            {
                ProductId = 1,
                ProductName = "Paracetamol"
            };

            var productLots = new List<ProductLotRequest>
            {
                new ProductLotRequest { LotId = 1, ProductId = 1, ManufacturedDate = DateTime.Now.AddDays(10) }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(lot);
               
            _productLotRepositoryMock.Setup(repo => repo.CreateProductLots(It.IsAny<List<ProductLot>>())).
                ThrowsAsync(new Exception("Ngày sản xuất không thể lớn hơn hiện tại"));


            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Lỗi hệ thống: Ngày sản xuất không thể lớn hơn hiện tại", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenExpriedLesThanDate_ReturnFalse()
        {
            var lot = new Lot
            { LotId = 1 };

            var product = new Product
            {
                ProductId = 1,
                ProductName = "Paracetamol"
            };

            var productLots = new List<ProductLotRequest>
            {
                new ProductLotRequest { LotId = 1, ProductId = 1,  ExpiredDate = DateTime.Now.AddDays(-10) }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(lot);

            _productLotRepositoryMock.Setup(repo => repo.CreateProductLots(It.IsAny<List<ProductLot>>())).
                ThrowsAsync(new Exception("Ngày hết hạn không thể nhỏ hơn hiện tại"));


            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(500, result.StatusCode);
            Assert.Equal("Lỗi hệ thống: Ngày hết hạn không thể nhỏ hơn hiện tại", result.Message);
        }

    }
}
