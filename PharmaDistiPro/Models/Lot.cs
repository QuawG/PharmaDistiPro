using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class Lot
    {
        public Lot()
        {
            ProductLots = new HashSet<ProductLot>();
        }

        [Key]
        public int LotId { get; set; }
        [StringLength(50)]
        public string? LotCode { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [InverseProperty("Lot")]
        public virtual ICollection<ProductLot> ProductLots { get; set; }
    }
}
