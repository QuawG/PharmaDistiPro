import React, { useState, useEffect } from "react";
import { Table, Select, Button, Modal, Image, Input } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | string>("");
  const [maxPrice, setMaxPrice] = useState<number | string>("");

  // Filter products based on filter criteria

  const uniqueCategories = Array.from(new Set(PRODUCTS_DATA.map(product => product.SubCategoryName)));
  const filterProducts = () => {
    let filteredProducts = [...PRODUCTS_DATA];

    if (searchTerm.trim()) {
      filteredProducts = filteredProducts.filter((product) =>
        product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
         <Select
          placeholder="Chọn danh mục"
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value)}
          style={{ width: 200 }}
        >
          <Select.Option value="">Tất cả danh mục</Select.Option>
          {uniqueCategories.map((subCategory) => (
            <Select.Option key={subCategory} value={subCategory}>
              {subCategory}
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Chọn trạng thái"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          style={{ width: 200 }}
        >
          <Select.Option value="">Tất cả trạng thái</Select.Option>
          <Select.Option value="Đang bán">Đang bán</Select.Option>
          <Select.Option value="Ngừng bán">Ngừng bán</Select.Option>
        </Select>
        <Input
          type="number"
          placeholder="Giá tối thiểu"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: 150 }}
        />
        
        <Input
          type="number"
          placeholder="Giá tối đa"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 150 }}
        />
      </div>

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
