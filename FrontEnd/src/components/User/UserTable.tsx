import React, { useState } from 'react';
import { Table, Button, Modal, Dropdown, Menu, Select } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import UserDetailsModal from './UserDetail';
import UpdateUserDetailsModal from './UpdateUserDetail';

interface User {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  employeeCode: string;
  createdBy: string;
  createdDate: string;
  status: string;
}

interface UserTableProps {
  USERS_DATA: User[];
}

const UserTable: React.FC<UserTableProps> = ({ USERS_DATA }) => {
  const [users, setUsers] = useState<User[]>(USERS_DATA);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleSave = (updatedUser: User) => {
    console.log('User updated:', updatedUser);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Handle delete user action
  const handleDelete = (user: User) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa người dùng này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedUsers = users.filter((item) => item.id !== user.id);
        setUsers(updatedUsers);
        console.log('Updated Users after delete:', updatedUsers);
      },
    });
  };

  // Handle status change with confirmation
  const handleStatusChange = (value: string, record: User) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của người dùng.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedUsers = users.map((user) =>
          user.id === record.id ? { ...user, status: value } : user
        );
        setUsers(updatedUsers);
        console.log('Updated Users after status change:', updatedUsers);
      },
    });
  };

  const columns = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      render: (avatar: string) => <img src={avatar} alt="Avatar" className="w-28 h-20" />,
    },
    { title: 'Tên người dùng', dataIndex: 'firstName' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string, record: User) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(value, record)}
          className="border rounded p-1"
        >
          <Select.Option value="active">Hoạt động</Select.Option>
          <Select.Option value="inactive">Không hoạt động</Select.Option>
          <Select.Option value="pending">Đang chờ</Select.Option>
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
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="overflow-x-auto"
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
        onSave={handleSave}
      />
    </div>
  );
};

export default UserTable;
