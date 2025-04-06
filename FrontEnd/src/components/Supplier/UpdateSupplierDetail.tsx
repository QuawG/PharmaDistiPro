import { useEffect, useState } from "react";
import { Modal, Button, Input, Select, Form, message } from "antd";
import { XCircle } from "lucide-react";
import axios from "axios";

const { Option } = Select;

// Ánh xạ giữa userId và tên người dùng
const userMap: { [key: number]: string } = {
  1: 'Giám đốc',
  2: 'Quản lí kho',
  3: 'Trưởng phòng kinh doanh',
  4: 'Nhân viên bán hàng',
};

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
  const [formData, setFormData] = useState<any>({
    supplierCode: "",
    supplierName: "",
    supplierAddress: "",
    supplierPhone: "",
    status: 1, // Sử dụng 1 cho "Hoạt động" và 0 cho "Không hoạt động"
    createdBy: "",
    createdDate: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
          setFormData(supplier); // Đặt dữ liệu nhà cung cấp vào form
        });
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, supplier]);

  if (!mounted) return null;

  const handleChange = (value: any, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    console.log("Dữ liệu gửi đi:", formData); // Kiểm tra dữ liệu

    // Kiểm tra các trường bắt buộc
    if (!formData.supplierCode || !formData.supplierName || !formData.supplierAddress || !formData.supplierPhone) {
      message.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formPayload = new FormData();
    formPayload.append('Id', supplier.id.toString());
    formPayload.append('SupplierCode', formData.supplierCode);
    formPayload.append('SupplierName', formData.supplierName);
    formPayload.append('SupplierAddress', formData.supplierAddress);
    formPayload.append('SupplierPhone', formData.supplierPhone);
    formPayload.append('Status', formData.status.toString());
    formPayload.append('CreatedBy', supplier.createdBy ? supplier.createdBy.toString() : "");
    formPayload.append('CreatedDate', supplier.createdDate || new Date().toISOString());

    try {
      const response = await axios.put('http://pharmadistiprobe.fun/api/Supplier/UpdateSupplier', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        message.success("Cập nhật thông tin thành công!");
        onSave(formData);
        onClose();
      } else {
        message.error(response.data.message || "Cập nhật không thành công!");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If it's an Axios error, safely access error.response
        console.error(error.response); // In ra phản hồi từ server
        message.error(error.response?.data.message || "Có lỗi xảy ra!");
      } else {
        // Handle non-Axios errors
        console.error(error);
        message.error("Vui lòng điền đầy đủ thông tin!");
      }
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
          <Form.Item label="ID nhà cung cấp">
            <Input value={supplier.id} disabled />
          </Form.Item>
          <Form.Item
            label="Mã nhà cung cấp"
            name="supplierCode"
            rules={[{ required: true, message: 'Vui lòng nhập mã nhà cung cấp!' }]}
            initialValue={formData?.supplierCode}
          >
            <Input
              value={formData?.supplierCode || ""}
              onChange={(e) => handleChange(e.target.value, "supplierCode")}
            />
          </Form.Item>
          <Form.Item
            label="Tên nhà cung cấp"
            name="supplierName"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp!' }]}
            initialValue={formData?.supplierName}
          >
            <Input
              value={formData?.supplierName || ""}
              onChange={(e) => handleChange(e.target.value, "supplierName")}
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="supplierAddress"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            initialValue={formData?.supplierAddress}
          >
            <Input
              value={formData?.supplierAddress || ""}
              onChange={(e) => handleChange(e.target.value, "supplierAddress")}
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="supplierPhone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            initialValue={formData?.supplierPhone}
          >
            <Input
              value={formData?.supplierPhone || ""}
              onChange={(e) => handleChange(e.target.value, "supplierPhone")}
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" initialValue={formData?.status === 1 ? 'active' : 'inactive'}>
            <Select
              value={formData?.status === 1 ? 'active' : 'inactive'}
              onChange={(value) => handleChange(value === 'active' ? 1 : 0, "status")}
            >
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tạo bởi" name="createdBy" initialValue={userMap[supplier?.createdBy]}>
            <Input value={userMap[supplier?.createdBy] || "N/A"} disabled />
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