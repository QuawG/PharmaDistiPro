import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Dropdown, Menu, Select, message, Form, Input, Typography } from 'antd';
import { MoreOutlined, EditOutlined, EyeOutlined, CloseOutlined, LineChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title as ChartTitle,
} from 'chart.js';
import { useAuth } from '../../pages/Home/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Option } = Select;
const { Title: AntTitle, Text } = Typography;

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

interface SensorData {
  temperature: number;
  humidity: number;
  createdDate: string;
}

interface StorageRoomTableProps {
  storageRooms: StorageRoom[];
}

const userRoles: { [key: number]: string } = {
  1: 'Giám đốc',
  2: 'Quản lí kho',
  3: 'Trưởng phòng kinh doanh',
  4: 'Nhân viên bán hàng',
};

// Modal for Viewing Storage Room Details
const StorageRoomDetail: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  room: StorageRoom | null;
}> = ({ isOpen, onClose, room }) => {
  const [mounted, setMounted] = useState(false);
  const [fetchedRoom, setFetchedRoom] = useState<StorageRoom | null>(room);

  useEffect(() => {
    if (isOpen && room?.storageRoomId) {
      setMounted(true);
      axios
        .get(`http://pharmadistiprobe.fun/api/StorageRoom/GetStorageRoomById/${room.storageRoomId}`)
        .then((response) => {
          if (response.data.success) {
            setFetchedRoom(response.data.data);
          } else {
            message.error(response.data.message || 'Không thể tải thông tin kho!');
          }
        })
        .catch(() => {
          message.error('Lỗi khi tải thông tin kho!');
        });
    } else {
      setMounted(false);
    }
  }, [isOpen, room]);

  if (!mounted || !fetchedRoom) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[<Button key="close" type="primary" onClick={onClose}>Đóng</Button>]}
      closeIcon={<CloseOutlined />}
      centered
      title="Thông tin kho hàng"
    >
      <div style={{ padding: 16 }}>
        <AntTitle level={5}>Xem thông tin kho hàng ở dưới đây</AntTitle>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Mã kho:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.storageRoomCode || 'N/A'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Tên kho:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.storageRoomName || 'N/A'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Loại phòng:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.type || 'N/A'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Sức chứa (cm³):</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.capacity || 'N/A'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Dung tích còn lại:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.remainingRoomVolume || 'N/A'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Trạng thái:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.status ? 'Hoạt động' : 'Không hoạt động'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Tạo bởi:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.createdBy ? userRoles[fetchedRoom.createdBy] : 'N/A'}</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Thời điểm tạo:</Text>
          <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>{fetchedRoom.createdDate || 'N/A'}</div>
        </div>
      </div>
    </Modal>
  );
};

// Modal for Updating Storage Room Details
const UpdateStorageRoomDetail: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  room: StorageRoom;
  onSave: (updatedRoom: StorageRoom) => void;
}> = ({ isOpen, onClose, room, onSave }) => {
  const [form] = Form.useForm();
  const [mounted, setMounted] = useState(false);
  const [roomTypes, setRoomTypes] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await axios.get('http://pharmadistiprobe.fun/api/StorageRoom/RoomTypes');
        const types = Object.entries(response.data).map(([id, name]) => ({
          id: id as string,
          name: name as string,
        }));
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error);
        setRoomTypes([
          { id: '1', name: 'Phòng thường' },
          { id: '2', name: 'Phòng mát' },
          { id: '3', name: 'Phòng đông lạnh' },
        ]);
      }
    };

    fetchRoomTypes();

    if (isOpen) {
      setMounted(true);
      form.setFieldsValue({
        storageRoomCode: room.storageRoomCode,
        storageRoomName: room.storageRoomName,
        type: room.type,
        capacity: room.capacity,
        status: room.status ? '1' : '0',
      });
    } else {
      setMounted(false);
    }
  }, [isOpen, room, form]);

  if (!mounted) return null;

  const handleSubmit = async (values: any) => {
    try {
      const response = await axios.put(`http://pharmadistiprobe.fun/api/StorageRoom/UpdateStorageRoom/${room.storageRoomId}`, {
        storageRoomCode: values.storageRoomCode,
        storageRoomName: values.storageRoomName,
        type: roomTypes.find((t) => t.name === values.type)?.id || '1',
        capacity: Number(values.capacity),
        status: values.status === '1',
      });

      if (response.data.success) {
        message.success('Cập nhật thông tin kho hàng thành công!');
        onSave({ ...room, ...response.data.data });
        onClose();
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data.message || 'Có lỗi xảy ra!');
      } else {
        message.error('Lỗi không xác định!');
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      closeIcon={<CloseOutlined />}
      centered
      title="Cập nhật thông tin kho hàng"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ padding: 16 }}
      >
        <Form.Item
          label="Mã kho"
          name="storageRoomCode"
          rules={[{ required: true, message: 'Vui lòng nhập mã kho' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tên kho"
          name="storageRoomName"
          rules={[{ required: true, message: 'Vui lòng nhập tên kho' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại phòng"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
        >
          <Select>
            {roomTypes.map((type) => (
              <Option key={type.id} value={type.name}>
                {type.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Sức chứa (cm³)"
          name="capacity"
          rules={[
            { required: true, message: 'Vui lòng nhập sức chứa' },
            {
              validator: async (_, value) => {
                const num = Number(value);
                if (isNaN(num) || num <= 0) {
                  return Promise.reject(new Error('Sức chứa phải lớn hơn 0'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Option value="1">Hoạt động</Option>
            <Option value="0">Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: 'right' }}>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Modal for Sensor Data Chart
const SensorChartModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  roomName: string;
}> = ({ isOpen, onClose, roomId, roomName }) => {
  const [hasSensor, setHasSensor] = useState<boolean | null>(null);
  const [historyData, setHistoryData] = useState<SensorData[]>([]);
  const [displayData, setDisplayData] = useState<SensorData[]>([]);
  const [latestSensorData, setLatestSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);

      // Check for sensor and fetch historical data
      axios
        .get(`http://pharmadistiprobe.fun/api/StorageHistory/HasSensor/${roomId}`)
        .then((response) => {
          setHasSensor(response.data);
          if (response.data) {
            // Fetch historical data
            axios
              .get(`http://pharmadistiprobe.fun/api/StorageHistory/Top50Earliest/${roomId}`)
              .then((historyResponse) => {
                const data = historyResponse.data.sort(
                  (a: SensorData, b: SensorData) =>
                    new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
                );
                setHistoryData(data);
                if (data.length >= 20) {
                  setDisplayData([data[19]]);
                } else {
                  setDisplayData([]);
                }
              })
              .catch(() => {
                message.error('Lỗi khi lấy dữ liệu lịch sử cảm biến!');
              });

            // Fetch latest sensor data
            axios
              .get(`http://pharmadistiprobe.fun/api/StorageHistory/Newest/${roomId}`)
              .then((latestResponse) => {
                setLatestSensorData(latestResponse.data);
              })
              .catch(() => {
                message.error('Lỗi khi lấy dữ liệu cảm biến mới nhất!');
                setLatestSensorData(null);
              });
          }
        })
        .catch(() => {
          message.error('Lỗi khi kiểm tra cảm biến!');
          setHasSensor(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setHistoryData([]);
      setDisplayData([]);
      setLatestSensorData(null);
    }
  }, [isOpen, roomId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isOpen && hasSensor && displayData.length < historyData.length) {
      interval = setInterval(() => {
        setDisplayData((prev) => {
          const nextLength = prev.length + 1;
          if (nextLength <= historyData.length) {
            return historyData.slice(0, nextLength);
          }
          clearInterval(interval!);
          return prev;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, hasSensor, displayData.length, historyData]);

  // Format date label
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  const temperatureChartData = {
    labels: displayData.map((data) => formatDateLabel(data.createdDate)),
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: displayData.map((data) => data.temperature),
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const humidityChartData = {
    labels: displayData.map((data) => formatDateLabel(data.createdDate)),
    datasets: [
      {
        label: 'Độ ẩm (%)',
        data: displayData.map((data) => data.humidity),
        borderColor: 'rgba(54, 162, 235, 0.8)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const temperatureChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
         Justin: '#333',
        },
      },
      title: {
        display: true,
        text: 'Biểu đồ Nhiệt độ',
        font: {
          size: 18,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}°C`,
          title: (tooltipItems: any[]) => formatDateLabel(displayData[tooltipItems[0].dataIndex].createdDate),
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Thời gian',
          font: {
            size: 14,
          },
          color: '#333',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
          color: '#555',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Nhiệt độ (°C)',
          font: {
            size: 14,
          },
          color: '#333',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#555',
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return Number.isFinite(value) ? `${value.toFixed(1)}°C` : '';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        suggestedMin: 0,
        suggestedMax: 40,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad' as const,
    },
  };

  const humidityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Biểu đồ Độ ẩm',
        font: {
          size: 18,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        callbacks: {
          label: (context: any) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`,
          title: (tooltipItems: any[]) => formatDateLabel(displayData[tooltipItems[0].dataIndex].createdDate),
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Thời gian',
          font: {
            size: 14,
          },
          color: '#333',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
          color: '#555',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Độ ẩm (%)',
          font: {
            size: 14,
          },
          color: '#333',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#555',
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return Number.isFinite(value) ? `${value.toFixed(1)}%` : '';
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad' as const,
    },
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[<Button key="close" type="primary" onClick={onClose}>Đóng</Button>]}
      closeIcon={<CloseOutlined />}
      centered
      title={`Giám sát môi trường kho (Kho ${roomName})`}
      width={900}
    >
      <div style={{ padding: 24 }}>
        {loading ? (
          <Text>Đang tải dữ liệu...</Text>
        ) : hasSensor === false ? (
          <Text>Phòng này không có cảm biến.</Text>
        ) : (
          <>
            {latestSensorData && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Dữ liệu mới nhất ({formatDateLabel(latestSensorData.createdDate)}):</Text>
                <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                  Nhiệt độ: {latestSensorData.temperature.toFixed(1)}°C, Độ ẩm: {latestSensorData.humidity.toFixed(1)}%
                </div>
              </div>
            )}
            <div style={{ marginBottom: 32, height: 300 }}>
              <AntTitle level={5} style={{ marginBottom: 16 }}>
                Biểu đồ Nhiệt độ
              </AntTitle>
              {displayData.length > 0 ? (
                <Line data={temperatureChartData} options={temperatureChartOptions} />
              ) : (
                <Text>Không có dữ liệu để hiển thị.</Text>
              )}
            </div>
            <div style={{ marginBottom: 32, height: 300 }}>
              <AntTitle level={5} style={{ marginBottom: 16 }}>
                Biểu đồ Độ ẩm
              </AntTitle>
              {displayData.length > 0 ? (
                <Line data={humidityChartData} options={humidityChartOptions} />
              ) : (
                <Text>Không có dữ liệu để hiển thị.</Text>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

// Main StorageRoomTable Component
const StorageRoomTable: React.FC<StorageRoomTableProps> = ({ storageRooms }) => {
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<StorageRoom | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [rooms, setRooms] = useState<StorageRoom[]>(storageRooms);

  useEffect(() => {
    setRooms(storageRooms);
  }, [storageRooms]);

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
          setRooms((prev) =>
            prev.map((r) => (r.storageRoomId === room.storageRoomId ? { ...r, status: newStatus } : r))
          );
        } catch (error) {
          message.error('Lỗi khi cập nhật trạng thái!');
        }
      },
    });
  };

  const handleSave = (updatedRoom: StorageRoom) => {
    setRooms((prev) =>
      prev.map((r) => (r.storageRoomId === updatedRoom.storageRoomId ? updatedRoom : r))
    );
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  };

  const columns = [
    { title: 'Mã Kho', dataIndex: 'storageRoomCode', key: 'storageRoomCode' },
    { title: 'Tên Kho', dataIndex: 'storageRoomName', key: 'storageRoomName' },
    { title: 'Loại Phòng', dataIndex: 'type', key: 'type' },
    { title: 'Dung tích', dataIndex: 'capacity', key: 'capacity' },
    { title: 'Dung tích còn lại', dataIndex: 'remainingRoomVolume', key: 'remainingRoomVolume' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, room: StorageRoom) => {
        const statusText = status ? 'Hoạt động' : 'Không hoạt động';
        if (user?.roleName === 'Director') {
          return (
            <Select
              value={statusText}
              onChange={(value) => handleStatusChange(value, room)}
              style={{ width: 120 }}
            >
              <Option value="Hoạt động">Hoạt động</Option>
              <Option value="Không hoạt động">Không hoạt động</Option>
            </Select>
          );
        }
        return (
          <span
            style={{
              color: status ? '#52c41a' : '#f5222d',
              fontWeight: '500',
            }}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, room: StorageRoom) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="view"
                icon={<EyeOutlined />}
                onClick={() => {
                  setSelectedRoom(room);
                  setIsViewModalOpen(true);
                }}
              >
                Xem
              </Menu.Item>
              {user?.roleName === 'Director' && (
                <Menu.Item
                  key="edit"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedRoom(room);
                    setIsEditModalOpen(true);
                  }}
                >
                  Chỉnh sửa
                </Menu.Item>
              )}
              <Menu.Item
                key="sensor"
                icon={<LineChartOutlined />}
                onClick={() => {
                  setSelectedRoom(room);
                  setIsSensorModalOpen(true);
                }}
              >
                Theo dõi cảm biến
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="storageRoomId"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
      {selectedRoom && (
        <>
          <StorageRoomDetail
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedRoom(null);
            }}
            room={selectedRoom}
          />
          <UpdateStorageRoomDetail
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedRoom(null);
            }}
            room={selectedRoom}
            onSave={handleSave}
          />
          <SensorChartModal
            isOpen={isSensorModalOpen}
            onClose={() => {
              setIsSensorModalOpen(false);
              setSelectedRoom(null);
            }}
            roomId={selectedRoom.storageRoomId}
            roomName={selectedRoom.storageRoomName}
          />
        </>
      )}
    </div>
  );
};

export default StorageRoomTable;