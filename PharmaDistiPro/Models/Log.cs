using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    [Table("Log")]
    public partial class Log
    {
        [Key]
        public int LogId { get; set; }
        public string? EvenType { get; set; }
        public string? Message { get; set; }
        public int? UserId { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedAt { get; set; }
        public string? RequestUrl { get; set; }
        public string? StackTrace { get; set; }
        [Column("IPAddress")]
        public string? Ipaddress { get; set; }

        [ForeignKey("UserId")]
        [InverseProperty("Logs")]
        public virtual User? User { get; set; }
    }
}
