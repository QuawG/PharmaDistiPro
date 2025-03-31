import { useEffect, useState } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { X } from "lucide-react";

const { Option } = Select;

interface StorageRoom {
  id: number;
  code: string;
  name: string;
  status: string;
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

  const handleChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (formData) {
      onSave(formData);
      message.success("Cập nhật thông tin kho hàng thành công!");
      onClose();
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
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã kho" }]}
        >
          <Input
            value={formData?.code || ""}
            onChange={(e) => handleChange("code", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Tên kho"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên kho" }]}
        >
          <Input
            value={formData?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select
            value={formData?.status || ""}
            onChange={(value) => handleChange("status", value)}
          >
            <Option value="Hoạt động">Hoạt động</Option>
            <Option value="Không hoạt động">Không hoạt động</Option>
            <Option value="Đang chờ">Đang chờ</Option>
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
