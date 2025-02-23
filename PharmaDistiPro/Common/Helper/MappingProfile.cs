﻿using AutoMapper;
using PharmaDistiPro.DTO.Users;
using PharmaDistiPro.Models;
namespace PharmaDistiPro.Common.Helper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            #region User
            CreateMap<User, UserDTO>();
            CreateMap<UserDTO, User>();

            CreateMap<UserInputRequest, UserDTO>();
            CreateMap<UserDTO, UserInputRequest>();

            CreateMap<User, UserInputRequest>();
            CreateMap<UserInputRequest, User>();
            #endregion
        }
    }
}
