﻿using Xunit;
using Moq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using PharmaDistiPro.Services.Impl;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.DTO.ReceivedNotes;
using PharmaDistiPro.Models;
using AutoMapper;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Repositories.Impl;

namespace PharmaDistiPro.Tests.ReceivedNoteServicesTest
{
    public class ReceivedNoteService_GetById_Tests
    {
        private readonly Mock<IReceivedNoteRepository> _receivedNoteRepositoryMock;
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ReceivedNoteService _service;

        public ReceivedNoteService_GetById_Tests()
        {
            _receivedNoteRepositoryMock = new Mock<IReceivedNoteRepository>();
            _purchaseOrderRepositoryMock = new Mock<IPurchaseOrderRepository>();
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            _mapperMock = new Mock<IMapper>();

            var context = new DefaultHttpContext();
            context.User = GetMockUser();
            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

            _service = new ReceivedNoteService(
                _receivedNoteRepositoryMock.Object,
                _httpContextAccessorMock.Object,
                _mapperMock.Object,
                _purchaseOrderRepositoryMock.Object
            );
        }

        private ClaimsPrincipal GetMockUser()
        {
            var claims = new List<Claim>
            {
                new Claim("UserId", "1")
            };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            return new ClaimsPrincipal(identity);
        }

        [Fact]
        public async Task GetReceiveNoteById_InvalidId_ReturnsBadRequest()
        {
            int invalidId = 0;

            var result = await _service.GetReceiveNoteById(invalidId);

            Assert.False(result.Success);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Id không hợp lệ!", result.Message);
        }

        [Fact]
        public async Task GetReceiveNoteById_NotFound_ReturnsNotFound()
        {
            int id = 1;

            _receivedNoteRepositoryMock.Setup(x => x.GetReceivedNoteById(id))
                .ReturnsAsync((ReceivedNote)null);

            var result = await _service.GetReceiveNoteById(id);

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy phiếu nhập!", result.Message);
        }

        [Fact]
        public async Task GetReceiveNoteById_ValidId_ReturnsSuccess()
        {
            int id = 1;

            var receivedNote = new ReceivedNote
            {
                ReceiveNoteId = id,
                ReceiveNotesCode = "PN-001",
                CreatedDate = DateTime.Now,
                CreatedBy = 123,
                Status = 1,
                PurchaseOrderId = 10,
                PurchaseOrder = new PurchaseOrder
                {
                    PurchaseOrderId = 10,
                    PurchaseOrderCode = "PO-001"
                }
            };

            var receivedNoteDetails = new List<ReceivedNoteDetail>
    {
        new ReceivedNoteDetail
        {
            ReceiveNoteId = id,
            ProductLotId = 1,
            ActualReceived = 50,
            ProductLot = new ProductLot
            {
                ProductLotId = 1,
                SupplyPrice = 100,
                Product = new Product
                {
                    ProductName = "Paracetamol",
                    ProductCode = "PCT001",
                    Unit = "Box"
                },
                Lot = new Lot
                {
                    LotCode = "LOT2025A"
                }
            }
        }
    };

            _receivedNoteRepositoryMock.Setup(x => x.GetReceivedNoteById(id))
                .ReturnsAsync(receivedNote);
            _receivedNoteRepositoryMock.Setup(x => x.GetReceivedNoteDetailByReceivedNoteId(id))
                .ReturnsAsync(receivedNoteDetails);

            var result = await _service.GetReceiveNoteById(id);

            Assert.True(result.Success);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Lấy phiếu nhập thành công!", result.Message);
            Assert.NotNull(result.Data);
        }
    }
}
