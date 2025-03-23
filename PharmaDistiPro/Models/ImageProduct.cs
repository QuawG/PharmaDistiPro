using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    [Table("ImageProduct")]
    public partial class ImageProduct
    {
        [Key]
        public int Id { get; set; }
        public int? ProductId { get; set; }
        public string? Image { get; set; }

        [ForeignKey("ProductId")]
        [InverseProperty("ImageProducts")]
        public virtual Product? Product { get; set; }
    }
}
