import { useState, useEffect, useRef } from "react";
import { Input,  Select, Typography, Space } from "antd";
import {  SearchOutlined } from "@ant-design/icons";
import UserTable from "../../components/User/UserTable";
import axios from "axios";

const { Title, Text } = Typography;

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

const UserListPage: React.FC<{ handleChangePage: (page: string) => void }> = ({
  // handleChangePage,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/User/GetUserList");
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.userName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (user.phone || "").includes(searchTerm);
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "Active" ? user.status : !user.status);
    return matchesSearch && matchesStatus;
  });

  

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3}>Danh sách người dùng</Title>
            <Text type="secondary">Quản lý thông tin người dùng</Text>
          </div>
          <Space>
           
            {/* <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleChangePage("Tạo người dùng")}
            >
              Tạo người dùng mới
            </Button> */}
          </Space>
        </div>
        <Space>
          <Input
            placeholder="Tìm kiếm người dùng..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 150 }}
            allowClear
          >
            <Select.Option value="">Tất cả trạng thái</Select.Option>
            <Select.Option value="Active">Hoạt động</Select.Option>
            <Select.Option value="Inactive">Không hoạt động</Select.Option>
          </Select>
        </Space>
        <UserTable users={filteredUsers} setUsers={setUsers} ref={tableRef} />
      </Space>
    </div>
  );
};

export default UserListPage;