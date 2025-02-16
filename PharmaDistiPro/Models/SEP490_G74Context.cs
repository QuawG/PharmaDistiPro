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
        public virtual DbSet<CheckDate> CheckDates { get; set; } = null!;
        public virtual DbSet<IssueNote> IssueNotes { get; set; } = null!;
        public virtual DbSet<IssueNoteDetail> IssueNoteDetails { get; set; } = null!;
        public virtual DbSet<Manufacture> Manufactures { get; set; } = null!;
        public virtual DbSet<NoteCheck> NoteChecks { get; set; } = null!;
        public virtual DbSet<Order> Orders { get; set; } = null!;
        public virtual DbSet<OrdersDetail> OrdersDetails { get; set; } = null!;
        public virtual DbSet<Product> Products { get; set; } = null!;
        public virtual DbSet<ProductStorageRoom> ProductStorageRooms { get; set; } = null!;
        public virtual DbSet<PurchaseOrder> PurchaseOrders { get; set; } = null!;
        public virtual DbSet<PurchaseOrdersDetail> PurchaseOrdersDetails { get; set; } = null!;
        public virtual DbSet<ReceiveNote> ReceiveNotes { get; set; } = null!;
        public virtual DbSet<ReceiveNoteDetail> ReceiveNoteDetails { get; set; } = null!;
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
                optionsBuilder.UseSqlServer("server =(local); database = SEP490_G74;uid=sa;pwd=123;TrustServerCertificate=true");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Categories)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Categorys_Users");
            });

            modelBuilder.Entity<CheckDate>(entity =>
            {
                entity.ToTable("CheckDate");

                entity.Property(e => e.CheckedDate).HasColumnType("datetime");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.CheckDates)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_CheckDate_Users");
            });

            modelBuilder.Entity<IssueNote>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.IssueNotes)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_IssueNotes_Users1");
            });

            modelBuilder.Entity<IssueNoteDetail>(entity =>
            {
                entity.Property(e => e.ExpiredDate).HasColumnType("date");

                entity.Property(e => e.ManufacturedDate).HasColumnType("date");

                entity.Property(e => e.NoteNumber).HasMaxLength(50);

                entity.HasOne(d => d.IssueNote)
                    .WithMany(p => p.IssueNoteDetails)
                    .HasForeignKey(d => d.IssueNoteId)
                    .HasConstraintName("FK_IssueNoteDetails_IssueNotes");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.IssueNoteDetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_IssueNoteDetails_Products");
            });

            modelBuilder.Entity<Manufacture>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(255);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Manufactures)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Manufactures_Users");
            });

            modelBuilder.Entity<NoteCheck>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("NoteCheck");

                entity.HasOne(d => d.CheckDate)
                    .WithMany()
                    .HasForeignKey(d => d.CheckDateId)
                    .HasConstraintName("FK_NoteCheck_CheckDate");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_NoteCheck_Users");
            });

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ExportDate)
                    .HasColumnType("date")
                    .HasColumnName("ExportDate?");

                entity.Property(e => e.OrderCode).HasMaxLength(50);
            });

            modelBuilder.Entity<OrdersDetail>(entity =>
            {
                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrdersDetails)
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_OrdersDetails_Orders");

                entity.HasOne(d => d.ReceivedNoteDetails)
                    .WithMany(p => p.OrdersDetails)
                    .HasForeignKey(d => d.ReceivedNoteDetailsId)
                    .HasConstraintName("FK_OrdersDetails_Products");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ProductCode).HasMaxLength(50);

                entity.Property(e => e.Vat).HasColumnName("VAT");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("FK_Products_Categorys");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Products_Users");

                entity.HasOne(d => d.Manufacture)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.ManufactureId)
                    .HasConstraintName("FK_Products_Manufactures");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.SupplierId)
                    .HasConstraintName("FK_Products_Suppliers");

                entity.HasOne(d => d.Unit)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.UnitId)
                    .HasConstraintName("FK_Products_Units");
            });

            modelBuilder.Entity<ProductStorageRoom>(entity =>
            {
                entity.HasOne(d => d.Room)
                    .WithMany(p => p.ProductStorageRooms)
                    .HasForeignKey(d => d.RoomId)
                    .HasConstraintName("FK_ProductStorageRooms_StorageRooms");
            });

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ExportDate)
                    .HasColumnType("date")
                    .HasColumnName("ExportDate?");

                entity.HasOne(d => d.Supplier)
                    .WithMany(p => p.PurchaseOrders)
                    .HasForeignKey(d => d.SupplierId)
                    .HasConstraintName("FK_PurchaseOrders_Suppliers");
            });

            modelBuilder.Entity<PurchaseOrdersDetail>(entity =>
            {
                entity.HasOne(d => d.PurchaseOrder)
                    .WithMany(p => p.PurchaseOrdersDetails)
                    .HasForeignKey(d => d.PurchaseOrderId)
                    .HasConstraintName("FK_PurchaseOrdersDetails_PurchaseOrders");
            });

            modelBuilder.Entity<ReceiveNote>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_ReceiveNotes_Users");

                entity.HasOne(d => d.IdNavigation)
                    .WithMany()
                    .HasForeignKey(d => d.Id)
                    .HasConstraintName("FK_ReceiveNotes_ReceiveNoteDetails");

                entity.HasOne(d => d.Order)
                    .WithMany()
                    .HasForeignKey(d => d.OrderId)
                    .HasConstraintName("FK_ReceiveNotes_Orders");

                entity.HasOne(d => d.Supplier)
                    .WithMany()
                    .HasForeignKey(d => d.SupplierId)
                    .HasConstraintName("FK_ReceiveNotes_Suppliers");
            });

            modelBuilder.Entity<ReceiveNoteDetail>(entity =>
            {
                entity.Property(e => e.CheckedDate).HasColumnType("datetime");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.ExpiredDate).HasColumnType("date");

                entity.Property(e => e.ManufacturedDate).HasColumnType("date");

                entity.Property(e => e.NoteNumber).HasMaxLength(50);

                entity.Property(e => e.ReceivedDate).HasColumnType("date");

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.ReceiveNoteDetails)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_ReceiveNoteDetails_Users");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ReceiveNoteDetails)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ReceiveNoteDetails_Products");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Roles)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Roles_Users");
            });

            modelBuilder.Entity<StorageRoom>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.StorageRooms)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_StorageRooms_Users");
            });

            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Phone).HasMaxLength(50);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Suppliers)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Suppliers_Users");
            });

            modelBuilder.Entity<Unit>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Units)
                    .HasForeignKey(d => d.CreatedBy)
                    .HasConstraintName("FK_Units_Users");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Address).HasMaxLength(255);

                entity.Property(e => e.Avatar).HasMaxLength(255);

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(255);

                entity.Property(e => e.EmployeeCode).HasMaxLength(50);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.LastName).HasMaxLength(50);

                entity.Property(e => e.Password).HasMaxLength(50);

                entity.Property(e => e.Phone).HasMaxLength(50);

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
