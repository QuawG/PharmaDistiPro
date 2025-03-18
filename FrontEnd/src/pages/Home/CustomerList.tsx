import React, { useState } from 'react';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CustomerTable from '../../components/Customer/CustomerTable'; 

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
    status: string; // Tạo thuộc tính status
}

interface CustomerListPageProps {
  handleChangePage: (page: string) => void;
}

const CUSTOMERS_DATA: Customer[] = [
  { id: 1, firstName: "Alice", employeeCode: "KH001", avatar: "https://via.placeholder.com/150",
    email: "alice@example.com", phone: "321-654-0987", address: "789 Oak St", age: 30, 
    createdBy: "Admin", createdDate: "2023-01-10T00:00:00Z", taxCode: 104224702, status: "Active" },

  { id: 2, firstName: "Bob", employeeCode: "KH002", avatar: "https://via.placeholder.com/150",
    email: "bob@example.com", phone: "432-765-0987", address: "101 Pine St", age: 25,  
    createdBy: "Admin", createdDate: "2023-01-11T00:00:00Z", taxCode: 104224702, status: "Inactive" },

  { id: 3, firstName: "Charlie", employeeCode: "KH003", avatar: "https://via.placeholder.com/150",
    email: "charlie@example.com", phone: "987-654-3210", address: "456 Maple Ave", age: 28,  
    createdBy: "Admin", createdDate: "2023-01-12T00:00:00Z", taxCode: 104224703, status: "Active" }
];

const CustomerListPage: React.FC<CustomerListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Trạng thái được chọn
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(CUSTOMERS_DATA);

  // Tìm kiếm nhà thuốc
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterCustomers(value, selectedStatus);
  };

  // Lọc nhà thuốc theo trạng thái
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterCustomers(searchTerm, status);
  };

  // Hàm lọc nhà thuốc
  const filterCustomers = (searchTerm: string, status: string) => {
    const filtered = CUSTOMERS_DATA.filter(customer =>
      (customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (status === '' || customer.status === status) // Lọc theo trạng thái
    );
    setFilteredCustomers(filtered);
  };

  // Xuất file Excel
  const exportToExcel = () => {
    const excelData = filteredCustomers.map((customer) => ({
      "ID": customer.id,
      "Họ tên": customer.firstName,
      "Mã KH": customer.employeeCode,
      "Email": customer.email,
      "SĐT": customer.phone,
      "Địa chỉ": customer.address,
      "Tuổi": customer.age,
      "Mã số thuế": customer.taxCode,
      "Người tạo": customer.createdBy,
      "Ngày tạo": customer.createdDate,
      "Trạng thái": customer.status, // Tạo trạng thái vào Excel
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachKhachHang");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });

    saveAs(data, "DanhSachKhachHang.xlsx");
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách nhà thuốc</h1>
          <p className="text-sm text-gray-500">Quản lí nhà thuốc</p>
        </div>
        <button 
          onClick={() => handleChangePage('Tạo nhà thuốc')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Tạo nhà thuốc mới
        </button>
      </div>

      {/* Search and Actions */}
      <div className='bg-white rounded-lg shadow p-5'>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9F43] p-2 rounded-lg">
              <FunnelIcon className="w-5 h-5 text-white" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8 pr-4 py-1 border border-gray-300 rounded-lg w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            {/* Dropdown chọn trạng thái */}
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border rounded p-1"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button onClick={exportToExcel} className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <CustomerTable CUSTOMERS_DATA={filteredCustomers} />
      </div>
    </div>
  );
};

export default CustomerListPage;