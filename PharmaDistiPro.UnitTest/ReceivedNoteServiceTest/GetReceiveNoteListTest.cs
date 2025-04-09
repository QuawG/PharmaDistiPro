using Xunit;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using PharmaDistiPro.DTO.ReceivedNotes;
using PharmaDistiPro.Models;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;

namespace PharmaDistiPro.Tests.Services
{
    public class ReceivedNoteService_GetList_Tests
    {
        private readonly Mock<IReceivedNoteRepository> _receivedNoteRepositoryMock;
        private readonly Mock<IPurchaseOrderRepository> _purchaseOrderRepositoryMock;
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ReceivedNoteService _service;

        public ReceivedNoteService_GetList_Tests()
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
            var claims = new List<Claim> { new Claim("UserId", "1") };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            return new ClaimsPrincipal(identity);
        }

        [Fact]
        public async Task GetReceiveNoteList_NullList_ReturnsNotFound()
        {
            _receivedNoteRepositoryMock.Setup(x => x.GetReceivedNoteList())
                .ReturnsAsync((List<ReceivedNote>)null);

            var result = await _service.GetReceiveNoteList();

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Không tìm thấy danh sách phiếu nhập!", result.Message);
        }

        [Fact]
        public async Task GetReceiveNoteList_EmptyList_ReturnsEmptyMessage()
        {
            _receivedNoteRepositoryMock.Setup(x => x.GetReceivedNoteList())
                .ReturnsAsync(new List<ReceivedNote>());

            var result = await _service.GetReceiveNoteList();

            Assert.False(result.Success);
            Assert.Equal(404, result.StatusCode);
            Assert.Equal("Danh sách phiếu nhập rỗng!", result.Message);
        }

        [Fact]
        public async Task GetReceiveNoteList_ValidList_ReturnsSuccess()
        {
            var receivedNotes = new List<ReceivedNote>
            {
                new ReceivedNote { ReceiveNoteId = 1 },
                new ReceivedNote { ReceiveNoteId = 2 }
            };

            var dtoList = new List<ReceivedNoteDto>
            {
                new ReceivedNoteDto { ReceiveNoteId = 1 },
                new ReceivedNoteDto { ReceiveNoteId = 2 }
            };

            _receivedNoteRepositoryMock.Setup(x => x.GetReceivedNoteList())
                .ReturnsAsync(receivedNotes);

            _mapperMock.Setup(x => x.Map<List<ReceivedNoteDto>>(receivedNotes))
                .Returns(dtoList);

            var result = await _service.GetReceiveNoteList();

            Assert.True(result.Success);
            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Lấy danh sách phiếu nhập thành công!", result.Message);
            Assert.NotNull(result.Data);
            Assert.Equal(2, result.Data.Count);
        }
    }
}
