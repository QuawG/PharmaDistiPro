using AutoMapper;
using Moq;
using PharmaDistiPro.DTO.PurchaseOrders;
using PharmaDistiPro.Helper.Enums;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.UnitTest.PurchaseOrderServiceTest
{
    public class CreatePurchaseOrderTest
    {
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IPurchaseOrdersDetailRepository> _purchaseOrdersDetailRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly PurchaseOrderService _purchaseOrderService;

        public CreatePurchaseOrderTest()
        {
            _purchaseOrderRepositoryMock = new Mock<IPurchaseOrderRepository>();
            _purchaseOrdersDetailRepositoryMock = new Mock<IPurchaseOrdersDetailRepository>();
            _mapperMock = new Mock<IMapper>();

            _purchaseOrderService = new PurchaseOrderService(
                _purchaseOrderRepositoryMock.Object,
                _purchaseOrdersDetailRepositoryMock.Object,
                _mapperMock.Object
            );
        }

        [Fact]
        public async Task CreatePurchaseOrder_WhenCalled_ReturnsSuccess()
        {
            var purchaseOrderRequestDto = new PurchaseOrdersRequestDto
            {
                SupplierId = 1,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetailsRequestDto>
                {
                    new PurchaseOrdersDetailsRequestDto { ProductId = 10, Quantity = 5 },
                    new PurchaseOrdersDetailsRequestDto { ProductId = 20, Quantity = 2 }
                }
            };

            var purchaseOrder = new PurchaseOrder
            {
                PurchaseOrderId = 1,
                SupplierId = 1,
                Status = (int)PurchaseOrderStatus.CHO_NHAP_HANG,
                CreateDate = DateTime.Now
            };

            var purchaseOrderDetails = new List<PurchaseOrdersDetail>
            {
                new PurchaseOrdersDetail { PurchaseOrderId = 1, ProductId = 10, Quantity = 5 },
                new PurchaseOrdersDetail { PurchaseOrderId = 1, ProductId = 20, Quantity = 2 }
            };

            _mapperMock.Setup(m => m.Map<PurchaseOrder>(It.IsAny<PurchaseOrdersRequestDto>()))
                       .Returns(purchaseOrder);

            _mapperMock.Setup(m => m.Map<List<PurchaseOrdersDetail>>(It.IsAny<IEnumerable<PurchaseOrdersDetailsRequestDto>>()))
                       .Returns(purchaseOrderDetails);

            foreach (var detail in purchaseOrderRequestDto.PurchaseOrdersDetails)
            {
               _mapperMock.Setup(m => m.Map<PurchaseOrdersDetail>(detail))
                          .Returns(new PurchaseOrdersDetail
                          {
                              ProductId = detail.ProductId,
                              Quantity = detail.Quantity
                          });
            }


            _mapperMock.Setup(m => m.Map<PurchaseOrdersDto>(purchaseOrder))
                       .Returns(new PurchaseOrdersDto { PurchaseOrderId = 1 });

            _purchaseOrderRepositoryMock.Setup(r => r.InsertPurchaseOrderAsync(It.IsAny<PurchaseOrder>()))
                                        .Returns(Task.CompletedTask);

            _purchaseOrderRepositoryMock.Setup(r => r.SaveAsync());

            _purchaseOrdersDetailRepositoryMock.Setup(r => r.InsertRangeAsync(It.IsAny<List<PurchaseOrdersDetail>>()));

            _purchaseOrdersDetailRepositoryMock.Setup(r => r.SaveAsync());

            // Act
            var result = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrderRequestDto);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Success);
            Assert.Equal(1, result.Data.PurchaseOrderId);

            _purchaseOrderRepositoryMock.Verify(r => r.InsertPurchaseOrderAsync(It.IsAny<PurchaseOrder>()), Times.Once);
            _purchaseOrderRepositoryMock.Verify(r => r.SaveAsync(), Times.Once);
            _purchaseOrdersDetailRepositoryMock.Verify(r => r.InsertRangeAsync(It.IsAny<List<PurchaseOrdersDetail>>()), Times.Once);
            _purchaseOrdersDetailRepositoryMock.Verify(r => r.SaveAsync(), Times.Once);
        }

        [Fact]
        public async Task CreatePurchaseOrder_WhenExceptionMapperThrown_ReturnsError()
        {
            var purchaseOrderRequestDto = new PurchaseOrdersRequestDto
            {
                SupplierId = 1,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetailsRequestDto>
                {
                    new PurchaseOrdersDetailsRequestDto { ProductId = 10, Quantity = 5 }
                }
            };

            _purchaseOrderRepositoryMock.Setup(r => r.InsertPurchaseOrderAsync(It.IsAny<PurchaseOrder>()));

            // Act
            var result = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrderRequestDto);

            // Assert
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.True(result.Message.Contains("Object reference not set to an instance"));

        }

        [Fact]
        public async Task CreatePurchaseOrder_WhenPurchaseOrderDtoInvalid_ReturnError()
        {
            var purchaseOrderRequestDto = new PurchaseOrdersRequestDto
            {
                SupplierId = 1,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetailsRequestDto>
                {
                    new PurchaseOrdersDetailsRequestDto { ProductId = 10, Quantity = 5 }
                }
            };

            _mapperMock.Setup(m => m.Map<PurchaseOrder>(It.IsAny<PurchaseOrdersRequestDto>()))
                .Throws(new Exception("Không có dữ liệu nhập vào"));
            // Act
            var result = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrderRequestDto);

            // Assert
            Assert.NotNull(result);
            Assert.False(result.Success);
            Assert.True(result.Message.Contains("Không có dữ liệu nhập vào"));
        }

        [Fact]
        public async Task CreatePurchaseOrder_WhenPurchaseOrderDetailsDtoInvalid_ReturnsError()
        {
            var purchaseOrderRequestDto = new PurchaseOrdersRequestDto
            {
                SupplierId = 1,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetailsRequestDto>
        {
            new PurchaseOrdersDetailsRequestDto { ProductId = 10, Quantity = 5 }
        }
            };

            _mapperMock.Setup(m => m.Map<PurchaseOrder>(It.IsAny<PurchaseOrdersRequestDto>()))
                       .Returns(new PurchaseOrder()); 

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDetail>(It.IsAny<PurchaseOrdersDetailsRequestDto>()))
                       .Throws(new Exception("Không có dữ liệu nhập vào")); 

            _purchaseOrderRepositoryMock.Setup(r => r.InsertPurchaseOrderAsync(It.IsAny<PurchaseOrder>()))
                                        .Returns(Task.CompletedTask);

            _purchaseOrderRepositoryMock.Setup(r => r.SaveAsync());

            var result = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrderRequestDto);

            Assert.NotNull(result);
            Assert.False(result.Success); 
            Assert.Contains("Không có dữ liệu nhập vào", result.Message);
        }

        [Fact]
        public async Task CreatePurchaseOrder_WhenSupplierIdInvalid_ReturnsError()
        {
            
            var purchaseOrderRequestDto = new PurchaseOrdersRequestDto
            {
                SupplierId = 0,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetailsRequestDto>
                {
                    new PurchaseOrdersDetailsRequestDto { ProductId = 10, Quantity = 5 }
                }
            };

            _mapperMock.Setup(m => m.Map<PurchaseOrder>(It.IsAny<PurchaseOrdersRequestDto>()))
                .Throws(new Exception("SupplierId không hợp lệ"));

            var result = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrderRequestDto);

            // Assert
            Assert.False(result.Success);
            Assert.Null(result.Data);
            Assert.Contains("SupplierId không hợp lệ", result.Message);
        }

        [Fact]
        public async Task CreatePurchaseOrder_WhenProductQuantityIsZero_ReturnsError()
        {
            
            var purchaseOrderRequestDto = new PurchaseOrdersRequestDto
            {
                SupplierId = 1,
                PurchaseOrdersDetails = new List<PurchaseOrdersDetailsRequestDto>
                {           
                    new PurchaseOrdersDetailsRequestDto { ProductId = 10, Quantity = 0 }        
                }
            };

            _mapperMock.Setup(m => m.Map<PurchaseOrder>(It.IsAny<PurchaseOrdersRequestDto>()))
           .Returns(new PurchaseOrder());

            _mapperMock.Setup(m => m.Map<PurchaseOrdersDetail>(It.IsAny<PurchaseOrdersDetailsRequestDto>()))
                       .Throws(new Exception("Số lượng sản phẩm phải lớn hơn 0"));

            _purchaseOrderRepositoryMock.Setup(r => r.InsertPurchaseOrderAsync(It.IsAny<PurchaseOrder>()))
                                        .Returns(Task.CompletedTask);

            _purchaseOrderRepositoryMock.Setup(r => r.SaveAsync());

            var result = await _purchaseOrderService.CreatePurchaseOrder(purchaseOrderRequestDto);

            // Assert
            Assert.False(result.Success);
            Assert.NotNull(result.Message);
            Assert.Contains("Số lượng sản phẩm phải lớn hơn 0", result.Message);
        }

    }
}
