import React, { useState } from 'react'; 
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CustomerTable from '../../components/Customer/CustomerTable'; // Ensure you have created CustomerTable

interface Customer {
    id: number;
    avatar: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    age: number;  // Added age property
    createdBy: string;
    createdDate: string; 
}
interface CustomerListPageProps {
  handleChangePage: (page: string) => void;
}
const CUSTOMERS_DATA: Customer[] = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    avatar: "https://via.placeholder.com/150",
    email: "alice@example.com",
    phone: "321-654-0987",
    address: "789 Oak St",
    age: 30,  // Added age
    createdBy: "Admin",
    createdDate: "2023-01-10T00:00:00Z" 
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Brown",
    avatar: "https://via.placeholder.com/150",
    email: "bob@example.com",
    phone: "432-765-0987",
    address: "101 Pine St",
    age: 25,  // Added age
    createdBy: "Admin",
    createdDate: "2023-01-11T00:00:00Z" 
  },
  // Add more customers as needed
];

const CustomerListPage: React.FC<CustomerListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(CUSTOMERS_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = CUSTOMERS_DATA.filter(customer =>
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách khách hàng</h1>
          <p className="text-sm text-gray-500">Quản lí khách hàng</p>
        </div>
        <button 
          onClick={() => handleChangePage('Thêm khách hàng')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Thêm khách hàng mới
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
        <CustomerTable CUSTOMERS_DATA={filteredCustomers} />
      </div>
    </div>
  );
};

export default CustomerListPage;