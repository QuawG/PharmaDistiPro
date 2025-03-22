using System;
using System.Collections.Generic;

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
            OrderConfirmedByNavigations = new HashSet<Order>();
            OrderCustomers = new HashSet<Order>();
            Products = new HashSet<Product>();
            PurchaseOrders = new HashSet<PurchaseOrder>();
            StorageRooms = new HashSet<StorageRoom>();
            Suppliers = new HashSet<Supplier>();
            Units = new HashSet<Unit>();
        }

        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public int? Age { get; set; }
        public string? Avatar { get; set; }
        public string? Address { get; set; }
        public int? RoleId { get; set; }
        public string? EmployeeCode { get; set; }
        public string? TaxCode { get; set; }
        public bool? Status { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpriedTime { get; set; }
        public string? ResetPasswordOtp { get; set; }
        public DateTime? ResetpasswordOtpexpriedTime { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public virtual Role? Role { get; set; }
        public virtual ICollection<Category> Categories { get; set; }
        public virtual ICollection<IssueNote> IssueNoteCreatedByNavigations { get; set; }
        public virtual ICollection<IssueNote> IssueNoteCustomers { get; set; }
        public virtual ICollection<IventoryActivity> IventoryActivities { get; set; }
        public virtual ICollection<Order> OrderConfirmedByNavigations { get; set; }
        public virtual ICollection<Order> OrderCustomers { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; }
        public virtual ICollection<StorageRoom> StorageRooms { get; set; }
        public virtual ICollection<Supplier> Suppliers { get; set; }
        public virtual ICollection<Unit> Units { get; set; }
    }
}
