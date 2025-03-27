import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Image, Input, DatePicker, Collapse } from "antd";
const { RangePicker } = DatePicker;
const { Panel } = Collapse;
import { EyeOutlined, EditOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import ProductDetailsModal from "./ProductDetail";

interface Product {
  ProductId: number;
  ProductCode: string;
  ManufactureName: string;
  ProductName: string;
  UnitId: number;
  CategoryId: number;
  Description: string;
  SellingPrice: number;
  CreatedBy: string;
  CreatedDate: string;
  Status: string;
  VAT: number;
  StorageConditions: string;
  Weight: number;
  Image?: string;
  CategoryName?: string;
  SubCategoryName?: string;
  UnitName?: string;
}

interface ProductTableProps {
  PRODUCTS_DATA: Product[];
  handleChangePage: (page: string, productId?: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ PRODUCTS_DATA, handleChangePage }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | string>("");
  const [maxPrice, setMaxPrice] = useState<number | string>("");
  const [createdByFilter, setCreatedByFilter] = useState<string>("");
  const [manufactureFilter, setManufactureFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // Filter products based on filter criteria

  const uniqueCreators = Array.from(new Set(PRODUCTS_DATA.map(product => product.CreatedBy)));
  const uniqueManufacturers = Array.from(new Set(PRODUCTS_DATA.map(product => product.ManufactureName)));

  const uniqueCategories = Array.from(new Set(PRODUCTS_DATA.map(product => product.SubCategoryName)));

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD") // Tách dấu ra khỏi ký tự gốc
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thành 'd'
      .replace(/Đ/g, "D") // Thay thế 'Đ' thành 'D'
      .toLowerCase(); // Chuyển về chữ thường
  };
  const filterProducts = () => {
    let filteredProducts = [...PRODUCTS_DATA];

    if (searchTerm.trim()) {
      const normalizedSearch = removeVietnameseTones(searchTerm.toLowerCase());
      filteredProducts = filteredProducts.filter((product) => 
        removeVietnameseTones(product.ProductName.toLowerCase()).includes(normalizedSearch)
      );
    }

    if (categoryFilter) {
      filteredProducts = filteredProducts.filter((product) => product.SubCategoryName === categoryFilter);
    }

    if (statusFilter) {
      filteredProducts = filteredProducts.filter((product) => product.Status === statusFilter);
    }

    if (minPrice !== "" && !isNaN(Number(minPrice))) {
      filteredProducts = filteredProducts.filter((product) => product.SellingPrice >= Number(minPrice));
    }

    if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
      filteredProducts = filteredProducts.filter((product) => product.SellingPrice <= Number(maxPrice));
    }
    if (createdByFilter) {
      filteredProducts = filteredProducts.filter((product) => product.CreatedBy === createdByFilter);
    }

    if (manufactureFilter) {
      filteredProducts = filteredProducts.filter((product) => product.ManufactureName === manufactureFilter);
    }

    if (dateRange) {
      filteredProducts = filteredProducts.filter((product) => {
        const createdDate = new Date(product.CreatedDate);
        return createdDate >= new Date(dateRange[0]) && createdDate <= new Date(dateRange[1]);
      });
    }

    setProducts(filteredProducts);
  };

  // Effect to apply filters when filter criteria changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, statusFilter, minPrice, maxPrice]);

  const handleStatusChange = (productId: number, newStatus: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.ProductId === productId ? { ...product, Status: newStatus } : product
      )
    );
  };

  const handleDelete = () => {
    if (selectedProduct) {
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.ProductId !== selectedProduct.ProductId)
      );
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "ProductName",
      key: "ProductName",
      render: (text: string, record: Product) => (
        <div className="flex items-center gap-3">
          <Image width={40} height={40} src={record.Image || "/placeholder.png"} alt={text} />
          <span>{text || "N/A"}</span>
        </div>
      ),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "ProductCode",
      key: "ProductCode",
    },
    {
      title: "Danh mục thuốc",
      dataIndex: "SubCategoryName",
      key: "SubCategoryName",
      render: (text: string) => text || "Không có",
    },
    {
      title: "Đơn vị",
      dataIndex: "UnitName",
      key: "UnitName",
      render: (text: string) => text || "Không xác định",
    },
    {
      title: "Giá bán",
      dataIndex: "SellingPrice",
      key: "SellingPrice",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Thuế VAT",
      dataIndex: "VAT",
      key: "VAT",
      render: (vat: number) => `${vat}%`,
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status: string, record: Product) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.ProductId, value)}
          style={{ width: 120 }}
        >
          <Select.Option value="Đang bán">Đang bán</Select.Option>
          <Select.Option value="Ngừng bán">Ngừng bán</Select.Option>
        </Select>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Product) => (
        <div className="flex space-x-2">
          <Button icon={<EyeOutlined />} onClick={() => { setSelectedProduct(record); setIsOpen(true); }} />
          <Button icon={<EditOutlined />} onClick={() => handleChangePage("Chỉnh sửa sản phẩm", record.ProductId)} />
          <Button danger icon={<DeleteOutlined />} onClick={() => { setSelectedProduct(record); setIsDeleteModalOpen(true); }} />
        </div>
      ),
    },
  ];
  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, statusFilter, minPrice, maxPrice, createdByFilter, manufactureFilter, dateRange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input placeholder="Tìm kiếm theo tên sản phẩm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 200 }} />
        <Button icon={<FilterOutlined />} onClick={() => setShowFilters(!showFilters)}>Lọc</Button>
      </div>

      {showFilters && (
        <Collapse defaultActiveKey={["1"]}>
        <Panel header="Bộ lọc nâng cao" key="1">
          <div className="grid grid-cols-3 gap-4">
            <Select placeholder="Chọn danh mục" value={categoryFilter} onChange={setCategoryFilter} style={{ width: "100%" }}>
              <Select.Option value="">Tất cả danh mục</Select.Option>
              {uniqueCategories.map((subCategory) => (
                <Select.Option key={subCategory} value={subCategory}>{subCategory}</Select.Option>
              ))}
            </Select>
      
            <Select placeholder="Người tạo" value={createdByFilter} onChange={setCreatedByFilter} style={{ width: "100%" }}>
              <Select.Option value="">Tất cả</Select.Option>
              {uniqueCreators.map((creator) => (
                <Select.Option key={creator} value={creator}>{creator}</Select.Option>
              ))}
            </Select>
      
            <Select placeholder="Hãng sản xuất" value={manufactureFilter} onChange={setManufactureFilter} style={{ width: "100%" }}>
              <Select.Option value="">Tất cả</Select.Option>
              {uniqueManufacturers.map((manufacturer) => (
                <Select.Option key={manufacturer} value={manufacturer}>{manufacturer}</Select.Option>
              ))}
            </Select>
      
            <RangePicker onChange={(_, dateStrings) => setDateRange(dateStrings as [string, string])} />
            {/* dates */}
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="Đang bán">Đang bán</Select.Option>
              <Select.Option value="Ngừng bán">Ngừng bán</Select.Option>
            </Select>
      
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
      
            {/* Nút Xóa bộ lọc */}
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
              }}
              style={{ width: "100%", marginTop: "10px" }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </Panel>
      </Collapse>
      
      )}

      <Table columns={columns} dataSource={products} rowKey="ProductId" />

      {/* Modal xác nhận xóa */}
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

      {/* Modal chi tiết sản phẩm */}
      <ProductDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={selectedProduct} // Truyền selectedProduct vào đây
      />
    </div>
  );
};

export default ProductTable;
