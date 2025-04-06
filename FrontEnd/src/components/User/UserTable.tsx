/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Table, Modal, Select, message, Dropdown, Menu, Button } from 'antd';
import { MoreOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import UserDetailsModal from './UserDetail';
import UpdateUserDetailsModal from './UpdateUserDetail';
import axios from 'axios';

interface User {
  userId: number;
  avatar: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  age: number;
  roleId: number;
  employeeCode: string;
  createdBy: string;
  createdDate: string;
  status: boolean;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleStatusChange = async (value: string, record: User) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của người dùng.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.put(`http://pharmadistiprobe.fun/api/User/ActivateDeactivateUser/${record.userId}`, { status: value });
          message.success('Cập nhật trạng thái thành công!');
          // Optionally refresh the user list
        } catch (error) {
          message.error('Lỗi khi cập nhật trạng thái!');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'userId', key: 'userId' },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      render: (avatar: string) => <img src={avatar} alt="Avatar" className="w-28 h-20" />,
    },
    { title: 'Tên người dùng', dataIndex: 'userName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: boolean, record: User) => (
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
      title: 'Tính năng',
      key: 'actions',
      render: (_: any, record: User) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => {
                setSelectedUser(record);
                setIsViewModalOpen(true);
              }}>
                Xem
              </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => {
             setSelectedUser(record);
             setIsEditModalOpen(true);
           }}>
             Chỉnh sửa
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
        dataSource={users}
        rowKey="userId" // Use userId instead of id
        pagination={{ pageSize: 10 }}
      />
      
      <UserDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedUser}
      />
      <UpdateUserDetailsModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              user={selectedUser}
              onSave={() => {/* Refresh supplier data if needed */}}
            />
    </div>
  );
};

export default UserTable;