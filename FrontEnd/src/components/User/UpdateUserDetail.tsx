import { useEffect, useState } from "react";
import { Modal, Button, Input, Avatar, Typography, Row, Col, Form, Select, Upload, message } from "antd";
import { XCircle } from "lucide-react";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function UpdateUserDetail({
  isOpen,
  onClose,
  user,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (updatedUser: any) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(user);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    setFormData(user);
    setPreviewImage(user?.avatar || "https://via.placeholder.com/150");
  }, [user]);

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
    return false; // Prevent uploading to the server
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
      width="90%"
      className="user-detail-modal"
      centered
      closeIcon={<XCircle size={24} />}
    >
      <div className="p-6">
        <div className="mb-6">
          <Title level={4}>Cập nhật thông tin cá nhân</Title>
          <Text type="secondary">Cập nhật thông tin người dùng ở form bên dưới</Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[16, 16]}>
            {/* Left Section */}
            <Col xs={24} lg={12}>
              <div className="p-4 border rounded-lg">
                <Form.Item label="Tên riêng" name="firstName" initialValue={formData?.firstName}>
                  <Input
                    value={formData?.firstName || ""}
                    onChange={(e) => handleChange(e.target.value, "firstName")}
                  />
                </Form.Item>

                <Form.Item label="Tên họ" name="lastName" initialValue={formData?.lastName}>
                  <Input
                    value={formData?.lastName || ""}
                    onChange={(e) => handleChange(e.target.value, "lastName")}
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

                <Form.Item label="Vai trò" name="role" initialValue={formData?.role}>
                  <Input
                    value={formData?.role || ""}
                    onChange={(e) => handleChange(e.target.value, "role")}
                  />
                </Form.Item>

                <Form.Item label="Mã số nhân viên" name="employeeCode" initialValue={formData?.employeeCode}>
                  <Input
                    value={formData?.employeeCode || ""}
                    onChange={(e) => handleChange(e.target.value, "employeeCode")}
                  />
                </Form.Item>

                <Form.Item label="Trạng thái" name="status" initialValue={formData?.status}>
                  <Select
                    value={formData?.status || ""}
                    onChange={(value) => handleChange(value, "status")}
                  >
                    <Select.Option value="active">Hoạt động</Select.Option>
                    <Select.Option value="inactive">Không hoạt động</Select.Option>
                    <Select.Option value="pending">Đang chờ</Select.Option>
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
                  alt="User Avatar"
                  className="border border-gray-300 mb-2"
                />
                <Form.Item name="avatar">
                  <Upload
                    showUploadList={false}
                    beforeUpload={handleAvatarChange}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />} style={{ marginTop: "20px" }}>
                      Chọn ảnh
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item label="Tạo bởi" name="createdBy" initialValue={user?.createdBy}>
                <Input value={user?.createdBy || "N/A"} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời điểm tạo" name="createdDate" initialValue={user?.createdDate}>
                <Input value={user?.createdDate || "N/A"} disabled />
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
