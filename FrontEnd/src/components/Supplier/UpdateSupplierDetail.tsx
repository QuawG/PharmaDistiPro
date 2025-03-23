import { useEffect, useState } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { XCircle } from "lucide-react";

const { Option } = Select;

export default function UpdateSupplierDetail({
  isOpen,
  onClose,
  supplier,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  supplier: any;
  onSave: (updatedSupplier: any) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(supplier);

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
    setFormData(supplier);
  }, [supplier]);

  if (!mounted) return null;

  const handleChange = (value: any, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      onSave(formData);
      message.success("Cập nhật thông tin thành công!");
      onClose();
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin!");
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
      className="supplier-detail-modal"
      centered
      closeIcon={<XCircle size={24} />}
    >
      <div className="p-6">
        <h1 className="text-xl font-semibold">Cập nhật thông tin nhà cung cấp</h1>
        <p className="text-sm text-gray-500 mb-6">Cập nhật thông tin nhà cung cấp theo form bên dưới</p>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Tên nhà cung cấp" name="name" initialValue={formData?.name}>
            <Input
              value={formData?.name || ""}
              onChange={(e) => handleChange(e.target.value, "name")}
            />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address" initialValue={formData?.address}>
            <Input
              value={formData?.address || ""}
              onChange={(e) => handleChange(e.target.value, "address")}
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" initialValue={formData?.phone}>
            <Input
              value={formData?.phone || ""}
              onChange={(e) => handleChange(e.target.value, "phone")}
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" initialValue={formData?.status}>
            <Select
              value={formData?.status || ""}
              onChange={(value) => handleChange(value, "status")}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="pending">Đang chờ</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tạo bởi" name="createdBy" initialValue={supplier?.createdBy}>
            <Input value={supplier?.createdBy || "N/A"} disabled />
          </Form.Item>

          <Form.Item label="Thời điểm tạo" name="createdDate" initialValue={supplier?.createdDate}>
            <Input value={supplier?.createdDate || "N/A"} disabled />
          </Form.Item>

          <div className="flex justify-end">
            <Button type="default" onClick={onClose} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
