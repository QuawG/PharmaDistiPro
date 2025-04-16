import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Space, Typography, Row, Col, Card } from 'antd';
import { PlusOutlined, FilterOutlined, FileTextOutlined, TableOutlined, PrinterOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import StorageRoomTable from '../../components/StorageRoom/StorageRoomTable';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm bỏ dấu tiếng Việt
const removeDiacritics = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

interface StorageRoom {
  storageRoomId: number;
  storageRoomCode: string | null;
  storageRoomName: string;
  type: string;
  capacity: number;
  remainingRoomVolume: number;
  status: boolean;
  createdBy: number | null;
  createdDate: string;
}

const StorageRoomListPage: React.FC<{ handleChangePage: (page: string) => void }> = ({ handleChangePage }) => {
  const [storageRooms, setStorageRooms] = useState<StorageRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const fetchStorageRooms = async () => {
    try {
      const response = await axios.get('http://pharmadistiprobe.fun/api/StorageRoom/GetStorageRoomList');
      const validRooms = (response.data.data || []).map((room: any) => ({
        ...room,
        storageRoomCode: room.storageRoomCode?.toString() || '',
        storageRoomName: room.storageRoomName?.toString() || '',
      })).filter((room: StorageRoom) => 
        room.storageRoomCode && room.storageRoomName
      );
      setStorageRooms(validRooms as StorageRoom[]);
    } catch (error) {
      console.error('Error fetching storage rooms:', error);
      setStorageRooms([]);
    }
  };

  useEffect(() => {
    fetchStorageRooms();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const filteredRooms = storageRooms.filter(room => {
    const normalizedSearchTerm = removeDiacritics(searchTerm.toLowerCase());
    const normalizedCode = removeDiacritics(room.storageRoomCode?.toLowerCase() || '');
    const normalizedName = removeDiacritics(room.storageRoomName?.toLowerCase() || '');

    const matchesSearch =
      normalizedCode.includes(normalizedSearchTerm) ||
      normalizedName.includes(normalizedSearchTerm);

    const matchesStatus = !selectedStatus || 
      (selectedStatus === 'Hoạt động' ? room.status : !room.status);
    return matchesSearch && matchesStatus;
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRooms);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StorageRooms');
    XLSX.writeFile(workbook, 'StorageRooms.xlsx');
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>Danh sách kho</Title>
          <Text type="secondary">Quản lý kho</Text>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleChangePage('Tạo kho mới')}
          >
            Tạo kho mới
          </Button>
        </Col>
      </Row>

      <Card>
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
          <Col xs={24} md={12} lg={8}>
            <Space>
              <Input
                prefix={<FilterOutlined />}
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
              <Select
                placeholder="Lọc theo trạng thái"
                value={selectedStatus}
                onChange={handleStatusChange}
                style={{ width: 160 }}
                allowClear
              >
                <Option value="">Tất cả trạng thái</Option>
                <Option value="Hoạt động">Hoạt động</Option>
                <Option value="Không hoạt động">Không hoạt động</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={12} lg={16} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<FileTextOutlined />} />
              <Button icon={<TableOutlined />} onClick={exportToExcel}>
                Xuất Excel
              </Button>
              <Button icon={<PrinterOutlined />} />
            </Space>
          </Col>
        </Row>

        <StorageRoomTable storageRooms={filteredRooms} />
      </Card>
    </div>
  );
};

export default StorageRoomListPage;