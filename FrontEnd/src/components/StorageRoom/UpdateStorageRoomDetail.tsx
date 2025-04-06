import { useEffect, useState } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { X } from "lucide-react";
import axios from "axios";

const { Option } = Select;

interface StorageRoom {
  storageRoomId: number; // Thêm ID kho
  storageRoomCode: string;
  storageRoomName: string;
  status: boolean; // Kiểu boolean cho status
  temperature: number;
  humidity: number;
  capacity: number;
}

export default function UpdateStorageRoomDetail({
  isOpen,
  onClose,
  room,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  room: StorageRoom;
  onSave: (updatedRoom: StorageRoom) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [, setVisible] = useState(false);
  const [formData, setFormData] = useState<StorageRoom>(room);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setFormData(room);
  }, [room]);

  if (!mounted) return null;

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (formData) {
      try {
        const response = await axios.put(`http://pharmadistiprobe.fun/api/StorageRoom/UpdateStorageRoom/${formData.storageRoomId}`, {
          StorageRoomCode: formData.storageRoomCode,
          StorageRoomName: formData.storageRoomName,
          Status: formData.status, // Gửi trực tiếp kiểu boolean
          Temperature: formData.temperature,
          Humidity: formData.humidity,
          Quantity: formData.capacity,
        });

        if (response.data.success) {
          message.success("Cập nhật thông tin kho hàng thành công!");
          onSave(formData); // Gọi hàm onSave để cập nhật danh sách kho
          onClose();
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
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={<X size={20} />}
      centered
      title="Cập nhật thông tin kho hàng"
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={formData}
        className="p-4"
      >
        <Form.Item
          label="Mã kho"
          name="storageRoomCode"
          rules={[{ required: true, message: "Vui lòng nhập mã kho" }]}
        >
          <Input
            value={formData?.storageRoomCode || ""}
            onChange={(e) => handleChange("storageRoomCode", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Tên kho"
          name="storageRoomName"
          rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}
        >
          <Input
            value={formData?.storageRoomName || ""}
            onChange={(e) => handleChange("storageRoomName", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            value={formData?.status ? "1" : "0"} // Hiển thị trạng thái
            onChange={(value) => handleChange("status", value === "1")}
          >
            <Option value="1">Hoạt động</Option>
            <Option value="0">Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Nhiệt độ (°C)" name="temperature">
          <Input
            type="number"
            min={0}
            value={formData?.temperature || ""}
            onChange={(e) => handleChange("temperature", Number(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Độ ẩm (%)" name="humidity">
          <Input
            type="number"
            min={0}
            value={formData?.humidity || ""}
            onChange={(e) => handleChange("humidity", Number(e.target.value))}
          />
        </Form.Item>

        <Form.Item label="Sức chứa" name="capacity">
          <Input
            type="number"
            min={0}
            value={formData?.capacity || ""}
            onChange={(e) => handleChange("capacity", Number(e.target.value))}
          />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Hủy</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </Modal>
  );
}