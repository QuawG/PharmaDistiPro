using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.Repositories.Interface;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using PharmaDistiPro.Models;
using CloudinaryDotNet.Actions;
using CloudinaryDotNet;

namespace PharmaDistiPro.Services.Impl
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        private readonly Cloudinary _cloudinary;
        private readonly IMapper _mapper;

        public UserService(IUserRepository user, IMapper mapper, Cloudinary cloudinary)
        {
            _userRepository = user;
            _mapper = mapper;
            _cloudinary = cloudinary;
        }

        //Get all customers
        public async Task<Response<IEnumerable<UserDTO>>> GetCustomerList()
        {
            var response = new Response<IEnumerable<UserDTO>>();
            try
            {
                var users = await _userRepository.GetByConditionAsync(u => u.RoleId == 5);
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

        ///DeactivateCustomer and User
        public async Task<Response<UserDTO>> ActivateDeactivateUser(int userId, bool update)
        {
            var response = new Response<UserDTO>();
            try
            {
                //check if customer exists
                var user = await _userRepository.GetByIdAsync(userId);
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
                var users = await _userRepository.GetByConditionAsync(u => u.RoleId != 5);
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
                var existingUser = await _userRepository.GetSingleByConditionAsync(x=> x.Email.Equals(userInputRequest.Email) || x.UserName.Equals(userInputRequest.UserName));
                if (existingUser != null)
                {
                    response.Success = false;
                    response.Message = "Email hoặc username đã tồn tại.";
                    return response;
                }

                // Upload avatar lên Cloudinary nếu cần
                if (userInputRequest.RoleId != 5 && userInputRequest.Avatar != null)
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(userInputRequest.Avatar.FileName, userInputRequest.Avatar.OpenReadStream()),
                        PublicId = Path.GetFileNameWithoutExtension(userInputRequest.Avatar.FileName)
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    imageUrl = uploadResult.SecureUri.ToString();
                }

                // Map dữ liệu từ DTO sang Entity
                var newCustomer = _mapper.Map<User>(userInputRequest);
                newCustomer.Avatar = imageUrl;
                newCustomer.CreatedDate = DateTime.Now;

                // Thêm mới user vào database
                await _userRepository.InsertAsync(newCustomer);
                await _userRepository.SaveAsync();

                // Trả về dữ liệu đã tạo mới
                response.Message = "Tạo mới thành công";
                response.Success = true;
                response.Data = _mapper.Map<UserDTO>(newCustomer);

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
                var userToUpdate = await _userRepository.GetByIdAsync(userUpdateRequest.Id);
                if (userToUpdate == null)
                {
                    response.Success = false;
                    response.Message = "Không tìm thấy người dùng";
                    return response;
                }

                // Kiểm tra và upload avatar nếu có thay đổi
                if (userUpdateRequest.Avatar != null &&
                    userUpdateRequest.Avatar.FileName != Path.GetFileName(userToUpdate.Avatar) && userUpdateRequest.Id != 5)
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(userUpdateRequest.Avatar.FileName, userUpdateRequest.Avatar.OpenReadStream()),
                        PublicId = Path.GetFileNameWithoutExtension(userUpdateRequest.Avatar.FileName)
                    };

                    var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                    imageUrl = uploadResult.SecureUri.ToString();
                }

                // Map dữ liệu từ DTO sang thực thể
                _mapper.Map(userUpdateRequest, userToUpdate);

                // Chỉ cập nhật avatar nếu có URL mới
                if (!string.IsNullOrEmpty(imageUrl))
                {
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
                response.Message = "Đã xảy ra lỗi trong quá trình cập nhật người dùng.";
            }

            return response;
        }
    }
}
