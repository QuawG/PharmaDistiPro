using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class Category
    {
        public Category()
        {
            Products = new HashSet<Product>();
        }

        [Key]
        public int Id { get; set; }
        public int? CategoryMainId { get; set; }
        [StringLength(50)]
        public string? CategoryName { get; set; }
        [StringLength(50)]
        public string? CategoryCode { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("Categories")]
        public virtual User? CreatedByNavigation { get; set; }
        [InverseProperty("Category")]
        public virtual ICollection<Product> Products { get; set; }
    }
}
