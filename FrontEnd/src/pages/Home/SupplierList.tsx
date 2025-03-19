import React, { useState } from 'react';
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import SupplierTable from '../../components/Supplier/SupplierTable'; 

interface Supplier {
  supplierId: number;
  name: string;
  address: string;
  phone: string;
  createdBy: string;
  createdDate: string; 
  status: string; // New field for status
}

const SUPPLIERS_DATA: Supplier[] = [
  {
    supplierId: 1,
    name: "Supplier A",
    address: "123 Supplier St",
    phone: "123-456-7890",
    createdBy: "Admin",
    createdDate: "2023-01-01T00:00:00Z",
    status: "Active" // New status field
  },
  {
    supplierId: 2,
    name: "Supplier B",
    address: "456 Supplier Ave",
    phone: "234-567-8901",
    createdBy: "Admin",
    createdDate: "2023-01-02T00:00:00Z",
    status: "Inactive" // New status field
  },
];

const SupplierListPage: React.FC<{ handleChangePage: (page: string) => void; }> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // State for selected status
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>(SUPPLIERS_DATA);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterSuppliers(value, selectedStatus);
  };

  const filterSuppliers = (searchTerm: string, status: string) => {
    const filtered = SUPPLIERS_DATA.filter(supplier => {
      const matchesName = supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !status || supplier.status === status; 
      return matchesName && matchesStatus;
    });
    setFilteredSuppliers(filtered);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterSuppliers(searchTerm, status);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSuppliers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
    XLSX.writeFile(workbook, "Suppliers_List.xlsx");
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách nhà cung cấp</h1>
          <p className="text-sm text-gray-500">Quản lí nhà cung cấp</p>
        </div>
        <button 
          onClick={() => handleChangePage('Tạo nhà cung cấp')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Tạo mới nhà cung cấp
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
            {/* Dropdown for status */}
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
        <SupplierTable SUPPLIERS_DATA={filteredSuppliers} />
      </div>
    </div>
  );
};

export default SupplierListPage;