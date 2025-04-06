import { useState } from "react";
import { Button, Input, Select, Form, Space, message } from "antd";
import axios from "axios";

interface StorageRoom {
  storageRoomId: number;
  storageRoomCode: string;
  storageRoomName: string;
  status: number; // Change status to boolean
  temperature: number;
  humidity: number;
  capacity: number;
}

export default function AddStorageRoom() {
  const [, setStorageRooms] = useState<StorageRoom[]>([]);
  const [newStorageRoom, setNewStorageRoom] = useState<Partial<StorageRoom>>({
    storageRoomCode: "",
    storageRoomName: "",
    status: 0, // Default to false
    temperature: 0,
    humidity: 0,
    capacity: 0,
  });

  const handleChange = (name: string, value: any) => {
    setNewStorageRoom((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? (name === "status" ? value === "1" : value) : parseFloat(value),
    }));
  };

  const handleAddStorageRoom = async () => {
    if (!newStorageRoom.storageRoomCode || !newStorageRoom.storageRoomName) {
      message.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const formData = new FormData();
    formData.append('StorageRoomCode', newStorageRoom.storageRoomCode);
    formData.append('StorageRoomName', newStorageRoom.storageRoomName);
    formData.append('Status', newStorageRoom.status ? 'true' : 'false');
    formData.append('Temperature', (newStorageRoom.temperature || 0).toString());
    formData.append('Humidity', (newStorageRoom.humidity || 0).toString());
    formData.append('Quantity', (newStorageRoom.capacity || 0).toString());

    try {
      const response = await axios.post('http://pharmadistiprobe.fun/api/StorageRoom/CreateStorageRoom', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        message.success("Tạo kho thành công!");
        setStorageRooms((prev) => [
          ...prev,
          {
            storageRoomId: prev.length + 1,
            ...newStorageRoom,
          } as StorageRoom,
        ]);
        setNewStorageRoom({ storageRoomCode: "", storageRoomName: "", status: 0, temperature: 0, humidity: 0, capacity: 0 });
      } else {
        message.error(response.data.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "Có lỗi xảy ra!");
      } else {
        message.error("Lỗi không xác định!");
      }
    }
  };

  return (
    <div style={{ padding: "24px", background: "#fafbfe", borderRadius: "8px", marginTop: "60px" }}>
      <p>Tạo kho hàng mới</p>
      <Form layout="vertical" onFinish={handleAddStorageRoom}>
        <Space direction="vertical" style={{ display: "flex" }}>
          <Form.Item label="Mã kho" required>
            <Input
              placeholder="Nhập mã kho"
              value={newStorageRoom.storageRoomCode}
              onChange={(e) => handleChange("storageRoomCode", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Tên kho" required>
            <Input
              placeholder="Nhập tên kho"
              value={newStorageRoom.storageRoomName}
              onChange={(e) => handleChange("storageRoomName", e.target.value)}
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select
                placeholder="Tùy chỉnh trạng thái"
                value={newStorageRoom.status ? "1" : "0"}
                onChange={(value) => handleChange("status", value === "1")}
              >
                <Select.Option value={1}>Hoạt động</Select.Option>
                <Select.Option value={0}>Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Nhiệt độ (°C)">
            <Input
              type="number"
              placeholder="Nhập nhiệt độ"
              value={newStorageRoom.temperature}
              onChange={(e) => handleChange("temperature", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Độ ẩm (%)">
            <Input
              type="number"
              placeholder="Nhập độ ẩm"
              value={newStorageRoom.humidity}
              onChange={(e) => handleChange("humidity", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Sức chứa">
            <Input
              type="number"
              placeholder="Nhập sức chứa"
              value={newStorageRoom.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
            />
          </Form.Item>

          <Space>
            <Button type="primary" onClick={handleAddStorageRoom}>
              Tạo kho
            </Button>
            <Button onClick={() => setNewStorageRoom({ storageRoomCode: "", storageRoomName: "", status: 0, temperature: 0, humidity: 0, capacity: 0 })}>
              Hủy
            </Button>
          </Space>
        </Space>
      </Form>
    </div>
  );
}