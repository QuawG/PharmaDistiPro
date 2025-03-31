import React, { useState } from 'react';
import { Menu, Dropdown, Button, Table, Modal } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined,UnorderedListOutlined } from '@ant-design/icons';
import CustomerDetailsModal from './CustomerDetail';
import UpdateCustomerDetailsModal from './UpdateCustomerDetail';

interface Customer {
  id: number;
  avatar: string;
  firstName: string;
  employeeCode: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  createdBy: string;
  createdDate: string;
  taxCode: number;
  status: string;
}

interface CustomerTableProps {
  CUSTOMERS_DATA: Customer[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ CUSTOMERS_DATA }) => {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS_DATA);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = (updatedCustomer: Customer) => {
    console.log('Customer updated:', updatedCustomer);
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const openViewModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  // Handle delete customer action
  const handleDelete = (customer: Customer) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedCustomers = customers.filter((item) => item.id !== customer.id);
        setCustomers(updatedCustomers);  // Cập nhật danh sách khách hàng sau khi xóa
        console.log('Updated Customers after delete:', updatedCustomers);
      },
    });
  };

  // Handle status change with confirmation
  const handleStatusChange = (value: string, record: Customer) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của khách hàng.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedCustomers = customers.map((customer) =>
          customer.id === record.id ? { ...customer, status: value } : customer
        );
        setCustomers(updatedCustomers);  // Cập nhật trạng thái sau khi thay đổi
        console.log('Updated Customers after status change:', updatedCustomers);
      },
    });
  };

  const columns = [
    { title: 'Ảnh đại diện', dataIndex: 'avatar', render: (avatar: string) => <img src={avatar} alt="Avatar" className="w-28 h-20" /> },
    { title: 'Tên nhà thuốc', dataIndex: 'firstName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: Customer) => (
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value, record)}  // Trigger the status change handler
          className="border rounded p-1"
        >
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
          <option value="pending">Đang chờ</option>
        </select>
      ),
    },
    {
      title:  <UnorderedListOutlined />,
      key: 'actions',
      render: (_: any, record: Customer) => (
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
        dataSource={customers}  // Sử dụng state customers để hiển thị dữ liệu
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="overflow-x-auto"
      />

      <CustomerDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        customer={selectedCustomer}
      />
      <UpdateCustomerDetailsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onSave={handleSave}
      />
    </div>
  );
};

export default CustomerTable;
