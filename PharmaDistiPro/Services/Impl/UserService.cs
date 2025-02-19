using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Services.Interface;
using PharmaDistiPro.Repositories.Interface;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;

namespace PharmaDistiPro.Services.Impl
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository user, IMapper mapper)
        {
            _userRepository = user;
            _mapper = mapper;
        }

        //Get all customers
        public async Task<Response<IEnumerable<UserDTO>>> GetCustomerList()
        {
            var response = new Response<IEnumerable<UserDTO>>();
            try
            {
                var users = await _userRepository.GetAllAsync();
                response.Data = _mapper.Map<IEnumerable<UserDTO>>(users);
                response.Success = true;

                if (users.Count() == 0) response.Message = "No data found";

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
        public async Task<Response<UserDTO>> ActivateDeactivateUser(int customerId, bool update)
        {
            var response = new Response<UserDTO>();
            try
            {
                //check if customer exists
                var user = await _userRepository.GetByIdAsync(customerId);
                if (user == null)
                {
                    response.Success = false;
                    response.Data = _mapper.Map<UserDTO>(user);
                    response.Message = "User not found";
                    return response;
                }
                else
                {
                    user.Status = update;
                    await _userRepository.UpdateAsync(user);
                    response.Success = true;
                    response.Data = _mapper.Map<UserDTO>(user);
                    response.Message = "User updated successfully";
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
                var users = await _userRepository.GetAllAsync();
                response.Data = _mapper.Map<IEnumerable<UserDTO>>(users);
                response.Success = true;

                if (users.Count() == 0) response.Message = "No data found";

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
        public async Task<Response<UserDTO>> CreateNewUserOrCustomer(UserDTO user, int roleId)
        {
            var response = new Response<UserDTO>();
            /*   try
               {
                   if (user.FirstName == null || user.UserName == null || user.LastName == null || user.Email == null ||
                       user.Password == null || user.Phone == null || user.Address == null

                       )
                   {

                   }

               } catch (Exception ex)
               {
                   response.Success = false;
                   response.Message = ex.Message;
                   return response;
               }*/
            return response;
        }

        public async Task<Response<UserDTO>> GetUserById(int userId)
        {
            var response = new Response<UserDTO>();
            try
            {
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    response.Success = false;
                    response.Data = _mapper.Map<UserDTO>(user);
                    response.Message = "User not found";
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

        public async Task<Response<UserDTO>> UpdateUser(UserDTO user)
        {
            throw new NotImplementedException();
        }
    }
}
