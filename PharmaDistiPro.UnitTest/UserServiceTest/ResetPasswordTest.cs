using AutoMapper;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Moq;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Repositories.Interface;
using PharmaDistiPro.Services.Impl;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PharmaDistiPro.Test.User
{
    public class ResetPasswordTest
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly UserService _userService;

        public ResetPasswordTest()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            _mapperMock = new Mock<IMapper>(); 
            _userService = new UserService(_userRepositoryMock.Object, _mapperMock.Object, null, null, null);
        }


        [Fact]
        public async Task Test_ResetPassword_Success()
        {
            var fakeResetPasswordRequest = new ResetPasswordRequest
            {
                Email = "test@example.com",
                OTP = "123",
                Password = "newpassword",
                ConfirmPassword = "newpassword"
            };

            var fakeUser = new Models.User
            {
                Email = "test@example.com",
                ResetPasswordOtp = "123",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(5)
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(fakeResetPasswordRequest.Email))
                .ReturnsAsync(fakeUser);

            _userRepositoryMock.Setup(repo => repo.UpdateAsync(It.IsAny<Models.User>()))
                .Callback<Models.User>(u => u.Password = fakeResetPasswordRequest.Password);

            var result = await _userService.ResetPassword(fakeResetPasswordRequest);

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("Password reset successfully", result.Message);

            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.Is<Models.User>(u =>
                u.Password == "newpassword" &&
                u.ResetPasswordOtp == null &&
                u.ResetpasswordOtpexpriedTime == null
            )), Times.Once);
        }

        [Fact]
        public async Task Test_ResetPassword_WhenEmailNotFound()
        {
            var fakeResetPasswordRequest = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = "123456",
                Password = "newpassword",
                ConfirmPassword = "newpassword"
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(fakeResetPasswordRequest.Email))
                .ReturnsAsync((Models.User)null);

            var result = await _userService.ResetPassword(fakeResetPasswordRequest);

            Assert.Equal(404, result.StatusCode);
            Assert.Equal("User not found", result.Message);

            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never);
        }

        [Fact]
        public async Task Test_ResetPassword_WhenOTPExpried()
        {
            var fakeResetPasswordRequest = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = "123456",
                Password = "newpassword",
                ConfirmPassword = "newpassword"
            };
            var fakeUser = new Models.User
            {
                Email = "123@example.com",
                ResetPasswordOtp = "123456",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(-5) 
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(fakeResetPasswordRequest.Email))
                .ReturnsAsync(fakeUser);

            var result = await _userService.ResetPassword(fakeResetPasswordRequest);
            Assert.Equal(400, result.StatusCode);
            Assert.Equal("OTP expired", result.Message);

            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never);
        }

        [Fact]
        public async Task Test_ResetPassword_WhenOTPInvalid()
        {
            var fakeResetPasswordRequest = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = "123456",
                Password = "newpassword",
                ConfirmPassword = "newpassword"
            };

            var fakeUser = new Models.User
            {
                Email = "123@example.com",
                ResetPasswordOtp = "123",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(5)
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(fakeResetPasswordRequest.Email))
                .ReturnsAsync(fakeUser);

            var result = await _userService.ResetPassword(fakeResetPasswordRequest);

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("Invalid OTP", result.Message);

            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never);
        }

        [Fact]
        public async Task Test_ResetPassword_WhenPasswordNotEqualConfirmPassword()
        {
            var fakeResetPasswordRequest = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = "123456",
                Password = "newpassword",
                ConfirmPassword = "123"
            };

            var fakeUser = new Models.User
            {
                Email = "123@example.com",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(5) 
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(fakeResetPasswordRequest.Email))
                .ReturnsAsync(fakeUser);

            var result = await _userService.ResetPassword(fakeResetPasswordRequest);

            Assert.Equal(400, 400);

            _userRepositoryMock.Verify(repo => repo.UpdateUser(It.IsAny<Models.User>()), Times.Never);
        }

        [Fact]
        public async Task Test_ResetPassword_WhenOTPIsNull()
        {
            var request = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = null,
                Password = "newpassword",
                ConfirmPassword = "newpassword"
            };

            var fakeUser = new Models.User
            {
                Email = "123@example.com",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(5)
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(request.Email))
                .ReturnsAsync((Models.User)null);

            var result = await _userService.ResetPassword(request);

            Assert.Equal(404, result.StatusCode);
        }
        [Fact]
        public async Task Test_ResetPassword_WhenPasswordIsNull()
        {
            var request = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = "123456",
                Password = null,
                ConfirmPassword = "newpassword"
            };
            var fakeUser = new Models.User
            {
                Email = "123@example.com",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(5)
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(request.Email))
                .ReturnsAsync((Models.User)null);
            var result = await _userService.ResetPassword(request);

            Assert.Equal(404, result.StatusCode);

        }

        [Fact]
        public async Task Test_ResetPassword_WhenConfirmPasswordIsNull()
        {
            var request = new ResetPasswordRequest
            {
                Email = "123@example.com",
                OTP = "123456",
                Password = "newpassword",
                ConfirmPassword = null
            };
            var fakeUser = new Models.User
            {
                Email = "123@example.com",
                ResetpasswordOtpexpriedTime = DateTime.Now.AddMinutes(5)
            };

            _userRepositoryMock
                .Setup(repo => repo.GetUserByEmail(request.Email))
                .ReturnsAsync((Models.User)null);
            var result = await _userService.ResetPassword(request);

            Assert.Equal(404, result.StatusCode);
        }



    }

}
