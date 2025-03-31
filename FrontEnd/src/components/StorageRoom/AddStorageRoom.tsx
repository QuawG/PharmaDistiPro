import  { useState } from "react";
import { Button, Input, Select, Form, Space, message } from "antd";

interface StorageRoom {
  id: number;
  code: string;
  name: string;
  status: string;
  temperature: number;
  humidity: number;
  capacity: number;
}

export default function AddStorageRoom() {
  const [, setStorageRooms] = useState<StorageRoom[]>([]);
  const [newStorageRoom, setNewStorageRoom] = useState<Partial<StorageRoom>>({
    code: "",
    name: "",
    status: "",
    temperature: 0,
    humidity: 0,
    capacity: 0,
  });

  const handleChange = (name: string, value: any) => {
    setNewStorageRoom((prev) => ({
      ...prev,
      [name]: typeof value === "string" ? value : parseFloat(value),
    }));
  };

  const handleAddStorageRoom = () => {
    if (!newStorageRoom.code || !newStorageRoom.name || !newStorageRoom.status) {
      message.warning("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setStorageRooms((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...newStorageRoom,
      } as StorageRoom,
    ]);

    message.success("Tạo kho thành công!");

    setNewStorageRoom({ code: "", name: "", status: "", temperature: 0, humidity: 0, capacity: 0 });
  };

  return (
    <div style={{ padding: "24px", background: "#fafbfe", borderRadius: "8px", marginTop: "60px" }}>
      <p>Tạo kho hàng mới</p>
      <Form layout="vertical" onFinish={handleAddStorageRoom}>
        <Space direction="vertical"  style={{ display: "flex" }}>
          <Form.Item label="Mã kho" required>
            <Input
              placeholder="Nhập mã kho"
              value={newStorageRoom.code}
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Tên kho" required>
            <Input
              placeholder="Nhập tên kho"
              value={newStorageRoom.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Trạng thái" required>
            <Select
              placeholder="Chọn trạng thái"
              value={newStorageRoom.status}
              onChange={(value) => handleChange("status", value)}
            >
              <Select.Option value="Hoạt động">Hoạt động</Select.Option>
              <Select.Option value="Không hoạt động">Không hoạt động</Select.Option>
              <Select.Option value="Đang chờ">Đang chờ</Select.Option>
            </Select>
          </Form.Item>

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
            <Button onClick={() => setNewStorageRoom({ code: "", name: "", status: "", temperature: 0, humidity: 0, capacity: 0 })}>
              Hủy
            </Button>
          </Space>
        </Space>
      </Form>
    </div>
  );
}
