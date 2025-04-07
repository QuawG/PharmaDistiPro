using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.Repositories.Interface;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using PharmaDistiPro.Models;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using PharmaDistiPro.Helper;
using PharmaDistiPro.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PharmaDistiPro.Services.Impl
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        private readonly Cloudinary _cloudinary;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IUserRepository user, IMapper mapper, Cloudinary cloudinary, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _userRepository = user;
            _mapper = mapper;
            _cloudinary = cloudinary;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }
        #region User and Customer Management

        //Get all customers
        public async Task<Response<IEnumerable<UserDTO>>> GetCustomerList()
        {
            var response = new Response<IEnumerable<UserDTO>>();
            try
            {
                var users = await _userRepository.GetByConditionAsync(u => u.RoleId == 5, includes: new string[] { "Role" });
                if (users.Count() == 0)
                {
                    response.Message = "Không có dữ liệu";
                    response.Success = false;
                }
                else
                {
                    response.Data = _mapper.Map<IEnumerable<UserDTO>>(users);
                    response.Success = true;
                }
                return response;

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        ///DeactivateCustomer and User
        public async Task<Response<UserDTO>> ActivateDeactivateUser(int userId, bool update)
        {
            var response = new Response<UserDTO>();
            try
            {
                //check if customer exists
                var user = await _userRepository.GetSingleByConditionAsync(x => x.UserId == userId, includes: new string[] { "Role" });
                if (user == null)
                {
                    response.Success = false;
                    response.Data = _mapper.Map<UserDTO>(user);
                    response.Message = "Không tìm thấy người dùng";
                    return response;
                }
                else
                {
                    user.Status = update;
                    await _userRepository.UpdateAsync(user);
                    await _userRepository.SaveAsync();
                    response.Success = true;
                    response.Data = _mapper.Map<UserDTO>(user);
                    response.Message = "Cập nhật thành công";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Get all users
        public async Task<Response<IEnumerable<UserDTO>>> GetUserList()
        {
            var response = new Response<IEnumerable<UserDTO>>();
            try
            {
                var users = await _userRepository.GetByConditionAsync(u => u.RoleId != 5, includes: new string[] { "Role" });
                response.Data = _mapper.Map<IEnumerable<UserDTO>>(users);
                response.Success = true;

                if (users.Count() == 0) response.Message = "Không có dữ liệu";

                return response;

            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        //Create new user or customer
        public async Task<Response<UserDTO>> CreateNewUserOrCustomer(UserInputRequest userInputRequest)
        {
            var response = new Response<UserDTO>();
            string imageUrl = null;

            try
            {
                // Kiểm tra xem user đã tồn tại chưa 
                var existingUser = await _userRepository.GetSingleByConditionAsync(x => x.Email.Equals(userInputRequest.Email) || x.UserName.Equals(userInputRequest.UserName));

                //dem so user trong he thong
                var countUserList = _userRepository.GetAllAsync().Result.Count();


                if (existingUser != null)
                {
                    response.Success = false;
                    response.Message = "Email hoặc username đã tồn tại.";
                    return response;
                }

                // Upload avatar lên Cloudinary nếu cần
                    if (userInputRequest.Avatar != null)
                    {
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(userInputRequest.Avatar.FileName, userInputRequest.Avatar.OpenReadStream()),
                            PublicId = Path.GetFileNameWithoutExtension(userInputRequest.Avatar.FileName)
                        };

                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        imageUrl = uploadResult.SecureUri.ToString();
                }
                // update employeecode
                if (userInputRequest.RoleId != 5) userInputRequest.EmployeeCode = ConstantStringHelper.EmployeeCode + countUserList;


                // Map dữ liệu từ DTO sang Entity
                var newUser = _mapper.Map<User>(userInputRequest);
                newUser.Avatar = imageUrl;
                newUser.CreatedDate = DateTime.Now;
                newUser.Status = true;
                newUser.CreatedBy = UserHelper.GetUserIdLogin(_httpContextAccessor.HttpContext);

                // Thêm mới user vào database
                await _userRepository.InsertAsync(newUser);
                await _userRepository.SaveAsync();

                // Trả về dữ liệu đã tạo mới
                response.Message = "Tạo mới thành công";
                response.Success = true;
                response.Data = _mapper.Map<UserDTO>(newUser);

                return response;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = $"Lỗi: {ex.Message}";
                return response;
            }
        }

        // Get user by Id
        public async Task<Response<UserDTO>> GetUserById(int userId)
        {
            var response = new Response<UserDTO>();
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    response.Success = false;
                    response.Data = null;
                    response.Message = "Không tìm thấy người dùng";
                    return response;
                }
                else
                {
                    response.Success = true;
                    response.Data = _mapper.Map<UserDTO>(user);
                    response.Message = "User found";
                    return response;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
                return response;
            }
        }

        // Update user
        public async Task<Response<UserDTO>> UpdateUser(UserInputRequest userUpdateRequest)
        {
            var response = new Response<UserDTO>();
            string imageUrl = null;

            try
            {
                // Kiểm tra người dùng có tồn tại không
                var userToUpdate = await _userRepository.GetByIdAsync(userUpdateRequest.UserId);
                if (userToUpdate == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy người dùng";
                    return response;
                }
                userUpdateRequest.Password = userToUpdate.Password;
                // mapper request model -> entity
                _mapper.Map(userUpdateRequest, userToUpdate);

                // Kiểm tra và upload avatar nếu có thay đổi
                if (userUpdateRequest.Avatar != null)
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(userUpdateRequest.Avatar.FileName, userUpdateRequest.Avatar.OpenReadStream()),
                        PublicId = Path.GetFileNameWithoutExtension(userUpdateRequest.Avatar.FileName)
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    imageUrl = uploadResult.SecureUri.ToString();
                    userToUpdate.Avatar = imageUrl;
                }

                await _userRepository.UpdateAsync(userToUpdate);
                await _userRepository.SaveAsync();

                response.Success = true;
                response.Data = _mapper.Map<UserDTO>(userToUpdate);
                response.Message = "Cập nhật thành công";
            }
            catch (Exception ex)
            {
                // Log lỗi chi tiết và thông báo lỗi thân thiện người dùng
                // logger.LogError(ex, "Lỗi khi cập nhật người dùng");
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
        }
        #endregion

        #region Authentication

        #region login
        public async Task<Response<LoginResponse>> Login(LoginRequest loginModel)
        {
            var response = new Response<LoginResponse>();
            var user = await _userRepository.GetUser(loginModel.Username, loginModel.Password);

        

            if (user != null)
            {

                if (user.Status == false)
                {
                    return new Response<LoginResponse>
                    {
                        StatusCode = 404,
                        Message = "Tài khoản không được phép đăng nhập"
                    };
                }

                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();

                //Lưu refresh token vào database
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpriedTime = DateTime.UtcNow.AddDays(7); // Refresh token sống 7 ngày
                await _userRepository.UpdateUser(user);

                var loginResponse = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    UserId = user.UserId,
                    UserName = user.UserName,
                    RoleName = user.Role.RoleName,
                    UserAvatar = user.Avatar
                };

                response = new Response<LoginResponse>
                {
                    StatusCode = 200,
                    Data = loginResponse
                };
                return response;
            }

            return new Response<LoginResponse>
            {
                StatusCode = 404,
                Message = "User does not exist"
            };
        }
        #endregion
        private string GenerateAccessToken(User user)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, user.UserName),
        new Claim(ClaimTypes.Role, user.Role.RoleName),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName),
        new Claim("UserId", user.UserId.ToString())
    };

            var token = new JwtSecurityToken
            (
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Access token chỉ sống 15 phút
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:key"])),
                    SecurityAlgorithms.HmacSha256
                )
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
        #region refresh Token
        public async Task<Response<LoginResponse>> RefreshToken(TokenModel tokenModel)
        {
            var response = new Response<LoginResponse>();
            var user = await _userRepository.GetUserByRefreshToken(tokenModel.RefreshToken);

            if (user == null || user.RefreshTokenExpriedTime <= DateTime.UtcNow)
            {
                response = new Response<LoginResponse>
                {
                    StatusCode = 401,
                    Message = "Invalid refresh token"
                };
                return response;
            }

            var newAccessToken = GenerateAccessToken(user);
            var newRefreshToken = GenerateRefreshToken();

            // Cập nhật refresh token mới
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpriedTime = DateTime.UtcNow.AddDays(7);
            await _userRepository.UpdateUser(user);
            response = new Response<LoginResponse>
            {
                StatusCode = 200,
                Data = new LoginResponse
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken
                }
            };
            return response;
        }
        #endregion
        #region resetpassword
        public async Task<Response<ResetPasswordResponse>> ResetPassword(ResetPasswordRequest resetPasswordRequest)
        {
            var response = new Response<ResetPasswordResponse>();
            var user = await _userRepository.GetUserByEmail(resetPasswordRequest.Email);
            if (user == null)
            {
                response = new Response<ResetPasswordResponse>
                {
                    StatusCode = 404,
                    Message = "User not found"
                };
                return response;
            }
            if (user.ResetPasswordOtp != resetPasswordRequest.OTP)
            {
                response = new Response<ResetPasswordResponse>
                {
                    StatusCode = 400,
                    Message = "Invalid OTP"
                };
                return response;
            }
            if (user.ResetpasswordOtpexpriedTime < DateTime.Now)
            {
                response = new Response<ResetPasswordResponse>
                {
                    StatusCode = 400,
                    Message = "OTP expired"
                };
                return response;
            }
            user.Password = resetPasswordRequest.Password;
            user.ResetPasswordOtp = null;
            user.ResetpasswordOtpexpriedTime = null;
            await _userRepository.UpdateUser(user);
            response = new Response<ResetPasswordResponse>
            {
                StatusCode = 200,
                Message = "Password reset successfully"
            };
            return response;
        }
        #endregion
        #region logout

        public async Task<Response<LoginResponse>> Logout([FromBody] String refreshToken)
        {
            var response = new Response<LoginResponse>();
            var user = await _userRepository.GetUserByRefreshToken(refreshToken);
            if (user == null)
            {
                response = new Response<LoginResponse>
                {
                    StatusCode = 400,
                    Message = "Invalid request"
                };
                return response;
            }


            user.RefreshToken = null;
            user.RefreshTokenExpriedTime= null;
            await _userRepository.UpdateUser(user);
            response = new Response<LoginResponse>
            {
                StatusCode = 200,
                Message = "Logged out successfully"
            };
            return response;
        }

        #endregion
        public async Task<User> getUserByEmail(string email)
        {
            return await _userRepository.GetUserByEmail(email);
        }

        public async Task<User> UpdateUser(User user)
        {
            return await _userRepository.UpdateUser(user);
        }
        #endregion
    }
}
