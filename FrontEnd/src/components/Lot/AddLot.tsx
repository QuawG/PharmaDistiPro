import React, { useState, useEffect } from "react";
import { Button, Input, Select, Table, message, Space, Form } from "antd";
import axios from "axios";
import { useAuth } from "../../pages/Home/AuthContext";

interface AddLotProps {
  handleChangePage: (page: string) => void;
}

interface Product {
  productId: number;
  productName: string;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: string;
  manufacturedDate: string;
  expiredDate: string;
  status?: number;
  quantity?: number; // Thêm quantity nếu cần nhập từ UI
}

const AddLot: React.FC<AddLotProps> = ({ handleChangePage }) => {
  const { user } = useAuth();
  const [lotCode, setLotCode] = useState<string>("");
  const [lotId, setLotId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [error, setError] = useState<string>("");
  const [isLotCreated, setIsLotCreated] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct");
        console.log("Dữ liệu sản phẩm từ API:", response.data);
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        message.error("Không thể tải danh sách sản phẩm.");
      }
    };
    fetchProducts();
  }, []);

  const productOptions = products.map((p) => ({
    value: String(p.productId),
    label: p.productName,
  }));

  const handleSelectProduct = (value: string) => {
    const product = products.find((p) => String(p.productId) === value);
    if (product && !selectedProducts.some((p) => p.id === String(product.productId))) {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: String(product.productId),
          name: product.productName,
          price: "",
          manufacturedDate: "",
          expiredDate: "",
          status: 0,
          quantity: 0, // Mặc định quantity là 0
        },
      ]);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const handleCreateLot = async () => {
    if (!user) {
      setError("Vui lòng đăng nhập để tạo lô.");
      return;
    }

    try {
      const generatedLotCode = `LOT${Date.now()}`;
      const lotPayload = {
        lotCode: generatedLotCode,
      };
      console.log("Dữ liệu gửi lên API Lot:", lotPayload);
      const createResponse = await axios.post("http://pharmadistiprobe.fun/api/Lot", lotPayload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response từ API Lot (toàn bộ):", createResponse.data);

      const lotCodeFromResponse = createResponse.data.data.lotCode || generatedLotCode;

      const getLotResponse = await axios.get(
        `http://pharmadistiprobe.fun/api/Lot/${lotCodeFromResponse}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Response từ API Get Lot (toàn bộ):", getLotResponse.data);

      const rawLotId = getLotResponse.data.data?.lotId;
      const lotId = Number(rawLotId);

      if (isNaN(lotId) || lotId <= 0) {
        throw new Error("Không thể lấy lotId hợp lệ từ API Get Lot.");
      }

      setLotId(lotId);
      setLotCode(lotCodeFromResponse);
      setIsLotCreated(true);
      console.log("lotId đã set:", lotId);
      message.success(`Lô đã được tạo với mã: ${lotCodeFromResponse}`);
    } catch (error: any) {
      console.error("Lỗi khi tạo lô:", error);
      if (error.response) {
        console.error("Chi tiết lỗi từ server:", error.response.data);
        message.error(`Không thể tạo lô: ${error.response.data.message || "Lỗi không xác định"}`);
        setError(`Không thể tạo lô: ${error.response.data.message || "Lỗi không xác định"}`);
      } else {
        message.error("Không thể tạo lô. Vui lòng kiểm tra kết nối hoặc response.");
        setError("Lỗi khi tạo lô: " + error.message);
      }
    }
  };

  const handleSave = async () => {
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

    if (!lotId || lotId <= 0) {
      setError("lotId không hợp lệ. Vui lòng tạo lại lô.");
      return;
    }

    setError("");

    try {
      // Tạo mảng payload trực tiếp
      const payload = selectedProducts.map((product) => ({
        lotId: lotId,
        productId: Number(product.id),
        quantity: product.quantity || 0, // Thêm quantity, mặc định 0 nếu không có
        manufacturedDate: new Date(product.manufacturedDate).toISOString(),
        expiredDate: new Date(product.expiredDate).toISOString(),
        supplyPrice: Number(product.price),
        status: 0,
      }));

      console.log("Dữ liệu gửi lên API ProductLot:", payload);

      const response = await axios.post("http://pharmadistiprobe.fun/api/ProductLot", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response từ API ProductLot:", response.data);

      message.success("Sản phẩm đã được thêm vào lô thành công!");
      handleChangePage("Danh sách lô hàng");
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm vào lô:", error);
      if (error.response) {
        console.error("Chi tiết lỗi từ server:", error.response.data);
        const errorDetails = error.response.data.errors
          ? Object.values(error.response.data.errors).join(", ")
          : error.response.data.message || "Lỗi không xác định";
        message.error(`Không thể thêm sản phẩm: ${errorDetails}`);
        setError(`Lỗi: ${errorDetails}`);
      } else {
        message.error("Không thể thêm sản phẩm. Vui lòng kiểm tra kết nối.");
        setError("Lỗi kết nối đến server.");
      }
    }
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
          type="number"
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
        <Form.Item label="Ấn nút để tạo mã lô hàng">
          {isLotCreated ? (
            <Input value={lotCode} disabled />
          ) : (
            <Button type="primary" onClick={handleCreateLot}>
              Tạo lô
            </Button>
          )}
        </Form.Item>

        {isLotCreated && (
          <>
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
          </>
        )}

        <Space style={{ marginTop: "20px" }}>
          {isLotCreated && (
            <Button type="primary" htmlType="submit">
              Lưu sản phẩm
            </Button>
          )}
          <Button onClick={() => handleChangePage("Danh sách lô hàng")}>Quay lại</Button>
        </Space>
      </Form>
    </div>
  );
};

export default AddLot;