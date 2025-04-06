import { useEffect, useState } from "react";
import { Modal, Button, Input, Avatar, Typography, Row, Col } from "antd";
import { XCircle } from "lucide-react";

const { Title, Text } = Typography;
const userRoles: { [key: number]: string } = {
  1: 'Giám đốc',
  2: 'Quản lí kho',
  3: 'Trưởng phòng kinh doanh',
  4: 'Nhân viên bán hàng',
};
export default function UserDetail({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

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

  if (!mounted) return null;

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      centered
      className="user-detail-modal"
      closeIcon={<XCircle size={24} />}
    >
      <div className="p-6">
        <div className="mb-6">
          <Title level={4}>Thông tin người dùng</Title>
          <Text type="secondary">Xem thông tin người dùng ở dưới đây</Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div className="p-4 border rounded-lg">
              <div className="mb-4">
                <Text strong>Tên riêng</Text>
                <Input className="mt-1" value={user?.firstName || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <Text strong>Tên họ</Text>
                <Input className="mt-1" value={user?.lastName || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <Text strong>Email</Text>
                <Input className="mt-1" value={user?.email || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <Text strong>Số điện thoại</Text>
                <Input className="mt-1" value={user?.phone || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <Text strong>Địa chỉ</Text>
                <Input className="mt-1" value={user?.address || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <Text strong>Vai trò</Text>
                <Input className="mt-1" value={userRoles[user?.roleId] || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <Text strong>Mã số nhân viên</Text>
                <Input className="mt-1" value={user?.employeeCode || "N/A"} disabled />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <Input
                  value={user?.status ? 'Hoạt động' : 'Không hoạt động'}
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12} className="flex flex-col items-center justify-center">
            <div className="p-4 border rounded-lg text-center">
              <Avatar
                size={417}
                src={user?.avatar || "https://via.placeholder.com/150"}
                alt="User Avatar"
                className="border border-gray-300 mb-2"
              />
              <div className="mt-2">
                <Text strong>{user?.firstName || "Unknown"} {user?.lastName || ""}</Text>
              </div>
            </div>
          </Col>
        </Row>

        <div className="mt-4">
          <div className="mb-4">
            <Text strong>Tạo bởi</Text>
            <Input className="mt-1" value={userRoles[user?.createdBy] || "N/A"} disabled />
          </div>
          <div className="mb-4">
            <Text strong>Thời điểm tạo</Text>
            <Input className="mt-1" value={user?.createdDate || "N/A"} disabled />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button type="default" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
