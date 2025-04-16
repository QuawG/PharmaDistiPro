import { useState, useEffect } from "react";
import { Input, Button, Select, Typography, Space } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CustomerTable from "../../components/Customer/CustomerTable";
import axios from "axios";

const { Title, Text } = Typography;

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

const CustomerListPage: React.FC<{ handleChangePage: (page: string) => void }> = ({
  handleChangePage,
}) => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/User/GetCustomerList");
        setAllCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = allCustomers.filter((customer) => {
    const matchesSearch =
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "Active" ? customer.status : !customer.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Title level={3}>Danh sách khách hàng</Title>
            <Text type="secondary">Quản lí thông tin khách hàng</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleChangePage("Tạo nhà thuốc")}
          >
            Tạo khách hàng mới
          </Button>
        </div>
        <Space>
          <Input
            placeholder="Tìm kiếm khách hàng..."
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
        <CustomerTable customers={filteredCustomers} setCustomers={setAllCustomers} />
      </Space>
    </div>
  );
};

export default CustomerListPage;