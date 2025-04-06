import React, { useState, useEffect} from 'react';
import * as XLSX from "xlsx";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { saveAs } from "file-saver";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CustomerTable from '../../components/Customer/CustomerTable'; 
import axios from 'axios';

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
    status: string;
}

const CustomerListPage: React.FC<{ handleChangePage: (page: string) => void; }> = ({ handleChangePage }) => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]); // Giữ danh sách gốc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://pharmadistiprobe.fun/api/User/GetCustomerList');
        setAllCustomers(response.data.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredCustomers = allCustomers.filter(customer => {
    const matchesSearch =
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm);
    const matchesStatus = !selectedStatus || (selectedStatus === 'Active' ? customer.status : !customer.status);
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách khách hàng</h1>
          <p className="text-sm text-gray-500">Quản lí khách hàng</p>
        </div>
        <button 
          onClick={() => handleChangePage('Tạo khách hàng')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Tạo khách hàng mới
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             <p>Lọc theo trạng thái</p>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border rounded p-1"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        <CustomerTable customers={filteredCustomers} />
      </div>
    </div>
  );
};

export default CustomerListPage;
