using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PharmaDistiPro.Models
{
    public partial class User
    {
        public User()
        {
            Categories = new HashSet<Category>();
            IssueNoteCreatedByNavigations = new HashSet<IssueNote>();
            IssueNoteCustomers = new HashSet<IssueNote>();
            IventoryActivities = new HashSet<IventoryActivity>();
            OrderAssignToNavigations = new HashSet<Order>();
            OrderConfirmedByNavigations = new HashSet<Order>();
            OrderCustomers = new HashSet<Order>();
            Products = new HashSet<Product>();
            PurchaseOrders = new HashSet<PurchaseOrder>();
            ReceivedNotes = new HashSet<ReceivedNote>();
            StorageRooms = new HashSet<StorageRoom>();
            Suppliers = new HashSet<Supplier>();
            Units = new HashSet<Unit>();
        }

        [Key]
        public int UserId { get; set; }
        [StringLength(50)]
        public string? UserName { get; set; }
        [StringLength(10)]
        public string? FirstName { get; set; }
        [StringLength(50)]
        public string? LastName { get; set; }
        [StringLength(50)]
        public string? Phone { get; set; }
        [StringLength(255)]
        public string? Email { get; set; }
        [StringLength(50)]
        public string? Password { get; set; }
        public int? Age { get; set; }
        [StringLength(255)]
        public string? Avatar { get; set; }
        [StringLength(255)]
        public string? Address { get; set; }
        public int? RoleId { get; set; }
        [StringLength(50)]
        public string? EmployeeCode { get; set; }
        [StringLength(50)]
        public string? TaxCode { get; set; }
        public bool? Status { get; set; }
        public string? RefreshToken { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? RefreshTokenExpriedTime { get; set; }
        [Column("ResetPasswordOTP")]
        [StringLength(6)]
        public string? ResetPasswordOtp { get; set; }
        [Column("ResetpasswordOTPExpriedTime", TypeName = "datetime")]
        public DateTime? ResetpasswordOtpexpriedTime { get; set; }
        public int? CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? CreatedDate { get; set; }

        [ForeignKey("RoleId")]
        [InverseProperty("Users")]
        public virtual Role? Role { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Category> Categories { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<IssueNote> IssueNoteCreatedByNavigations { get; set; }
        [InverseProperty("Customer")]
        public virtual ICollection<IssueNote> IssueNoteCustomers { get; set; }
        [InverseProperty("User")]
        public virtual ICollection<IventoryActivity> IventoryActivities { get; set; }
        [InverseProperty("AssignToNavigation")]
        public virtual ICollection<Order> OrderAssignToNavigations { get; set; }
        [InverseProperty("ConfirmedByNavigation")]
        public virtual ICollection<Order> OrderConfirmedByNavigations { get; set; }
        [InverseProperty("Customer")]
        public virtual ICollection<Order> OrderCustomers { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Product> Products { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<ReceivedNote> ReceivedNotes { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<StorageRoom> StorageRooms { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Supplier> Suppliers { get; set; }
        [InverseProperty("CreatedByNavigation")]
        public virtual ICollection<Unit> Units { get; set; }
    }
}
