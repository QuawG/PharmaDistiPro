using System;
using System.Collections.Generic;

namespace PharmaDistiPro.Models
{
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }

        public int Id { get; set; }
        public string? MainCategory { get; set; }
        public string? CategoryName { get; set; }
        public string? CategoryCode { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual User? CreatedByNavigation { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
