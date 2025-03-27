import React, { useState } from 'react';
import { FileText, Table, Printer } from 'lucide-react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import StorageRoomTable from '../../components/StorageRoom/StorageRoomTable';

interface StorageRoom {
  id: number;
  code: string; // Mã kho
  name: string; // Tên kho
  status: string; // Trạng thái
  temperature: number; // Nhiệt độ
  humidity: number; // Độ ẩm
  capacity: number; // Sức chứa
}

interface StorageRoomListPageProps {
  handleChangePage: (page: string) => void;
}

const STORAGE_ROOMS_DATA: StorageRoom[] = [
  {
    id: 1,
    code: "SR-001",
    name: "Kho A",
    status: "Hoạt động",
    temperature: 20,
    humidity: 50,
    capacity: 100,
  },
  {
    id: 2,
    code: "SR-002",
    name: "Kho B",
    status: "Không hoạt động",
    temperature: 25,
    humidity: 60,
    capacity: 200,
  },
  {
    id: 3,
    code: "SR-003",
    name: "Kho C",
    status: "Hoạt động",
    temperature: 22,
    humidity: 55,
    capacity: 150,
  },
  {
    id: 4,
    code: "SR-004",
    name: "Kho D",
    status: "Đang chờ",
    temperature: 18,
    humidity: 45,
    capacity: 180,
  },
];

const StorageRoomListPage: React.FC<StorageRoomListPageProps> = ({ handleChangePage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Trạng thái được chọn
  const [filteredRooms, setFilteredRooms] = useState<StorageRoom[]>(STORAGE_ROOMS_DATA);
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterRooms(value, selectedStatus);
  };

  const filterRooms = (searchTerm: string, status: string) => {
    const filtered = STORAGE_ROOMS_DATA.filter(room => {
      const matchesCode = room.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesName = room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !status || room.status === status; 
      return (matchesCode || matchesName) && matchesStatus;
    });
    setFilteredRooms(filtered);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterRooms(searchTerm, status);
  };

  // 📤 Xuất danh sách kho ra Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRooms);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "StorageRooms");

    // Xuất file
    XLSX.writeFile(workbook, "StorageRooms.xlsx");
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      {/* Header */}
      <div className="flex justify-between items-center mb-[25px]">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Danh sách kho</h1>
          <p className="text-sm text-gray-500">Quản lý kho</p>
        </div>
        <button 
          onClick={() => handleChangePage('Tạo kho mới')}
          className="bg-[#FF9F43] cursor-pointer text-white text-sm font-bold px-4 py-2 rounded-[4px] flex items-center gap-2">
          <PlusIcon className='w-5 h-5 font-bold'/> Tạo kho mới
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
            {/* Dropdown cho trạng thái */}
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border rounded p-1"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
              <option value="Đang chờ">Đang chờ</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <FileText className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
              onClick={exportToExcel}
            >
              <Table className="w-5 h-5" />
            </button>
            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <StorageRoomTable STORAGE_ROOMS_DATA={filteredRooms} />
      </div>
    </div>
  );
};

export default StorageRoomListPage;