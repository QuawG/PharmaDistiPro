import React, { useState } from 'react';
import { Menu, Dropdown, Button, Table, Modal, message, Select } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined,UnorderedListOutlined } from '@ant-design/icons';
import CustomerDetailsModal from './CustomerDetail';
import UpdateCustomerDetailsModal from './UpdateCustomerDetail';
import axios from 'axios';

interface Customer {
  userId: number;
  avatar: string;
  lastName: string;
  employeeCode: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  createdBy: string;
  createdDate: string;
  taxCode: number;
  status: boolean;
}

interface CustomerTableProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>; // Thêm prop để cập nhật danh sách khách hàng
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, setCustomers }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const openViewModal = (customer: Customer) => {
  //   setSelectedCustomer(customer);
  //   setIsViewModalOpen(true);
  // };

  // Xử lý xóa khách hàng
  const handleDelete = (customer: Customer) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.delete(`http://pharmadistiprobe.fun/api/Customer/DeleteCustomer/${customer.userId}`);
          message.success('Xóa khách hàng thành công!');

          // Cập nhật danh sách khách hàng
          const updatedCustomers = customers.filter(item => item.userId !== customer.userId);
          setCustomers(updatedCustomers); // Cập nhật state để phản ánh sự thay đổi
        } catch (error) {
          console.error("Error deleting customer:", error);
          message.error('Lỗi khi xóa khách hàng!');
        }
      },
    });
  };

  // // Xử lý thay đổi trạng thái
  // const handleStatusChange = async (value: string, record: Customer) => {
  //   Modal.confirm({
  //     title: 'Bạn có chắc chắn muốn đổi trạng thái?',
  //     content: 'Hành động này sẽ thay đổi trạng thái của khách hàng.',
  //     okText: 'Đổi trạng thái',
  //     cancelText: 'Hủy',
  //     onOk: async () => {
  //       try {
  //         await axios.put(`http://pharmadistiprobe.fun/api/Customer/ActivateDeactivateCustomer/${record.userId}`, { status: value });
  //         message.success('Cập nhật trạng thái thành công!');
  //         // Cập nhật danh sách khách hàng nếu cần
  //       } catch (error) {
  //         console.error("Error updating status:", error);
  //         message.error('Lỗi khi cập nhật trạng thái!');
  //       }
  //     },
  //   });
  // };

  
  const handleStatusChange = (value: string, record: Customer) => {
    const newStatus = value === 'Hoạt động';
    
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của nhà cung cấp.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.put(`http://pharmadistiprobe.fun/api/User/ActivateDeactivateUser/${record.userId}/${newStatus}`);
          message.success('Cập nhật trạng thái thành công!');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          message.error('Lỗi khi cập nhật trạng thái!');
        }
      },
    });
  };
  const columns = [
    { title: 'ID', dataIndex: 'userId' },
    { title: 'Tên khách hàng', dataIndex: 'lastName' },
    { title: 'Ảnh đại diện', dataIndex: 'avatar', render: (avatar: string) => <img src={avatar} alt="Avatar" className="w-28 h-20" /> },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: boolean, record: Customer) => (
        <Select
          defaultValue={status ? 'Hoạt động' : 'Không hoạt động'}
          onChange={(value) => handleStatusChange(value, record)}
        >
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Không hoạt động">Không hoạt động</Select.Option>
        </Select>
      ),
    },
    {
      title:  <UnorderedListOutlined />,
      key: 'actions',
      render: (_: any, record: Customer) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => {
                            setSelectedCustomer(record);
                            setIsViewModalOpen(true);
                          }}>
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
        dataSource={customers}
        rowKey="userId"
        pagination={{ pageSize: 10 }}
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
        onSave={(updatedCustomer) => console.log('Customer updated:', updatedCustomer)} // Handle save logic
      />
    </div>
  );
};

export default CustomerTable;