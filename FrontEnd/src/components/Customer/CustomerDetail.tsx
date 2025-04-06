import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { Modal, Button, Input, Avatar, Typography, Row, Col } from "antd";

const { Title, Text } = Typography;
const userRoles: { [key: number]: string } = {
  1: 'Giám đốc',
  2: 'Quản lí kho',
  3: 'Trưởng phòng kinh doanh',
  4: 'Nhân viên bán hàng',
};
export default function CustomerDetail({
  isOpen,
  onClose,
  customer,
}: {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
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
      className="customer-detail-modal"
      centered
      bodyStyle={{ padding: 0 }}
      closeIcon={<XCircle size={24} />}
    >
      <div className="p-6">
        <div className="mb-6">
          <Title level={4}>Thông tin nhà thuốc</Title>
          <Text type="secondary">Xem thông tin nhà thuốc ở dưới đây</Text>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div className="p-4 border rounded-lg">
              <div className="mb-4">
                <Text strong>Tên nhà thuốc</Text>
                <Input
                  className="mt-1"
                  value={customer?.lastName || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Text strong>Tên đăng nhập</Text>
                <Input
                  className="mt-1"
                  value={customer?.userName || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Text strong>Mã nhà thuốc</Text>
                <Input
                  className="mt-1"
                  value={customer?.employeeCode || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Text strong>Email</Text>
                <Input
                  className="mt-1"
                  value={customer?.email || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Text strong>Số điện thoại</Text>
                <Input
                  className="mt-1"
                  value={customer?.phone || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Text strong>Địa chỉ</Text>
                <Input
                  className="mt-1"
                  value={customer?.address || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Text strong>Mã số thuế</Text>
                <Input
                  className="mt-1"
                  value={customer?.taxCode || "N/A"}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <Input
                  value={customer?.status ? 'Hoạt động' : 'Không hoạt động'}
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
                src={customer?.avatar || "https://via.placeholder.com/150"}
                alt="Customer Avatar"
                className="border border-gray-300 mb-2"
              />
              
            </div>
          </Col>
        </Row>

        <div className="mt-4">
          
          <div className="mb-4">
            <Text strong>Tạo bởi</Text>
            <Input
              className="mt-1"
              value={userRoles[customer?.createdBy] || "N/A"}
              disabled
            />
          </div>
          <div className="mb-4">
            <Text strong>Thời điểm tạo</Text>
            <Input
              className="mt-1"
              value={customer?.createdDate || "N/A"}
              disabled
            />
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
