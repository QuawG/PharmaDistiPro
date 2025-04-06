import React, { useState } from 'react';
import { Table, Button, Modal, Dropdown, Menu, Select, message } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, EyeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import StorageRoomDetailsModal from './StorageRoomDetail';
import UpdateStorageRoomDetailsModal from './UpdateStorageRoomDetail';
import axios from 'axios';

interface StorageRoom {
  storageRoomId: number;
  storageRoomCode: string;
  storageRoomName: string;
  status: boolean; // Changed to boolean for consistency with the supplier example
  temperature: number;
  humidity: number;
  capacity: number;
  createdBy:number;
  createdDate:string;
}

interface StorageRoomTableProps {
  storageRooms: StorageRoom[];
}

const StorageRoomTable: React.FC<StorageRoomTableProps> = ({ storageRooms }) => {
  const [selectedRoom, setSelectedRoom] = useState<StorageRoom | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleStatusChange = async (value: string, room: StorageRoom) => {
    const newStatus = value === 'Hoạt động';
    
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn đổi trạng thái?',
      content: 'Hành động này sẽ thay đổi trạng thái của kho.',
      okText: 'Đổi trạng thái',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await axios.put(`http://pharmadistiprobe.fun/api/StorageRoom/ActivateDeactivateStorageRoom/${room.storageRoomId}/${newStatus}`);
          message.success('Cập nhật trạng thái thành công!');
          // Optionally refresh data or update state here
        } catch (error) {
          message.error('Lỗi khi cập nhật trạng thái!');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'storageRoomId', key: 'storageRoomId' },
    { title: 'Mã Kho', dataIndex: 'storageRoomCode', key: 'storageRoomCode' },
    { title: 'Tên Kho', dataIndex: 'storageRoomName', key: 'storageRoomName' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, room: StorageRoom) => (
        <Select
          defaultValue={status ? 'Hoạt động' : 'Không hoạt động'}
          onChange={(value) => handleStatusChange(value, room)}
          className="border rounded p-1"
        >
          <Select.Option value="Hoạt động">Hoạt động</Select.Option>
          <Select.Option value="Không hoạt động">Không hoạt động</Select.Option>
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
              <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => {
                setSelectedRoom(room);
                setIsViewModalOpen(true);
              }}>
                Xem
              </Menu.Item>
              <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => {
                setSelectedRoom(room);
                setIsEditModalOpen(true);
              }}>
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

  const handleDelete = (room: StorageRoom) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa kho này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        // Implement delete action here, e.g., API call
        message.success('Xóa kho thành công!');
      },
    });
  };

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
            onSave={(updatedRoom: StorageRoom) => {
              // Refresh data or update room in state
            }}
          />
        </>
      )}
    </div>
  );
};

export default StorageRoomTable;