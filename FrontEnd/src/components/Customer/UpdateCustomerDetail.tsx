import { useEffect, useState } from "react";
import { Modal, Button, Input, Avatar, Typography, Row, Col, Form, Select, Upload, message } from "antd";
import { XCircle } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

export default function UpdateCustomerDetail({
  isOpen,
  onClose,
  customer,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onSave: (updatedCustomer: any) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(customer);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

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
    setFormData(customer);
    setPreviewImage(customer?.avatar || "https://via.placeholder.com/150");
    setFileList([]);
  }, [customer]);

  if (!mounted) return null;

  const handleChange = (value: any, field: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
        setFormData({ ...formData, avatar: e.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSubmit = async () => {
    const formPayload = new FormData();
    formPayload.append('LastName', formData?.lastName || "");
    formPayload.append('EmployeeCode', formData?.employeeCode || "");
    formPayload.append('Email', formData?.email || "");
    formPayload.append('Phone', formData?.phone || "");
    formPayload.append('Address', formData?.address || "");
    formPayload.append('TaxCode', formData?.taxCode || "");
    formPayload.append('Status', formData?.status === "active" ? "1" : "0");
    formPayload.append('Avatar', formData?.avatar || "");
    formPayload.append('RoleId', '5');

    try {
      const response = await axios.put('http://pharmadistiprobe.fun/api/User/UpdateUser', formPayload, {
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
      console.error(error.response);
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || "Có lỗi xảy ra!");
      } else {
        message.error("Vui lòng điền đầy đủ thông tin!");
      }
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      className="customer-detail-modal"
      centered
      closeIcon={<XCircle size={24} />}
    >
      <div className="p-6">
        <div className="mb-6">
          <Title level={4}>Cập nhật thông tin nhà thuốc</Title>
          <Text type="secondary">Cập nhật thông tin nhà thuốc ở form bên dưới</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[16, 16]}>
            {/* Left Section */}
            <Col xs={24} lg={12}>
              <div className="p-4 border rounded-lg">
                <Form.Item label="ID" name="userId" initialValue={customer?.userId}>
                  <Input value={customer?.userId || "N/A"} disabled />
                </Form.Item>

                <Form.Item label="Tên nhà thuốc" name="lastName" initialValue={formData?.lastName}>
                  <Input
                    value={formData?.lastName || ""}
                    onChange={(e) => handleChange(e.target.value, "lastName")}
                  />
                </Form.Item>

                <Form.Item label="Mã nhà thuốc" name="employeeCode" initialValue={formData?.employeeCode}>
                  <Input
                    value={formData?.employeeCode || ""}
                    onChange={(e) => handleChange(e.target.value, "employeeCode")}
                  />
                </Form.Item>

                <Form.Item label="Email" name="email" initialValue={formData?.email}>
                  <Input
                    value={formData?.email || ""}
                    onChange={(e) => handleChange(e.target.value, "email")}
                  />
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phone" initialValue={formData?.phone}>
                  <Input
                    value={formData?.phone || ""}
                    onChange={(e) => handleChange(e.target.value, "phone")}
                  />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address" initialValue={formData?.address}>
                  <Input
                    value={formData?.address || ""}
                    onChange={(e) => handleChange(e.target.value, "address")}
                  />
                </Form.Item>

                <Form.Item label="Mã số thuế" name="taxCode" initialValue={formData?.taxCode}>
                  <Input
                    value={formData?.taxCode || ""}
                    onChange={(e) => handleChange(e.target.value, "taxCode")}
                  />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status" initialValue={formData?.status}>
                  <Select
                    value={formData?.status || ""}
                    onChange={(value) => handleChange(value, "status")}
                  >
                    <Select.Option value="active">Hoạt động</Select.Option>
                    <Select.Option value="inactive">Không hoạt động</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>

            {/* Avatar Section */}
            <Col xs={24} lg={12} className="flex flex-col items-center justify-center">
              <div className="p-4 border rounded-lg text-center">
                <Avatar
                  size={400}
                  src={previewImage}
                  alt="Customer Avatar"
                  className="border border-gray-300 mb-2"
                />

<Form.Item name="avatar">
  <Upload
    fileList={fileList}  // Use fileList prop instead of value
    showUploadList={false}
    beforeUpload={handleAvatarChange}
    accept="image/*"
    onChange={({ fileList: newFileList }) => setFileList(newFileList)} // Update fileList state
  >
    <Button icon={<UploadOutlined />} style={{ marginTop: '20px' }}>Chọn ảnh</Button>
  </Upload>
</Form.Item>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Tạo bởi" name="createdBy" initialValue={customer?.createdBy}>
                <Input value={customer?.createdBy || "N/A"} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời điểm tạo" name="createdDate" initialValue={customer?.createdDate}>
                <Input value={customer?.createdDate || "N/A"} disabled />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end mt-4">
            <Button type="default" onClick={onClose}>
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