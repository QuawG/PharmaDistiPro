import { useEffect, useState } from "react";
import { Modal, Button, Typography } from "antd";
import { X } from "lucide-react";

const { Title, Text } = Typography;

export default function StorageRoomDetail({
  isOpen,
  onClose,
  room,
}: {
  isOpen: boolean;
  onClose: () => void;
  room: any;
}) {
  const [mounted, setMounted] = useState(false);
  const [, setVisible] = useState(false);

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
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={<X size={20} />}
      centered
      title="Thông tin kho hàng"
    >
      <div className="p-4">
        <Title level={5}>Xem thông tin kho hàng ở dưới đây</Title>

        <div className="mb-4">
          <Text strong>Mã kho:</Text>
          <div className="mt-1 p-2 bg-gray-100 rounded">{room?.code || "N/A"}</div>
        </div>

        <div className="mb-4">
          <Text strong>Tên kho:</Text>
          <div className="mt-1 p-2 bg-gray-100 rounded">{room?.name || "N/A"}</div>
        </div>

        <div className="mb-4">
          <Text strong>Trạng thái:</Text>
          <div className="mt-1 p-2 bg-gray-100 rounded">{room?.status || "N/A"}</div>
        </div>

        <div className="mb-4">
          <Text strong>Nhiệt độ (°C):</Text>
          <div className="mt-1 p-2 bg-gray-100 rounded">{room?.temperature || "N/A"}</div>
        </div>

        <div className="mb-4">
          <Text strong>Độ ẩm (%):</Text>
          <div className="mt-1 p-2 bg-gray-100 rounded">{room?.humidity || "N/A"}</div>
        </div>

        <div className="mb-4">
          <Text strong>Sức chứa:</Text>
          <div className="mt-1 p-2 bg-gray-100 rounded">{room?.capacity || "N/A"}</div>
        </div>

        <div className="flex justify-end">
          <Button type="primary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
