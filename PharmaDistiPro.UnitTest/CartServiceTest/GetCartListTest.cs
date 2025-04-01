using Microsoft.AspNetCore.Http;
using Moq;
using Newtonsoft.Json;
using PharmaDistiPro.DTO.Carts;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.Test.CartServiceTest
{
    public class GetCartListTest
    {
        private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
        private readonly Mock<HttpContext> _httpContextMock;
        private readonly Mock<HttpResponse> _httpResponseMock;
        private readonly CartService _cartService;

        public GetCartListTest()
        {
            _httpContextAccessorMock = new Mock<IHttpContextAccessor>();

            _httpContextMock = new Mock<HttpContext>();
            _httpResponseMock = new Mock<HttpResponse>();

            _httpContextMock.Setup(c => c.Response).Returns(_httpResponseMock.Object);
            _httpContextMock.Setup(c => c.Request.Cookies).Returns(new Mock<IRequestCookieCollection>().Object); 

            _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(_httpContextMock.Object);

            _cartService = new CartService(_httpContextAccessorMock.Object);
        }
        [Fact]
        public async Task GetCartList_ShouldReturnCartList_WhenCartIsNotEmpty()
        {
            var cartList = new List<CartModelDto>
            {
                new CartModelDto { ProductId = 1, Quantity = 2 }
            };

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var result = await _cartService.GetCartList();

            Assert.True(result.Success);
            Assert.Equal(1, result.Data.Count());
        }

        [Fact]
        public async Task GetCartList_ShouldReturnNull_WhenCartIsEmpty()
        {
            var cartList = new List<CartModelDto>();

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Cart", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var result = await _cartService.GetCartList();

            Assert.True(result.Success);
            Assert.Equal(0, result.Data.Count());
            Assert.Equal("Không có dữ liệu", result.Message);
        }

        [Fact]
        public async Task GetCartList_ShouldReturnNull_WhenCartIsWrongName()
        {
            var cartList = new List<CartModelDto>();

            var cartJson = JsonConvert.SerializeObject(cartList);

            _httpContextAccessorMock.Setup(x => x.HttpContext.Request.Cookies["Cart"]).Returns(cartJson);

            _httpResponseMock.Setup(r => r.Cookies.Append("Wrong", It.IsAny<string>(), It.IsAny<CookieOptions>()));

            var result = await _cartService.GetCartList();

            Assert.True(result.Success);
            Assert.Equal(0, result.Data.Count());
            Assert.Equal("Không có dữ liệu", result.Message);
        }

    }
}
