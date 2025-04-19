using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PharmaDistiPro.DTO.ProductLots;
using PharmaDistiPro.Models;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;
using AutoMapper;

namespace PharmaDistiPro.UnitTest.ProductLotServiceTest
{
    public class CreateProductLotTest
    {
        private readonly Mock<IProductLotRepository> _productLotRepositoryMock;
        private readonly Mock<IStorageRoomRepository> _storageRoomRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ILotRepository> _lotRepositoryMock;
        private readonly ProductLotService _productLotService;
        public CreateProductLotTest()
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
        public async Task CreateProductLot_WhenProductLotListIsNull_ReturnBadRequest()
        {
            var result = await _productLotService.CreateProductLot(null);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Danh sách lô hàng không có giá trị!", result.Message);
        }

        [Fact]
        public async Task CreateProductLot_WhenStorageIsEmpty_ReturnBadRequest()
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
                new ProductLotRequest { LotId = 1, ProductId = 1, ManufacturedDate = DateTime.Now.AddDays(10) }
            };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(lot);
            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
 .ReturnsAsync(new Product
 {
     ProductId = 1,
     ProductName = "Paracetamol",
     VolumePerUnit = 1
 });
            _productLotRepositoryMock.Setup(repo => repo.CreateProductLot(It.IsAny<ProductLot>()))
                                     .ReturnsAsync(new ProductLot
                                     {
                                         ProductLotId = 10,
                                         LotId = 1,
                                         ProductId = 2,
                                         SupplyPrice = 50000,
                                         ManufacturedDate = DateTime.Now,
                                         ExpiredDate = DateTime.Now.AddYears(1),
                                         Status = 1,
                                         Quantity = 0,
                                         StorageRoomId = 1
                                     });


            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("StorageRoomId không có giá trị cho lô 1!", result.Message);
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
        new ProductLotRequest
        {
            LotId = 1,
            ProductId = 2,
            ManufacturedDate = DateTime.Now,
            ExpiredDate = DateTime.Now.AddYears(1),
            SupplyPrice = 50000,
            Status = 1,
            OrderQuantity = 100, // Add OrderQuantity for validation in the service method
            StorageRoomId = 1 // Add StorageRoomId for validation in the service method
        }
    };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(new Lot { LotId = 1, LotCode = "LOT001" });

            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(2))  // Mocking Product retrieval
                                     .ReturnsAsync(new Product
                                     {
                                         ProductId = 2,
                                         ProductName = "Paracetamol",  // Added ProductName
                                         VolumePerUnit = 10 // Ensure this field is set for validation
                                     });

            _productLotRepositoryMock.Setup(repo => repo.CreateProductLot(It.IsAny<ProductLot>()))
                         .ReturnsAsync((ProductLot)null);



            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(500, result.StatusCode);
            Assert.True(result.Message.Contains("Lỗi hệ thống"));
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
            Status = 1,
            OrderQuantity = 100, // Add OrderQuantity for validation in the service method
            StorageRoomId = 1 // Add StorageRoomId for validation in the service method
        }
    };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(new Lot { LotId = 1, LotCode = "LOT001" });

            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(2))  // Mocking Product retrieval
                                     .ReturnsAsync(new Product
                                     {
                                         ProductId = 2,
                                         ProductName = "Paracetamol",  // Added ProductName
                                         VolumePerUnit = 10 // Ensure this field is set for validation
                                     });

            _productLotRepositoryMock.Setup(repo => repo.CreateProductLot(It.IsAny<ProductLot>()))
                                     .ReturnsAsync(new ProductLot
                                     {
                                         ProductLotId = 10,
                                         LotId = 1,
                                         ProductId = 2,
                                         SupplyPrice = 50000,
                                         ManufacturedDate = DateTime.Now,
                                         ExpiredDate = DateTime.Now.AddYears(1),
                                         Status = 1,
                                         Quantity = 0,
                                         StorageRoomId = 1
                                     });

            _storageRoomRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                                      .ReturnsAsync(new StorageRoom
                                      {
                                          StorageRoomId = 1,
                                          RemainingRoomVolume = 1000 // Ensure the room has sufficient volume
                                      });

            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(200, result.StatusCode);
            Assert.Single(result.Data);
            Assert.Equal("Paracetamol", result.Data[0].ProductName);  // Ensure ProductName is validated
            Assert.Equal("LOT001", result.Data[0].LotCode);
        }


        [Fact]
        public async Task CreateProductLot_WhenManufacturedGreathThanDate_ReturnFalse()
        {
              var productLots = new List<ProductLotRequest>
    {
        new ProductLotRequest
        {
            LotId = 1,
            ProductId = 2,
            ManufacturedDate = DateTime.Now.AddYears(1),
            ExpiredDate = DateTime.Now.AddYears(1),
            SupplyPrice = 50000,
            Status = 1,
            OrderQuantity = 100, // Add OrderQuantity for validation in the service method
            StorageRoomId = 1 // Add StorageRoomId for validation in the service method
        }
    };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(new Lot { LotId = 1, LotCode = "LOT001" });

            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(2))  // Mocking Product retrieval
                                     .ReturnsAsync(new Product
                                     {
                                         ProductId = 2,
                                         ProductName = "Paracetamol",  // Added ProductName
                                         VolumePerUnit = 10 // Ensure this field is set for validation
                                     });
            _storageRoomRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                          .ReturnsAsync(new StorageRoom
                          {
                              StorageRoomId = 1,
                              RemainingRoomVolume = 1000 // Ensure the room has sufficient volume
                          });
            _productLotRepositoryMock.Setup(repo => repo.CreateProductLots(It.IsAny<List<ProductLot>>())).
                ThrowsAsync(new Exception("Ngày sản xuất không thể lớn hơn hiện tại"));


            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(500, result.StatusCode);
            Assert.True(result.Message.Contains("Lỗi hệ thống"));
        }

        [Fact]
        public async Task CreateProductLot_WhenExpriedLesThanDate_ReturnFalse()
        {
            var productLots = new List<ProductLotRequest>
    {
        new ProductLotRequest
        {
            LotId = 1,
            ProductId = 2,
            ManufacturedDate = DateTime.Now,
            ExpiredDate = DateTime.Now.AddYears(-1),
            SupplyPrice = 50000,
            Status = 1,
            OrderQuantity = 100, // Add OrderQuantity for validation in the service method
            StorageRoomId = 1 // Add StorageRoomId for validation in the service method
        }
    };

            _productLotRepositoryMock.Setup(repo => repo.GetLotById(1))
                                     .ReturnsAsync(new Lot { LotId = 1, LotCode = "LOT001" });

            _productRepositoryMock.Setup(repo => repo.GetByIdAsync(2))  // Mocking Product retrieval
                                     .ReturnsAsync(new Product
                                     {
                                         ProductId = 2,
                                         ProductName = "Paracetamol",  // Added ProductName
                                         VolumePerUnit = 10 // Ensure this field is set for validation
                                     });
            _storageRoomRepositoryMock.Setup(repo => repo.GetByIdAsync(1))
                          .ReturnsAsync(new StorageRoom
                          {
                              StorageRoomId = 1,
                              RemainingRoomVolume = 1000 // Ensure the room has sufficient volume
                          });

            _productLotRepositoryMock.Setup(repo => repo.CreateProductLots(It.IsAny<List<ProductLot>>())).
                ThrowsAsync(new Exception("Ngày hết hạn không thể nhỏ hơn hiện tại"));


            var result = await _productLotService.CreateProductLot(productLots);

            Assert.Equal(500, result.StatusCode);
            Assert.True(result.Message.Contains("Lỗi hệ thống"));
        }

    }
}
