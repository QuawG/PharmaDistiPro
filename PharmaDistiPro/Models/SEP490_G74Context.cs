using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace PharmaDistiPro.Models
{
    public partial class SEP490_G74Context : DbContext
    {
        public SEP490_G74Context()
        {
        }

        public SEP490_G74Context(DbContextOptions<SEP490_G74Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Category> Categorys { get; set; } = null!;
        public virtual DbSet<ImageProduct> ImageProducts { get; set; } = null!;
        public virtual DbSet<IssueNote> IssueNotes { get; set; } = null!;
        public virtual DbSet<IssueNoteDetail> IssueNoteDetails { get; set; } = null!;
        public virtual DbSet<IventoryActivity> IventoryActivities { get; set; } = null!;
        public virtual DbSet<Lot> Lots { get; set; } = null!;
        public virtual DbSet<NoteCheck> NoteChecks { get; set; } = null!;
        public virtual DbSet<NoteCheckDetail> NoteCheckDetails { get; set; } = null!;
        public virtual DbSet<Order> Orders { get; set; } = null!;
        public virtual DbSet<OrdersDetail> OrdersDetails { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<ProductLot> ProductLots { get; set; } = null!;
        public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; } = null!;
        public virtual DbSet<PurchaseOrdersDetail> PurchaseOrdersDetails { get; set; } = null!;
        public virtual DbSet<ReceivedNote> ReceivedNotes { get; set; } = null!;
        public virtual DbSet<ReceivedNoteDetail> ReceivedNoteDetails { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<StorageRoom> StorageRooms { get; set; } = null!;
        public virtual DbSet<Supplier> Suppliers { get; set; } = null!;
        public virtual DbSet<Unit> Units { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=localhost;Initial Catalog=SEP490_G74;User ID=sa;Password=123");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Categories)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Categorys_Users");
            });

            modelBuilder.Entity<ImageProduct>(entity =>
            {
                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ImageProducts)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ImageProduct_Products");
            });

            modelBuilder.Entity<IssueNote>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.IssueNoteCreatedByNavigations)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_IssueNotes_Users1");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.IssueNoteCustomers)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_IssueNotes_Users");

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.IssueNotes)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_IssueNotes_Orders");
            });

            modelBuilder.Entity<IssueNoteDetail>(entity =>
            {
                entity.HasOne(d => d.IssueNote)
                    .WithMany(p => p.IssueNoteDetails)
                    .HasForeignKey(d => d.IssueNoteId)
                    .HasConstraintName("FK_IssueNoteDetails_IssueNotes");

                entity.HasOne(d => d.ProductLot)
                    .WithMany(p => p.IssueNoteDetails)
                    .HasForeignKey(d => d.ProductLotId)
                    .HasConstraintName("FK_IssueNoteDetails_ProductLot");
            });

            modelBuilder.Entity<IventoryActivity>(entity =>
            {
                entity.HasKey(e => e.LogId)
                    .HasName("PK_Log");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.IventoryActivities)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Log_Users");
            });

            modelBuilder.Entity<NoteCheck>(entity =>
            {
                entity.HasOne(d => d.StorageRoom)
                    .WithMany(p => p.NoteChecks)
                    .HasForeignKey(d => d.StorageRoomId)
                    .HasConstraintName("FK_NoteCheck_StorageRooms");
            });

            modelBuilder.Entity<NoteCheckDetail>(entity =>
            {
                entity.HasOne(d => d.NoteCheck)
                    .WithMany(p => p.NoteCheckDetails)
                    .HasForeignKey(d => d.NoteCheckId)
                    .HasConstraintName("FK_NoteCheckDetails_NoteCheck");

                entity.HasOne(d => d.ProductLot)
                    .WithMany(p => p.NoteCheckDetails)
                    .HasForeignKey(d => d.ProductLotId)
                    .HasConstraintName("FK_NoteCheckDetails_ProductLot");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(d => d.AssignToNavigation)
                    .WithMany(p => p.OrderAssignToNavigations)
                    .HasForeignKey(d => d.AssignTo)
                    .HasConstraintName("FK_Orders_Users2");

                entity.HasOne(d => d.ConfirmedByNavigation)
                    .WithMany(p => p.OrderConfirmedByNavigations)
                    .HasForeignKey(d => d.ConfirmedBy)
                    .HasConstraintName("FK_Orders_Users");

                entity.HasOne(d => d.Customer)
                    .WithMany(p => p.OrderCustomers)
                    .HasForeignKey(d => d.CustomerId)
                    .HasConstraintName("FK_Orders_Users1");
            });

            modelBuilder.Entity<OrdersDetail>(entity =>
            {
                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrdersDetails)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_OrdersDetails_Orders");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.OrdersDetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_OrdersDetails_Products");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_Products_Categorys");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Products_Users");

                entity.HasOne(d => d.Unit)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.UnitId)
                    .HasConstraintName("FK_Products_Units");
            });

            modelBuilder.Entity<ProductLot>(entity =>
            {
                entity.HasOne(d => d.Lot)
                    .WithMany(p => p.ProductLots)
                    .HasForeignKey(d => d.LotId)
                    .HasConstraintName("FK_ProductLot_Lots");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductLots)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ProductLot_Products");

                entity.HasOne(d => d.StorageRoom)
                    .WithMany(p => p.ProductLots)
                    .HasForeignKey(d => d.StorageRoomId)
                    .HasConstraintName("FK_ProductLot_StorageRooms");
            });

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.PurchaseOrders)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_PurchaseOrders_Users");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.PurchaseOrders)
                    .HasForeignKey(d => d.SupplierId)
                    .HasConstraintName("FK_PurchaseOrders_Suppliers");
            });

            modelBuilder.Entity<PurchaseOrdersDetail>(entity =>
            {
                entity.HasOne(d => d.Product)
                    .WithMany(p => p.PurchaseOrdersDetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_PurchaseOrdersDetails_Products");

                entity.HasOne(d => d.PurchaseOrder)
                    .WithMany(p => p.PurchaseOrdersDetails)
                    .HasForeignKey(d => d.PurchaseOrderId)
                    .HasConstraintName("FK_PurchaseOrdersDetails_PurchaseOrders");
            });

            modelBuilder.Entity<ReceivedNote>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ReceivedNotes)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_ReceiveNotes_Users");

                entity.HasOne(d => d.PurchaseOrder)
                    .WithMany(p => p.ReceivedNotes)
                    .HasForeignKey(d => d.PurchaseOrderId)
                    .HasConstraintName("FK_ReceiveNotes_PurchaseOrders");
            });

            modelBuilder.Entity<ReceivedNoteDetail>(entity =>
            {
                entity.HasKey(e => e.ReceiveNoteDetailId)
                    .HasName("PK_ReceiveNoteDetails");

                entity.HasOne(d => d.ProductLot)
                    .WithMany(p => p.ReceivedNoteDetails)
                    .HasForeignKey(d => d.ProductLotId)
                    .HasConstraintName("FK_ReceiveNoteDetails_ProductLot");

                entity.HasOne(d => d.ReceiveNote)
                    .WithMany(p => p.ReceivedNoteDetails)
                    .HasForeignKey(d => d.ReceiveNoteId)
                    .HasConstraintName("FK_ReceivedNoteDetails_ReceivedNotes");
            });

            modelBuilder.Entity<StorageRoom>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.StorageRooms)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_StorageRooms_Users");
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Suppliers_Users");
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Units)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Units_Users");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.FirstName).IsFixedLength();

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .HasConstraintName("FK_Users_Roles");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
