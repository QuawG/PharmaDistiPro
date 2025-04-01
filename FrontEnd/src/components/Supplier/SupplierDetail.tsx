import { useEffect, useState } from "react";
import { Modal, Input, Button, Typography } from "antd";
import { XOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const userRoles: { [key: number]: string } = {
  1: 'Giám đốc',
  2: 'Quản lí kho',
  3: 'Trưởng phòng kinh doanh',
  4: 'Nhân viên bán hàng',
};

export default function SupplierDetail({
  isOpen,
  onClose,
  supplier,
}: {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supplier: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width="80vw"
      className="modal-supplier-detail"
      closeIcon={<XOutlined />}
    >
      <div className="p-6">
        <div className="mb-6">
          <Title level={3}>Chi tiết nhà cung cấp</Title>
          <Text type="secondary">Thông tin chi tiết nhà cung cấp</Text>
        </div>

        <form className="flex flex-col items-center">
          <div className="w-full">
            <div className="border-[1px] border-gray-300 rounded-lg p-4 w-full">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mã nhà cung cấp</label>
                <Input
                  value={supplier?.supplierCode || "N/A"}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên nhà cung cấp</label>
                <Input
                  value={supplier?.supplierName || "N/A"}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <Input
                  value={supplier?.supplierAddress || "N/A"}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <Input
                  value={supplier?.supplierPhone || "N/A"}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                <Input
                  value={supplier?.status ? 'Hoạt động' : 'Không hoạt động'}
                  readOnly
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tạo bởi</label>
                <Input
                  value={userRoles[supplier?.createdBy] || "N/A"} 
                  readOnly
                  className="mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thời điểm tạo</label>
                <Input
                  value={supplier?.createdDate || "N/A"}
                  readOnly
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end mt-4">
          <Button type="default" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}