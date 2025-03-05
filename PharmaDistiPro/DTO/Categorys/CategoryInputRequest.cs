﻿using PharmaDistiPro.Models;

namespace PharmaDistiPro.DTO.Categorys
{
    public class CategoryInputRequest
    {
        public int Id { get; set; }
        public int? CategoryMainId { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryCode { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        

    }
}
