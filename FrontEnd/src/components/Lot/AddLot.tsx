import React, { useState } from "react";
import { Button, Input, Select, Table, message, Space, Form } from "antd";
import { PRODUCTS_DATA } from "../data/product";

interface AddLotProps {
  handleChangePage: (page: string) => void;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: string;
  quantity: number;
  manufacturedDate: string;
  expiredDate: string;
  status?: string;
}

const AddLot: React.FC<AddLotProps> = ({ handleChangePage }) => {
  const [lotNumber, setLotNumber] = useState<string>("");
  const [status] = useState<string>("Đang chờ");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [error, setError] = useState<string>("");

  const productOptions = PRODUCTS_DATA.map((p) => ({
    value: String(p.ProductId),
    label: p.ProductName,
  }));

  const handleSelectProduct = (value: string) => {
    const product = PRODUCTS_DATA.find((p) => String(p.ProductId) === value);
    if (product && !selectedProducts.some((p) => p.id === String(product.ProductId))) {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: String(product.ProductId),
          name: product.ProductName,
          price: "",
          quantity: 0,
          manufacturedDate: "",
          expiredDate: "",
          status: "Đã hết hàng",
        },
      ]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!lotNumber.trim()) {
      setError("Vui lòng nhập số lô.");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    for (const product of selectedProducts) {
      if (!product.price.trim() || !product.manufacturedDate || !product.expiredDate) {
        setError("Vui lòng nhập đầy đủ thông tin cho tất cả sản phẩm.");
        return;
      }
    }

    setError("");

    const newLot = {
      lotNumber,
      status,
      products: selectedProducts,
    };

    console.log("Lưu lô hàng:", newLot);
    message.success("Lô hàng đã được lưu thành công!");
    handleChangePage("Danh sách lô hàng");
  };

  const columns = [
    { title: "Mã SP", dataIndex: "id" },
    { title: "Tên SP", dataIndex: "name" },
    {
      title: "Giá nhập",
      dataIndex: "price",
      render: (_: any, record: SelectedProduct) => (
        <Input
          value={record.price}
          onChange={(e) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, price: e.target.value } : p))
            )
          }
        />
      ),
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufacturedDate",
      render: (_: any, record: SelectedProduct) => (
        <Input
          type="date"
          value={record.manufacturedDate}
          onChange={(e) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, manufacturedDate: e.target.value } : p))
            )
          }
        />
      ),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiredDate",
      render: (_: any, record: SelectedProduct) => (
        <Input
          type="date"
          value={record.expiredDate}
          onChange={(e) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, expiredDate: e.target.value } : p))
            )
          }
        />
      ),
    },
    {
      title: "Xóa",
      render: (_: any, record: SelectedProduct) => (
        <Button danger onClick={() => handleRemoveProduct(record.id)}>
          🗑
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#fafbfe", borderRadius: "8px", marginTop: "60px" }}>
      <h2>Tạo mới lô hàng</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="Số lô" required>
          <Input
            placeholder="VD: L0001"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Sản phẩm" required>
          <Select
            options={productOptions}
            onChange={handleSelectProduct}
            placeholder="Chọn sản phẩm..."
            style={{ width: "100%" }}
          />
        </Form.Item>

        {selectedProducts.length > 0 && (
          <Table
            columns={columns}
            dataSource={selectedProducts}
            rowKey="id"
            pagination={false}
            bordered
            style={{ marginTop: "20px" }}
          />
        )}

        <Space style={{ marginTop: "20px" }}>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
          <Button onClick={() => handleChangePage("Danh sách lô hàng")}>Quay lại</Button>
        </Space>
      </Form>
    </div>
  );
};

export default AddLot;
