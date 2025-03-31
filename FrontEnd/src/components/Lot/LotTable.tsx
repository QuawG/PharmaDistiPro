import React, { useState, useEffect } from "react";
import { Table, Modal, Input, Button, Dropdown, Menu } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";

interface Lot {
  id: number;
  LotCode: string;
  ProductName: string;
  Status: string;
  SupplyPrice: number;
  ManufacturedDate: string;
  ExpiredDate: string;
  Quantity: number;
  CreatedBy: string;
  CreatedDate: string;
}

interface LotTableProps {
  ITEM_DATA: Lot[];
}

const LotTable: React.FC<LotTableProps> = ({ ITEM_DATA }) => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setLots(ITEM_DATA);
  }, [ITEM_DATA]);

  // Tính số ngày còn hạn
  const calculateRemainingDays = (expiredDate: string) => {
    const today = new Date();
    return Math.floor((new Date(expiredDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Xóa lô hàng
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa lô hàng này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => setLots(lots.filter((lot) => lot.id !== id)),
    });
  };

  // Mở modal chỉnh sửa
  const handleEdit = (lot: Lot) => {
    setSelectedLot(lot);
    setIsEditModalOpen(true);
  };

  // Lưu thay đổi
  const handleSave = () => {
    if (selectedLot) {
      setLots(lots.map((lot) => (lot.id === selectedLot.id ? selectedLot : lot)));
      setIsEditModalOpen(false);
    }
  };

  // Format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns = [
    { title: "Mã lô", dataIndex: "LotCode", key: "LotCode" },
    { title: "Tên sản phẩm", dataIndex: "ProductName", key: "ProductName" },
    { title: "Ngày SX", dataIndex: "ManufacturedDate", key: "ManufacturedDate", render: formatDate },
    { title: "HSD", dataIndex: "ExpiredDate", key: "ExpiredDate", render: formatDate },
    { title: "Tồn kho", dataIndex: "Quantity", key: "Quantity" },
    {
      title: "Số ngày còn hạn",
      key: "RemainingDays",
      render: ( record: Lot) => `${calculateRemainingDays(record.ExpiredDate)} ngày`,
      // text: string,
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Còn hàng") color = "green";
        else if (status === "Đã hết hàng") color = "red";
        else if (status === "Đã hết hạn") color = "gray";
        else if (status === "Tạm ngưng bán") color = "yellow";
        return <span className={`text-${color}-500`}>{status}</span>;
      },
    },
    {
      title: <UnorderedListOutlined />,
      key: "actions",
      // text: string, 
      render: (record: Lot) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => handleEdit(record)}>
                <EditOutlined /> Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" onClick={() => handleDelete(record.id)} danger>
                <DeleteOutlined /> Xóa
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <Table columns={columns} dataSource={lots} rowKey="id" />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa lô hàng"
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleSave}
        width={800}
      >
        {selectedLot && (
          <>
            <label>Mã lô</label>
            <Input value={selectedLot.LotCode} onChange={(e) => setSelectedLot({ ...selectedLot, LotCode: e.target.value })} />

            <label className="mt-2">Tên sản phẩm</label>
            <Input value={selectedLot.ProductName} onChange={(e) => setSelectedLot({ ...selectedLot, ProductName: e.target.value })} />

            <label className="mt-2">Giá nhập</label>
            <Input type="number" value={selectedLot.SupplyPrice} onChange={(e) => setSelectedLot({ ...selectedLot, SupplyPrice: Number(e.target.value) })} />

            <label className="mt-2">Tồn kho</label>
            <Input type="number" value={selectedLot.Quantity} onChange={(e) => setSelectedLot({ ...selectedLot, Quantity: Number(e.target.value) })} />

            <label className="mt-2">Trạng thái</label>
            <Input value={selectedLot.Status} onChange={(e) => setSelectedLot({ ...selectedLot, Status: e.target.value })} />
          </>
        )}
      </Modal>
    </div>
  );
};

export default LotTable;
