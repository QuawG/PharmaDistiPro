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

interface StorageRoom {
  storageRoomId: number;
  storageRoomName: string;
  status: boolean;
}

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
  supplyPrice: string;
  manufacturedDate: string;
  expiredDate: string;
  storageRoomId: number | null;
  OrderQuantity?: number; // Optional, if needed
}

const AddLot: React.FC<AddLotProps> = ({ handleChangePage }) => {
  const { user } = useAuth();
  const [lotCode, setLotCode] = useState<string>("");
  const [lotId, setLotId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [storageRooms, setStorageRooms] = useState<StorageRoom[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [error, setError] = useState<string>("");
  const [isLotCreated, setIsLotCreated] = useState<boolean>(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://pharmadistiprobe.fun/api/Product/ListProduct", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        message.error("Không thể tải danh sách sản phẩm.");
      }
    };
    fetchProducts();
  }, []);

  // Fetch storage rooms
  useEffect(() => {
    const fetchStorageRooms = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://pharmadistiprobe.fun/api/StorageRoom/GetStorageRoomList", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Only include active storage rooms (status: true)
        setStorageRooms(response.data.data.filter((room: StorageRoom) => room.status) || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng kho:", error);
        message.error("Không thể tải danh sách phòng kho.");
      }
    };
    fetchStorageRooms();
  }, []);

  const productOptions = products.map((p) => ({
    value: String(p.productId),
    label: p.productName,
  }));

  const storageRoomOptions = storageRooms.map((room) => ({
    value: room.storageRoomId,
    label: room.storageRoomName,
  }));

  const handleSelectProduct = (value: string) => {
    const product = products.find((p) => String(p.productId) === value);
    if (product && !selectedProducts.some((p) => p.id === String(product.productId))) {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: String(product.productId),
          name: product.productName,
          quantity: 0,
          supplyPrice: "",
          manufacturedDate: "",
          expiredDate: "",
          storageRoomId: null,
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
        createdBy: user.customerId,
      };
      const token = localStorage.getItem("accessToken");
      const createResponse = await axios.post("http://pharmadistiprobe.fun/api/Lot", lotPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const lotCodeFromResponse = createResponse.data.data.lotCode || generatedLotCode;

      const getLotResponse = await axios.get(
        `http://pharmadistiprobe.fun/api/Lot/${lotCodeFromResponse}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const rawLotId = getLotResponse.data.data?.lotId;
      const lotId = Number(rawLotId);

      if (isNaN(lotId) || lotId <= 0) {
        throw new Error("Không thể lấy lotId hợp lệ từ API Get Lot.");
      }

      setLotId(lotId);
      setLotCode(lotCodeFromResponse);
      setIsLotCreated(true);
      message.success(`Lô đã được tạo với mã: ${lotCodeFromResponse}`);
    } catch (error: any) {
      console.error("Lỗi khi tạo lô:", error);
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errors?.[0] || "Không thể tạo lô.";
      message.error(errorMessage);
      setError(errorMessage);
    }
  };

  const handleSave = async () => {
    if (selectedProducts.length === 0) {
      setError("Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }

    for (const product of selectedProducts) {
      if (
        product.quantity <= 0 ||
        !product.supplyPrice.trim() ||
        !product.manufacturedDate ||
        !product.expiredDate ||
        !product.storageRoomId
      ) {
        setError("Vui lòng nhập đầy đủ thông tin cho tất cả sản phẩm (số lượng, giá nhập, ngày sản xuất, ngày hết hạn, kho).");
        return;
      }
    }

    if (!lotId || lotId <= 0) {
      setError("lotId không hợp lệ. Vui lòng tạo lại lô.");
      return;
    }

    setError("");

    try {
      const payload = selectedProducts.map((product) => ({
        lotId: lotId,
        productId: Number(product.id),
        quantity: product.quantity,
        manufacturedDate: new Date(product.manufacturedDate).toISOString(),
        expiredDate: new Date(product.expiredDate).toISOString(),
        supplyPrice: Number(product.supplyPrice),
        orderQuantity: product.quantity, // Assume orderQuantity equals quantity for now
        status: 1, // Default status from API response
        storageRoomId: product.storageRoomId,
      }));

      const token = localStorage.getItem("accessToken");
      const response = await axios.post("http://pharmadistiprobe.fun/api/ProductLot", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      message.success(response.data.message || "Sản phẩm đã được thêm vào lô thành công!");
      handleChangePage("Danh sách lô hàng");
    } catch (error: any) {
      console.error("Lỗi khi thêm sản phẩm vào lô:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Không thể thêm sản phẩm vào lô.";
      message.error(errorMessage);
      setError(errorMessage);
    }
  };

  const columns = [
    { title: "Mã SP", dataIndex: "id", key: "id" },
    { title: "Tên SP", dataIndex: "name", key: "name" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: SelectedProduct) => (
        <Input
          type="number"
          min={0}
          value={record.quantity}
          onChange={(e) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, quantity: Number(e.target.value) } : p))
            )
          }
        />
      ),
    },
    {
      title: "Số lượng đặt hàng",
      dataIndex: "orderQuantity",
      key: "orderQuantity",
      render: (_: any, record: SelectedProduct) => (
        <Input
          type="number"
          min={0}
          value={record.OrderQuantity}
          onChange={(e) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, OrderQuantity: Number(e.target.value) } : p))
            )
          }
        />
      ),
    },
    {
      title: "Giá nhập",
      dataIndex: "supplyPrice",
      key: "supplyPrice",
      render: (_: any, record: SelectedProduct) => (
        <Input
          type="number"
          min={0}
          value={record.supplyPrice}
          onChange={(e) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, supplyPrice: e.target.value } : p))
            )
          }
        />
      ),
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufacturedDate",
      key: "manufacturedDate",
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
      key: "expiredDate",
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
      title: "Phòng kho",
      dataIndex: "storageRoomId",
      key: "storageRoomId",
      render: (_: any, record: SelectedProduct) => (
        <Select
          placeholder="Chọn kho..."
          value={record.storageRoomId}
          options={storageRoomOptions}
          onChange={(value) =>
            setSelectedProducts((prev) =>
              prev.map((p) => (p.id === record.id ? { ...p, storageRoomId: value } : p))
            )
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Xóa",
      key: "action",
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
            <Button type="primary" onClick={handleCreateLot} className="bg-blue-500">
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
            <Button type="primary" htmlType="submit" className="bg-blue-500">
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