import React, { useState, useEffect } from "react";
import { Form, Select, Button, Table, message, InputNumber, Input } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

interface Supplier {
  id: number;
  supplierName: string;
  supplierCode: string;
  supplierAddress: string;
  supplierPhone: string;
  status: boolean;
  createdBy: number;
  createdDate: string;
}

interface Product {
  productId: number;
  productCode: string;
  manufactureName: string;
  productName: string;
  unit: string;
  categoryName: string;
  description: string;
  sellingPrice: number;
  createdBy: number;
  createdDate: string | null;
  status: boolean;
  vat: number;
  storageconditions: number;
  weight: number;
  images: string[];
}

interface SelectedProduct {
  id: number;
  name: string;
  quantity: number;
  price: number; // Để hiển thị trên giao diện
  tax: number;   // Để tính totalAmount
  totalPrice: number; // Để tính totalAmount
}

const PurchaseOrderModal: React.FC = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("accessToken") || "your-default-token";

      try {
        const supplierResponse = await axios.get("http://pharmadistiprobe.fun/api/Supplier/GetSupplierList", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách nhà cung cấp từ API:", supplierResponse.data);
        setSuppliers(supplierResponse.data.data || []);

        const productResponse = await axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Danh sách sản phẩm từ API:", productResponse.data);
        setProducts(productResponse.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        message.error("Không thể tải danh sách nhà cung cấp hoặc sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddProduct = (product: Product) => {
    if (!selectedSupplier) {
      message.error("Vui lòng chọn nhà cung cấp trước!");
      return;
    }
    const totalPrice = quantity * product.sellingPrice * (1 + product.vat / 100);
    setSelectedProducts((prev) => [
      ...prev,
      {
        id: product.productId,
        name: product.productName,
        quantity,
        price: product.sellingPrice,
        tax: product.vat,
        totalPrice,
      },
    ]);
    setSearchTerm("");
    setQuantity(1);
  };

  const handleQuantityChange = (id: number, newQuantity: number | null) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: newQuantity || 1,
              totalPrice: (newQuantity || 1) * product.price * (1 + product.tax / 100),
            }
          : product
      )
    );
  };

  const handleDeleteProduct = (id: number) => {
    setSelectedProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const totalAmount = selectedProducts.reduce((sum, product) => sum + product.totalPrice, 0);

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const columns = [
    { title: "Sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: SelectedProduct) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleQuantityChange(record.id, value)}
          className="w-20"
        />
      ),
    },
    // {
    //   title: "Giá nhập",
    //   dataIndex: "price",
    //   key: "price",
    //   render: (price: number) => formatCurrency(price),
    // },
    { title: "Thuế (%)", dataIndex: "tax", key: "tax" },
    // {
    //   title: "Tổng giá",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   render: (totalPrice: number) => formatCurrency(totalPrice),
    // },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: SelectedProduct) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteProduct(record.id)}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    if (!selectedSupplier) {
      message.error("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (selectedProducts.length === 0) {
      message.error("Vui lòng thêm ít nhất một sản phẩm!");
      return;
    }

    const purchaseOrderData = {
      supplierId: selectedSupplier.id,
      totalAmount,
      purchaseOrdersDetails: selectedProducts.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
      })),
    };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://pharmadistiprobe.fun/api/PurchaseOrders/CreatePurchaseOrders",
        purchaseOrderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Phản hồi từ API:", response.data);
      message.success(`Đơn hàng ${response.data.data.purchaseOrderCode} đã được tạo thành công!`);
      form.resetFields();
      setSelectedProducts([]);
      setSelectedSupplier(null);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      message.error("Tạo đơn hàng thất bại!");
    }
  };

  return (
    <div className="p-6 mt-[60px] w-full bg-[#fafbfe]">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tạo đơn đặt hàng (PO)</h1>
        <p className="text-sm text-gray-500">Tạo đơn đặt hàng mới</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              label="Nhà cung cấp"
              name="supplier"
              rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
            >
              <Select
                showSearch
                placeholder="Chọn nhà cung cấp"
                loading={loading}
                onChange={(value) => {
                  const supplier = suppliers.find((s) => s.id === value) || null;
                  setSelectedSupplier(supplier);
                }}
                filterOption={(input, option) =>
                  removeVietnameseTones(option?.children?.toString() || "").includes(
                    removeVietnameseTones(input)
                  )
                }
                notFoundContent={suppliers.length === 0 ? "Không có dữ liệu" : null}
              >
                {suppliers.map((supplier) => (
                  <Select.Option key={supplier.id} value={supplier.id}>
                    {supplier.supplierName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Tổng số tiền" name="totalAmount">
              <Input value={formatCurrency(totalAmount)} disabled />
            </Form.Item>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Thêm sản phẩm</h2>
            <div className="flex gap-4 mb-4">
              <Select
                showSearch
                value={searchTerm}
                onSearch={handleSearchChange}
                onChange={(value) => {
                  const product = products.find((p) => p.productName === value);
                  if (product) handleAddProduct(product);
                }}
                placeholder="Tìm kiếm sản phẩm"
                style={{ width: 200 }}
                loading={loading}
                filterOption={(input, option) =>
                  removeVietnameseTones(option?.children?.toString() || "").includes(
                    removeVietnameseTones(input)
                  )
                }
                notFoundContent={products.length === 0 ? "Không có dữ liệu" : null}
              >
                {products.map((product) => (
                  <Select.Option key={product.productId} value={product.productName}>
                    {product.productName}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <Table
              columns={columns}
              dataSource={selectedProducts}
              rowKey="id"
              pagination={false}
              bordered
            />
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={() => form.resetFields()}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PurchaseOrderModal;