using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class Unit
    {
        public Unit()
        {
            Products = new HashSet<Product>();
        }

        [Key]
        public int Id { get; set; }
        [StringLength(50)]
        public string? UnitsName { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("CreatedBy")]
        [InverseProperty("Units")]
        public virtual User? CreatedByNavigation { get; set; }
        [InverseProperty("Unit")]
        public virtual ICollection<Product> Products { get; set; }
    }
}
