import React, { useState } from 'react'; 
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import UserTable from '../../components/User/UserTable'; // Đảm bảo bạn đã tạo UserTable

interface UserListPageProps {
  handleChangePage: (page: string) => void;
}

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
}

const USERS_DATA: User[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    avatar: "https://via.placeholder.com/150",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main St",
    role: "Admin",
    employeeCode: "EMP001",
    createdBy: "Admin",
    createdDate: "2023-01-01T00:00:00Z" 
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    avatar: "https://via.placeholder.com/150",
    email: "jane@example.com",
    phone: "234-567-8901",
    address: "456 Maple Ave",
    role: "User",
    employeeCode: "EMP002",
    createdBy: "Admin",
    createdDate: "2023-01-02T00:00:00Z" 
  },
  {
    id: 3,
    firstName: "Jane",
    lastName: "Smith",
    avatar: "https://via.placeholder.com/150",
    email: "jane@example.com",
    phone: "234-567-8901",
    address: "456 Maple Ave",
    role: "User",
    employeeCode: "EMP003",
    createdBy: "Admin",
    createdDate: "2023-01-02T00:00:00Z" 
  }, {
    id: 4,
    firstName: "Jane",
    lastName: "Smith",
    avatar: "https://via.placeholder.com/150",
    email: "jane@example.com",
    phone: "234-567-8901",
    address: "456 Maple Ave",
    role: "User",
    employeeCode: "EMP004",
    createdBy: "Admin",
    createdDate: "2023-01-02T00:00:00Z" 
  }, {
    id: 5,
    firstName: "Jane",
    lastName: "Smith",
    avatar: "https://via.placeholder.com/150",
    email: "jane@example.com",
    phone: "234-567-8901",
    address: "456 Maple Ave",
    role: "User",
    employeeCode: "EMP005",
    createdBy: "Admin",
    createdDate: "2023-01-02T00:00:00Z" 
  }
];

const UserListPage: React.FC<UserListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(USERS_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = USERS_DATA.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách người dùng</h1>
          <p className="text-sm text-gray-500">Quản lí người dùng</p>
        </div>
        <button 
          onClick={() => handleChangePage('Thêm người dùng')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Thêm người dùng mới
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
                placeholder="Search..."
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
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg">
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <UserTable USERS_DATA={filteredUsers} />
        {/* <UserDetail isOpen={true} onClose={() => {}} user={userData} /> */}
        
      </div>
    </div>
  );
};

export default UserListPage;