import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  Button,
  Modal,
  Image,
  Input,
  DatePicker,
  Collapse,
  Form,
  InputNumber,
  Upload,
  Card,
  message,
  Row,
  Col,
  Dropdown,
  Carousel,
  Tooltip,
} from "antd";
import * as XLSX from "xlsx";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  UploadOutlined,
  MoreOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Option } = Select;

// Interfaces
interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unit: string;
  categoryName: string;
  description: string;
  sellingPrice: number;
  createdBy: number | null;
  createdDate: string | null;
  status: boolean;
  vat: number;
  storageconditions: number;
  weight: number;
  images: string[];
}

interface User {
  customerId: number;
  username: string;
  address: string;
  avatar?: string;
  roleName?: string;
}

interface ProductTableProps {
  PRODUCTS_DATA: Product[];
  handleChangePage: (page: string, productId?: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ PRODUCTS_DATA, handleChangePage }) => {
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<"list" | "edit">("list");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Map<number, User>>(new Map());

  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | string>("");
  const [maxPrice, setMaxPrice] = useState<number | string>("");
  const [createdByFilter, setCreatedByFilter] = useState<string>("");
  const [manufactureFilter, setManufactureFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // Sync original products with props and initialize filtered products
  useEffect(() => {
    const validProducts = PRODUCTS_DATA.filter((product) => product.productId != null);
    setOriginalProducts(validProducts);
    setFilteredProducts(validProducts);
  }, [PRODUCTS_DATA]);

  // Fetch user information for createdBy
  useEffect(() => {
    const fetchUsers = async () => {
      const userIds = Array.from(
        new Set(originalProducts.map((product) => product.createdBy).filter((id): id is number => id != null))
      );

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        return;
      }

      const newUsersMap = new Map<number, User>();
      for (const userId of userIds) {
        try {
          const response = await axios.get(`http://pharmadistiprobe.fun/api/User/GetUserById/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = response.data.data;
          newUsersMap.set(userId, {
            customerId: userId,
            username: userData.userName,
            address: userData.address || "Chưa có địa chỉ",
            avatar: userData.userAvatar,
            roleName: userData.roleName,
          });
        } catch (error) {
          console.error(`Failed to fetch user ${userId}:`, error);
        }
      }
      setUsersMap(newUsersMap);
    };

    if (originalProducts.length > 0) {
      fetchUsers();
    }
  }, [originalProducts]);

  // Row selection handler
  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
  };

  // Filter utilities
  const uniqueCreators = Array.from(
    new Set(
      originalProducts
        .map((product) => {
          const user = product.createdBy ? usersMap.get(product.createdBy) : null;
          return user ? user.username : "Không xác định";
        })
        .filter((username) => username !== "Không xác định")
    )
  );
  const uniqueManufacturers = Array.from(new Set(originalProducts.map((product) => product.manufactureName)));
  const uniqueCategories = Array.from(new Set(originalProducts.map((product) => product.categoryName)));

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // Filter products based on current filter states
  useEffect(() => {
    let filtered = [...originalProducts];

    if (searchTerm.trim()) {
      const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase());
      filtered = filtered.filter((product) =>
        removeVietnameseTones(product.productName.toLowerCase()).includes(normalizedSearch)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((product) => product.categoryName === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((product) => (statusFilter === "true" ? product.status : !product.status));
    }

    if (minPrice !== "" && !isNaN(Number(minPrice))) {
      filtered = filtered.filter((product) => product.sellingPrice >= Number(minPrice));
    }

    if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter((product) => product.sellingPrice <= Number(maxPrice));
    }

    if (createdByFilter) {
      filtered = filtered.filter((product) => {
        const user = product.createdBy ? usersMap.get(product.createdBy) : null;
        const username = user ? user.username : "Không xác định";
        return username === createdByFilter;
      });
    }

    if (manufactureFilter) {
      filtered = filtered.filter((product) => product.manufactureName === manufactureFilter);
    }

    if (dateRange) {
      filtered = filtered.filter((product) => {
        if (!product.createdDate) return false;
        const createdDate = new Date(product.createdDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    categoryFilter,
    statusFilter,
    minPrice,
    maxPrice,
    createdByFilter,
    manufactureFilter,
    dateRange,
    originalProducts,
    usersMap,
  ]);

  // Handle status change
  const handleStatusChange = (productId: number, newStatus: string) => {
    const updatedProducts = originalProducts.map((product) =>
      product.productId === productId ? { ...product, status: newStatus === "true" } : product
    );
    setOriginalProducts(updatedProducts);
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedProduct) {
      const updatedProducts = originalProducts.filter((product) => product.productId !== selectedProduct.productId);
      setOriginalProducts(updatedProducts);
      setFilteredProducts(updatedProducts); // Sync filtered products
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "DanhSachSanPham.xlsx");
  };

  // Print table
  const printTable = () => {
    const selectedProducts =
      selectedRowKeys.length > 0
        ? filteredProducts.filter((product) => selectedRowKeys.includes(product.productId))
        : filteredProducts;

    if (selectedProducts.length === 0) {
      message.warning("Không có sản phẩm nào được chọn để in.");
      return;
    }

    const printContents = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2>Danh sách sản phẩm</h2>
      </div>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Mã sản phẩm</th>
            <th>Danh mục thuốc</th>
            <th>Đơn vị</th>
            <th>Giá bán</th>
            <th>Thuế VAT</th>
            <th>Người tạo</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${selectedProducts
            .map(
              (product) => `
                <tr>
                  <td>${product.productName}</td>
                  <td>${product.productCode}</td>
                  <td>${product.categoryName || "Không có"}</td>
                  <td>${product.unit || "Không xác định"}</td>
                  <td>${product.sellingPrice?.toLocaleString() || "0"} VND</td>
                  <td>${product.vat}%</td>
                  <td>${product.createdBy ? usersMap.get(product.createdBy)?.username || "Không xác định" : "Không xác định"}</td>
                  <td>${product.status ? "Đang bán" : "Ngừng bán"}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "", "height=800,width=1000");
    if (printWindow) {
      printWindow.document.write("<html><head><title>In danh sách</title></head><body>");
      printWindow.document.write(printContents);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handle edit product page
  const handleEditProduct = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentPage("edit");
    const product = originalProducts.find((p) => p.productId === productId);
    if (product) {
      form.setFieldsValue({
        ...product,
        status: product.status.toString(), // Convert boolean to string for Select
      });
      setImagePreview(product.images && product.images.length > 0 ? product.images[0] : null);
    }
  };

  // Handle image change in edit form
  const handleImageChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được chọn tệp hình ảnh (JPG, PNG, JPEG)");
        return;
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Handle save edited product
  const handleSave = (values: any) => {
    if (selectedProductId !== null) {
      const updatedProducts = originalProducts.map((product) =>
        product.productId === selectedProductId
          ? { ...product, ...values, status: values.status === "true", images: imagePreview ? [imagePreview] : product.images }
          : product
      );
      setOriginalProducts(updatedProducts);
      setFilteredProducts(updatedProducts); // Sync filtered products
      message.success("Sản phẩm đã được cập nhật!");
      setCurrentPage("list");
      setSelectedProductId(null);
      setImagePreview(null); // Reset preview
    }
  };

  // Table columns
  const columns = [
    { title: "Mã sản phẩm", dataIndex: "productCode", key: "productCode" },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text: string, record: Product) => (
        <div className="flex items-center gap-3">
          <Image
            width={40}
            height={40}
            src={record.images && record.images.length > 0 ? record.images[0] : "/placeholder.png"}
            alt={text || "N/A"}
            fallback="/placeholder.png" // Fallback image
          />
          <Tooltip title={text || "N/A"} placement="top">
            <span
              style={{
                display: "inline-block",
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {text || "N/A"}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Danh mục thuốc",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text: string) => text || "Không có",
    },
    {
      title: "Giá bán",
      dataIndex: "sellingPrice",
      key: "sellingPrice",
      render: (price: number) => `${price ? price.toLocaleString() : "0"} VND`,
    },
    {
      title: "Thuế VAT",
      dataIndex: "vat",
      key: "vat",
      render: (vat: number) => `${vat}%`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: boolean, record: Product) => (
        <Select
          value={status.toString()}
          onChange={(value) => handleStatusChange(record.productId, value)}
          style={{ width: 120 }}
        >
          <Option value="true">Đang bán</Option>
          <Option value="false">Ngừng bán</Option>
        </Select>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (_: any, record: Product) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "view",
                label: "Xem chi tiết",
                icon: <EyeOutlined />,
                onClick: () => {
                  setSelectedProduct(record);
                  setIsDetailModalOpen(true);
                },
              },
              {
                key: "edit",
                label: "Chỉnh sửa",
                icon: <EditOutlined />,
                onClick: () => handleEditProduct(record.productId),
              },
              {
                key: "delete",
                label: "Xóa",
                icon: <DeleteOutlined />,
                onClick: () => {
                  setSelectedProduct(record);
                  setIsDeleteModalOpen(true);
                },
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Custom arrow buttons for Carousel
  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          color: "#fff",
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          lineHeight: "40px",
          textAlign: "center",
          fontSize: "20px",
          right: "10px",
        }}
        onClick={onClick}
      >
        <RightOutlined />
      </div>
    );
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          color: "#fff",
          background: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          lineHeight: "40px",
          textAlign: "center",
          fontSize: "20px",
          left: "10px",
          zIndex: 1,
        }}
        onClick={onClick}
      >
        <LeftOutlined />
      </div>
    );
  };

  // Render list page
  const renderListPage = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>
          Lọc
        </Button>
        <Button type="primary" onClick={() => handleChangePage("Tạo sản phẩm")}>
          + Tạo sản phẩm mới
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
        >
          Xuất Excel
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={printTable} style={{ marginLeft: 8 }}>
          In danh sách
        </Button>
      </div>

      {showFilters && (
        <Collapse defaultActiveKey={["1"]}>
          <Panel header="Bộ lọc nâng cao" key="1">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              <Select
                placeholder="Chọn danh mục"
                value={categoryFilter}
                onChange={setCategoryFilter}
                style={{ width: "100%" }}
              >
                <Option value="">Tất cả danh mục</Option>
                {uniqueCategories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Người tạo"
                value={createdByFilter}
                onChange={setCreatedByFilter}
                style={{ width: "100%" }}
              >
                <Option value="">Tất cả người tạo</Option>
                {uniqueCreators.map((creator) => (
                  <Option key={creator} value={creator}>
                    {creator}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Hãng sản xuất"
                value={manufactureFilter}
                onChange={setManufactureFilter}
                style={{ width: "100%" }}
              >
                <Option value="">Tất cả hãng sản xuất</Option>
                {uniqueManufacturers.map((manufacturer) => (
                  <Option key={manufacturer} value={manufacturer}>
                    {manufacturer}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Trạng thái"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="">Tất cả trạng thái</Option>
                <Option value="true">Đang bán</Option>
                <Option value="false">Ngừng bán</Option>
              </Select>
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo ngày tạo</span>
                <RangePicker
                  onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])}
                  style={{ width: "100%" }}
                />
              </div>
              <div className="col-span-3">
                <span style={{ marginRight: 8, marginBottom: 8 }}>Lọc theo giá bán</span>
                <Input.Group compact style={{ width: "100%" }}>
                  <Input
                    type="number"
                    placeholder="Giá từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ width: "50%" }}
                  />
                  <Input
                    type="number"
                    placeholder="đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ width: "50%" }}
                  />
                </Input.Group>
              </div>
              <div className="col-span-2">
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("");
                    setStatusFilter("");
                    setMinPrice("");
                    setMaxPrice("");
                    setCreatedByFilter("");
                    setManufactureFilter("");
                    setDateRange(null);
                    setFilteredProducts(originalProducts);
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                >
                  Xóa bộ lọc
                </Button>
              </div>
            </div>
          </Panel>
        </Collapse>
      )}

      <div id="printableArea">
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey={(record) => record.productId.toString()}
          rowSelection={{
            selectedRowKeys,
            onChange: handleRowSelectionChange,
          }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
      </Modal>

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal
          title="Chi tiết sản phẩm"
          open={isDetailModalOpen}
          onCancel={() => setIsDetailModalOpen(false)}
          footer={null}
          width={900}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <Carousel
                arrows
                prevArrow={<PrevArrow />}
                nextArrow={<NextArrow />}
                dots={true}
                style={{
                  background: "#f5f5f5",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {selectedProduct.images && selectedProduct.images.length > 0 ? (
                  selectedProduct.images.map((img, index) => (
                    <div key={index} className="flex justify-center items-center">
                      <Image
                        src={img}
                        alt={`${selectedProduct.productName} - ${index}`}
                        style={{
                          maxHeight: "350px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          margin: "0 auto",
                        }}
                        preview={false}
                        fallback="/placeholder.png"
                      />
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <Image
                      src="/placeholder.png"
                      alt="No image"
                      style={{
                        maxHeight: "350px",
                        maxWidth: "100%",
                        objectFit: "contain",
                        margin: "0 auto",
                      }}
                      preview={false}
                    />
                  </div>
                )}
              </Carousel>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedProduct.productName || "N/A"}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Mã sản phẩm:</strong> {selectedProduct.productCode || "N/A"}</p>
                  <p><strong>Hãng:</strong> {selectedProduct.manufactureName || "N/A"}</p>
                  <p><strong>Danh mục:</strong> {selectedProduct.categoryName || "Không có"}</p>
                  <p><strong>Đơn vị:</strong> {selectedProduct.unit || "Không xác định"}</p>
                  <p><strong>Giá bán:</strong> {selectedProduct.sellingPrice?.toLocaleString() || "0"} VND</p>
                  <p><strong>VAT:</strong> {selectedProduct.vat != null ? `${selectedProduct.vat}%` : "N/A"}</p>
                  <p><strong>Trọng lượng:</strong> {selectedProduct.weight != null ? `${selectedProduct.weight} kg` : "N/A"}</p>
                  <p><strong>Nhiệt độ bảo quản:</strong> {selectedProduct.storageconditions != null ? `${selectedProduct.storageconditions}°C` : "N/A"}</p>
                  <p><strong>Người tạo:</strong> {selectedProduct.createdBy ? usersMap.get(selectedProduct.createdBy)?.username || "Không xác định" : "Không xác định"}</p>
                  <p><strong>Trạng thái:</strong> {selectedProduct.status ? "Đang bán" : "Ngừng bán"}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Mô tả sản phẩm</h4>
                <p className="text-sm text-gray-600">{selectedProduct.description || "Không có mô tả"}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

  // Render edit page
  const renderEditPage = () => (
    <div className="p-6 flex justify-center">
      <Card title="Chỉnh sửa sản phẩm" className="w-full max-w-4xl">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã sản phẩm" name="productCode">
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Nhà cung cấp" name="manufactureName">
                <Input />
              </Form.Item>
              <Form.Item label="Đơn vị" name="unit">
                <Input />
              </Form.Item>
              <Form.Item label="Danh mục" name="categoryName">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá bán"
                name="sellingPrice"
                rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
              >
                <InputNumber className="w-full" min={0} addonAfter="VND" />
              </Form.Item>
              <Form.Item label="Thuế VAT" name="vat">
                <InputNumber className="w-full" min={0} max={100} addonAfter="%" />
              </Form.Item>
              <Form.Item label="Trọng lượng" name="weight">
                <InputNumber className="w-full" min={0} step={0.1} addonAfter="kg" />
              </Form.Item>
              <Form.Item label="Nhiệt độ bảo quản" name="storageconditions">
                <InputNumber className="w-full" min={0} addonAfter="°C" />
              </Form.Item>
              <Form.Item label="Trạng thái" name="status">
                <Select>
                  <Option value="true">Đang bán</Option>
                  <Option value="false">Ngừng bán</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item label="Ảnh sản phẩm">
            {imagePreview && <img src={imagePreview} alt="Product" className="mb-2 w-40 h-40 object-cover rounded-md" />}
            <Upload
              name="images"
              listType="picture"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <div className="flex gap-4">
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
              <Button
                onClick={() => {
                  setCurrentPage("list");
                  setSelectedProductId(null);
                  setImagePreview(null); // Reset preview when canceling
                }}
                danger
              >
                Hủy
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );

  return currentPage === "list" ? renderListPage() : renderEditPage();
};

export default ProductTable;