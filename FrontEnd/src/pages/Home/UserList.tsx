import React, { useState, useEffect } from 'react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FileText, Table, Printer } from 'lucide-react';
import axios from 'axios';
import UserTable from '../../components/User/UserTable';

interface User {
  userId: number;
  avatar: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  age:number;
  roleId: number;
  employeeCode: string;
  createdBy: string;
  createdDate: string;
  status: string;
}

const UserListPage: React.FC<{ handleChangePage: (page: string) => void; }> = ({ handleChangePage }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://pharmadistiprobe.fun/api/User/GetUserList'); // Adjust API endpoint accordingly
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = 
  //     user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesStatus = !selectedStatus || user.status === selectedStatus;
  //   return matchesSearch && matchesStatus;
  // });
  const filteredUsers  = users.filter(user => {
    const matchesSearch =
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())||
    user.phone.includes(searchTerm);
    const matchesStatus = !selectedStatus || (selectedStatus === 'Active' ? user.status : !user.status);
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách người dùng</h1>
          <p className="text-sm text-gray-500">Quản lý người dùng</p>
        </div>
        <button 
          onClick={() => handleChangePage('Tạo người dùng')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Tạo người dùng mới
        </button>
      </div>

      <div className='bg-white rounded-lg shadow p-5'>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9F43] p-2 rounded-lg">
              <FunnelIcon className="w-5 h-5 text-white" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8 pr-4 py-1 border border-gray-300 rounded-lg w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
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
        </div>

        {/* User Table */}
        <UserTable users={filteredUsers} />
      </div>
    </div>
  );
};

export default UserListPage;