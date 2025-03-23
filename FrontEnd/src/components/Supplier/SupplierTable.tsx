import React, { useState } from 'react';
import { Table, Modal, Button, Dropdown, Menu, Select } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import SupplierDetailsModal from './SupplierDetail';
import UpdateSupplierDetailsModal from './UpdateSupplierDetail';

interface Supplier {
  supplierId: number;
  name: string;
  address: string;
  phone: string;
  createdBy: string;
  createdDate: string;
  status: string;
}

interface SupplierTableProps {
  SUPPLIERS_DATA: Supplier[];
}

const SupplierTable: React.FC<SupplierTableProps> = ({ SUPPLIERS_DATA }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(SUPPLIERS_DATA);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const openViewModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsViewModalOpen(true);
  };

  // Handle delete supplier action
  const handleDelete = (supplier: Supplier) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa nhà cung cấp này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedSuppliers = suppliers.filter((item) => item.supplierId !== supplier.supplierId);
        setSuppliers(updatedSuppliers);  // Cập nhật danh sách nhà cung cấp sau khi xóa
        console.log('Updated Suppliers after delete:', updatedSuppliers);
      },
    });
  };

  // Handle status change with confirmation
  const handleStatusChange = (value: string, record: Supplier) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của nhà cung cấp.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedSuppliers = suppliers.map((supplier) =>
          supplier.supplierId === record.supplierId ? { ...supplier, status: value } : supplier
        );
        setSuppliers(updatedSuppliers);  // Cập nhật trạng thái sau khi thay đổi
        console.log('Updated Suppliers after status change:', updatedSuppliers);
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'supplierId' },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: Supplier) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(value, record)}  // Trigger the status change handler
          className="border rounded p-1"
        >
          <Select.Option value="Active">Hoạt động</Select.Option>
          <Select.Option value="Inactive">Không hoạt động</Select.Option>
          <Select.Option value="Pending">Đang chờ</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Tính năng',
      key: 'actions',
      render: (_: any, record: Supplier) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => openViewModal(record)}>
                Xem
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record)}>
                Xóa
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white">
      <Table
        columns={columns}
        dataSource={suppliers}  // Sử dụng state suppliers để hiển thị dữ liệu
        rowKey="supplierId"
        pagination={{ pageSize: 10 }}
        className="overflow-x-auto"
      />

      <SupplierDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        supplier={selectedSupplier}
      />
      <UpdateSupplierDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supplier={selectedSupplier}
        onSave={(updatedSupplier: Supplier) => {
          console.log('Supplier updated:', updatedSupplier);
          const updatedSuppliers = suppliers.map((supplier) =>
            supplier.supplierId === updatedSupplier.supplierId ? updatedSupplier : supplier
          );
          setSuppliers(updatedSuppliers);
        }}
      />
    </div>
  );
};

export default SupplierTable;
