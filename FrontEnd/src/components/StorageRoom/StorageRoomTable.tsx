import React, { useState } from 'react';
import { Table, Button, Modal, Dropdown, Menu, Select } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import StorageRoomDetailsModal from './StorageRoomDetail';
import UpdateStorageRoomDetailsModal from './UpdateStorageRoomDetail';

interface StorageRoom {
  id: number;
  code: string;
  name: string;
  status: string;
  temperature: number;
  humidity: number;
  capacity: number;
}

interface StorageRoomTableProps {
  STORAGE_ROOMS_DATA: StorageRoom[];
}

const StorageRoomTable: React.FC<StorageRoomTableProps> = ({ STORAGE_ROOMS_DATA }) => {
  const [storageRooms, setStorageRooms] = useState<StorageRoom[]>(STORAGE_ROOMS_DATA);
  const [selectedRoom, setSelectedRoom] = useState<StorageRoom | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSave = (updatedRoom: StorageRoom) => {
    const updatedRooms = storageRooms.map(room =>
      room.id === updatedRoom.id ? updatedRoom : room
    );
    setStorageRooms(updatedRooms);
  };

  const openViewModal = (room: StorageRoom) => {
    setSelectedRoom(room);
    setIsViewModalOpen(true);
  };

  const openEditModal = (room: StorageRoom) => {
    setSelectedRoom(room);
    setIsEditModalOpen(true);
  };

  const handleDelete = (room: StorageRoom) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa kho này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedRooms = storageRooms.filter((item) => item.id !== room.id);
        setStorageRooms(updatedRooms);
      },
    });
  };

  const handleStatusChange = (value: string, room: StorageRoom) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của kho.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: () => {
        const updatedRooms = storageRooms.map((item) =>
          item.id === room.id ? { ...item, status: value } : item
        );
        setStorageRooms(updatedRooms);
      },
    });
  };

  const columns = [
    { title: 'Mã Kho', dataIndex: 'code', key: 'code' },
    { title: 'Tên Kho', dataIndex: 'name', key: 'name' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, room: StorageRoom) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(value, room)}
          className="border rounded p-1"
        >
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Không hoạt động">Không hoạt động</Select.Option>
          <Select.Option value="Đang chờ">Đang chờ</Select.Option>
        </Select>
      ),
    },
    { title: 'Nhiệt độ', dataIndex: 'temperature', key: 'temperature' },
    { title: 'Độ ẩm', dataIndex: 'humidity', key: 'humidity' },
    {
      title: <UnorderedListOutlined />,
      key: 'actions',
      render: (_: any, room: StorageRoom) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => openViewModal(room)}>
                Xem
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => openEditModal(room)}>
                Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDelete(room)}>
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
        dataSource={storageRooms}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="overflow-x-auto"
      />

      {selectedRoom && (
        <>
          <StorageRoomDetailsModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            room={selectedRoom}
          />
          <UpdateStorageRoomDetailsModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            room={selectedRoom}
            onSave={handleSave}
          />
        </>
      )}
    </div>
  );
};

export default StorageRoomTable;
