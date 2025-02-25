USE [SEP490_G74]
GO
/****** Object:  Table [dbo].[Categorys]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categorys](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Code] [nvarchar](50) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Categorys] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CheckDate]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CheckDate](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CheckedDate] [datetime] NULL,
	[Status] [int] NULL,
	[CreatedBy] [int] NULL,
	[NoteContent] [nvarchar](max) NULL,
 CONSTRAINT [PK_CheckDate] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IssueNoteDetails]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IssueNoteDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IssueNoteId] [int] NULL,
	[NoteNumber] [nvarchar](50) NULL,
	[ProductId] [int] NULL,
	[Quantity] [int] NULL,
	[UnitsPrice] [float] NULL,
	[ExpiredDate] [date] NULL,
	[ManufacturedDate] [date] NULL,
	[Status] [int] NULL,
 CONSTRAINT [PK_IssueNoteDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IssueNotes]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IssueNotes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NULL,
	[OrderId] [int] NULL,
	[CustomerId] [int] NULL,
	[Date] [datetime] NULL,
	[TotalAmount] [float] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[Status] [int] NULL,
 CONSTRAINT [PK_IssueNotes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Manufactures]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Manufactures](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NULL,
	[Name] [nvarchar](max) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Manufactures] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NoteCheck]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NoteCheck](
	[CheckDateId] [int] NULL,
	[ReceivedNoteDetailsId] [int] NULL,
	[DifferenceQuantity] [int] NULL,
	[ActualQuantity] [int] NULL,
	[CreatedBy] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderCode] [nvarchar](50) NULL,
	[CustomerId] [int] NULL,
	[Date] [date] NULL,
	[ExportDate?] [date] NULL,
	[TotalAmount] [float] NULL,
	[Status] [int] NULL,
	[DeliveryFee] [float] NULL,
	[Address] [nvarchar](max) NULL,
 CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrdersDetails]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrdersDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NULL,
	[ReceivedNoteDetailsId] [int] NULL,
	[Quantity] [int] NULL,
	[UnitsPrice] [float] NULL,
 CONSTRAINT [PK_OrdersDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductCode] [nvarchar](50) NULL,
	[ManufactureId] [int] NULL,
	[Name] [nvarchar](max) NULL,
	[UnitId] [int] NULL,
	[CategoryId] [int] NULL,
	[Description] [nvarchar](max) NULL,
	[SupplierId] [int] NULL,
	[ImportRetailPrice] [float] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[Status] [bit] NULL,
	[Image] [nvarchar](max) NULL,
	[VAT] [float] NULL,
	[Storageconditions] [int] NULL,
 CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProductStorageRooms]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProductStorageRooms](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoomId] [int] NULL,
	[ReceivedNoteDetailsId] [int] NULL,
 CONSTRAINT [PK_ProductStorageRooms] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrders]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderDetail] [nvarchar](max) NULL,
	[SupplierId] [int] NULL,
	[Date] [date] NULL,
	[ExportDate?] [date] NULL,
	[TotalAmount] [float] NULL,
	[Status] [int] NULL,
	[DeliveryFee] [float] NULL,
	[Address] [nvarchar](max) NULL,
 CONSTRAINT [PK_PurchaseOrders] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PurchaseOrdersDetails]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PurchaseOrdersDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PurchaseOrderId] [int] NULL,
	[ProductId] [int] NULL,
	[Quantity] [int] NULL,
	[UnitsPrice] [float] NULL,
 CONSTRAINT [PK_PurchaseOrdersDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReceiveNoteDetails]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReceiveNoteDetails](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[NoteNumber] [nvarchar](50) NULL,
	[ProductId] [int] NULL,
	[Quantity] [int] NULL,
	[UnitsPrice] [int] NULL,
	[ManufacturedDate] [date] NULL,
	[ExpiredDate] [date] NULL,
	[Status] [int] NULL,
	[ReceivedDate] [date] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
	[CheckedDate] [datetime] NULL,
 CONSTRAINT [PK_ReceiveNoteDetails] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ReceiveNotes]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ReceiveNotes](
	[Id] [int] NULL,
	[Code] [nvarchar](50) NULL,
	[OrderId] [int] NULL,
	[SupplierId] [int] NULL,
	[Date] [datetime] NULL,
	[TotalAmount] [float] NULL,
	[Status] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Roles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[StorageRooms]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[StorageRooms](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](50) NULL,
	[Name] [nvarchar](50) NULL,
	[Humidity] [float] NULL,
	[Temperature] [float] NULL,
	[Quantity] [int] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_StorageRoom] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Suppliers]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Suppliers](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Code] [nvarchar](50) NULL,
	[Address] [nvarchar](max) NULL,
	[Phone] [nvarchar](50) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Supplier] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Units]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Units](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Units] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2/17/2025 11:21:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [nvarchar](50) NULL,
	[FirstName] [nchar](10) NULL,
	[LastName] [nvarchar](50) NULL,
	[Phone] [nvarchar](50) NULL,
	[Email] [nvarchar](255) NULL,
	[Password] [nvarchar](50) NULL,
	[Age] [int] NULL,
	[Avatar] [nvarchar](255) NULL,
	[Address] [nvarchar](255) NULL,
	[RoleId] [int] NULL,
	[EmployeeCode] [nvarchar](50) NULL,
	[TaxCode] [nvarchar](50) NULL,
	[Status] [bit] NULL,
	[CreatedBy] [int] NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Suppliers] ON 

INSERT [dbo].[Suppliers] ([Id], [Name], [Code], [Address], [Phone], [CreatedBy], [CreatedDate]) VALUES (1, N'Công ty Dược phẩm Traphaco', NULL, N'75 Yên Ninh, Phường Quán Thánh, Quận Ba Đình, TP. Hà Nội', N'0883722332', NULL, NULL)
INSERT [dbo].[Suppliers] ([Id], [Name], [Code], [Address], [Phone], [CreatedBy], [CreatedDate]) VALUES (2, N'Công ty TNHH Sanofi – Aventis Việt Nam', NULL, N'Số 10 Hàm Nghi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', N'0933234323', NULL, NULL)
INSERT [dbo].[Suppliers] ([Id], [Name], [Code], [Address], [Phone], [CreatedBy], [CreatedDate]) VALUES (3, N'Công ty CP Dược – Trang thiết bị y tế Bình Định', NULL, N'498 Nguyễn Thái Học, Phường Quang Trung, TP. Quy Nhơn, Tỉnh Bình Định', N'0982234221', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Suppliers] OFF
GO
ALTER TABLE [dbo].[Categorys]  WITH CHECK ADD  CONSTRAINT [FK_Categorys_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Categorys] CHECK CONSTRAINT [FK_Categorys_Users]
GO
ALTER TABLE [dbo].[CheckDate]  WITH CHECK ADD  CONSTRAINT [FK_CheckDate_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[CheckDate] CHECK CONSTRAINT [FK_CheckDate_Users]
GO
ALTER TABLE [dbo].[IssueNoteDetails]  WITH CHECK ADD  CONSTRAINT [FK_IssueNoteDetails_IssueNotes] FOREIGN KEY([IssueNoteId])
REFERENCES [dbo].[IssueNotes] ([Id])
GO
ALTER TABLE [dbo].[IssueNoteDetails] CHECK CONSTRAINT [FK_IssueNoteDetails_IssueNotes]
GO
ALTER TABLE [dbo].[IssueNoteDetails]  WITH CHECK ADD  CONSTRAINT [FK_IssueNoteDetails_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[IssueNoteDetails] CHECK CONSTRAINT [FK_IssueNoteDetails_Products]
GO
ALTER TABLE [dbo].[IssueNoteDetails]  WITH CHECK ADD  CONSTRAINT [FK_IssueNoteDetails_Products1] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[IssueNoteDetails] CHECK CONSTRAINT [FK_IssueNoteDetails_Products1]
GO
ALTER TABLE [dbo].[IssueNotes]  WITH CHECK ADD  CONSTRAINT [FK_IssueNotes_Users1] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[IssueNotes] CHECK CONSTRAINT [FK_IssueNotes_Users1]
GO
ALTER TABLE [dbo].[Manufactures]  WITH CHECK ADD  CONSTRAINT [FK_Manufactures_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Manufactures] CHECK CONSTRAINT [FK_Manufactures_Users]
GO
ALTER TABLE [dbo].[Manufactures]  WITH CHECK ADD  CONSTRAINT [FK_Manufactures_Users1] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Manufactures] CHECK CONSTRAINT [FK_Manufactures_Users1]
GO
ALTER TABLE [dbo].[NoteCheck]  WITH CHECK ADD  CONSTRAINT [FK_NoteCheck_CheckDate] FOREIGN KEY([CheckDateId])
REFERENCES [dbo].[CheckDate] ([Id])
GO
ALTER TABLE [dbo].[NoteCheck] CHECK CONSTRAINT [FK_NoteCheck_CheckDate]
GO
ALTER TABLE [dbo].[NoteCheck]  WITH CHECK ADD  CONSTRAINT [FK_NoteCheck_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[NoteCheck] CHECK CONSTRAINT [FK_NoteCheck_Users]
GO
ALTER TABLE [dbo].[NoteCheck]  WITH CHECK ADD  CONSTRAINT [FK_NoteCheck_Users1] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[NoteCheck] CHECK CONSTRAINT [FK_NoteCheck_Users1]
GO
ALTER TABLE [dbo].[OrdersDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrdersDetails_Orders] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[OrdersDetails] CHECK CONSTRAINT [FK_OrdersDetails_Orders]
GO
ALTER TABLE [dbo].[OrdersDetails]  WITH CHECK ADD  CONSTRAINT [FK_OrdersDetails_Products] FOREIGN KEY([ReceivedNoteDetailsId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[OrdersDetails] CHECK CONSTRAINT [FK_OrdersDetails_Products]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Categorys] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categorys] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Categorys]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Manufactures] FOREIGN KEY([ManufactureId])
REFERENCES [dbo].[Manufactures] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Manufactures]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Suppliers] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[Suppliers] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Suppliers]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Units] FOREIGN KEY([UnitId])
REFERENCES [dbo].[Units] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Units]
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD  CONSTRAINT [FK_Products_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Products] CHECK CONSTRAINT [FK_Products_Users]
GO
ALTER TABLE [dbo].[ProductStorageRooms]  WITH CHECK ADD  CONSTRAINT [FK_ProductStorageRooms_StorageRooms] FOREIGN KEY([RoomId])
REFERENCES [dbo].[StorageRooms] ([Id])
GO
ALTER TABLE [dbo].[ProductStorageRooms] CHECK CONSTRAINT [FK_ProductStorageRooms_StorageRooms]
GO
ALTER TABLE [dbo].[PurchaseOrders]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrders_Suppliers] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[Suppliers] ([Id])
GO
ALTER TABLE [dbo].[PurchaseOrders] CHECK CONSTRAINT [FK_PurchaseOrders_Suppliers]
GO
ALTER TABLE [dbo].[PurchaseOrdersDetails]  WITH CHECK ADD  CONSTRAINT [FK_PurchaseOrdersDetails_PurchaseOrders] FOREIGN KEY([PurchaseOrderId])
REFERENCES [dbo].[PurchaseOrders] ([Id])
GO
ALTER TABLE [dbo].[PurchaseOrdersDetails] CHECK CONSTRAINT [FK_PurchaseOrdersDetails_PurchaseOrders]
GO
ALTER TABLE [dbo].[ReceiveNoteDetails]  WITH CHECK ADD  CONSTRAINT [FK_ReceiveNoteDetails_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[ReceiveNoteDetails] CHECK CONSTRAINT [FK_ReceiveNoteDetails_Products]
GO
ALTER TABLE [dbo].[ReceiveNoteDetails]  WITH CHECK ADD  CONSTRAINT [FK_ReceiveNoteDetails_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[ReceiveNoteDetails] CHECK CONSTRAINT [FK_ReceiveNoteDetails_Users]
GO
ALTER TABLE [dbo].[ReceiveNotes]  WITH CHECK ADD  CONSTRAINT [FK_ReceiveNotes_Orders] FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([Id])
GO
ALTER TABLE [dbo].[ReceiveNotes] CHECK CONSTRAINT [FK_ReceiveNotes_Orders]
GO
ALTER TABLE [dbo].[ReceiveNotes]  WITH CHECK ADD  CONSTRAINT [FK_ReceiveNotes_ReceiveNoteDetails] FOREIGN KEY([Id])
REFERENCES [dbo].[ReceiveNoteDetails] ([Id])
GO
ALTER TABLE [dbo].[ReceiveNotes] CHECK CONSTRAINT [FK_ReceiveNotes_ReceiveNoteDetails]
GO
ALTER TABLE [dbo].[ReceiveNotes]  WITH CHECK ADD  CONSTRAINT [FK_ReceiveNotes_Suppliers] FOREIGN KEY([SupplierId])
REFERENCES [dbo].[Suppliers] ([Id])
GO
ALTER TABLE [dbo].[ReceiveNotes] CHECK CONSTRAINT [FK_ReceiveNotes_Suppliers]
GO
ALTER TABLE [dbo].[ReceiveNotes]  WITH CHECK ADD  CONSTRAINT [FK_ReceiveNotes_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[ReceiveNotes] CHECK CONSTRAINT [FK_ReceiveNotes_Users]
GO
ALTER TABLE [dbo].[Roles]  WITH CHECK ADD  CONSTRAINT [FK_Roles_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Roles] CHECK CONSTRAINT [FK_Roles_Users]
GO
ALTER TABLE [dbo].[StorageRooms]  WITH CHECK ADD  CONSTRAINT [FK_StorageRooms_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[StorageRooms] CHECK CONSTRAINT [FK_StorageRooms_Users]
GO
ALTER TABLE [dbo].[Suppliers]  WITH CHECK ADD  CONSTRAINT [FK_Suppliers_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Suppliers] CHECK CONSTRAINT [FK_Suppliers_Users]
GO
ALTER TABLE [dbo].[Units]  WITH CHECK ADD  CONSTRAINT [FK_Units_Users] FOREIGN KEY([CreatedBy])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Units] CHECK CONSTRAINT [FK_Units_Users]
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD  CONSTRAINT [FK_Users_Roles] FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([Id])
GO
ALTER TABLE [dbo].[Users] CHECK CONSTRAINT [FK_Users_Roles]
GO
