﻿using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class Category
    {
        public int Id { get; set; }
        public int? CategoryMainId { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryCode { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
    }
}
