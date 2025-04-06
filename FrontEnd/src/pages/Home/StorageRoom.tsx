import React, { useState, useEffect } from 'react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { FileText, Table, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import StorageRoomTable from '../../components/StorageRoom/StorageRoomTable';
import axios from 'axios';

interface StorageRoom {
  storageRoomId: number;
  storageRoomCode: string;
  storageRoomName: string;
  status: boolean; // Changed to boolean for consistency with the supplier example
  temperature: number;
  humidity: number;
  capacity: number;
  createdBy:number;
  createdDate:string;
}

const StorageRoomListPage: React.FC<{ handleChangePage: (page: string) => void; }> = ({ handleChangePage }) => {
  const [storageRooms, setStorageRooms] = useState<StorageRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Trạng thái được chọn

  useEffect(() => {
    const fetchStorageRooms = async () => {
      try {
        const response = await axios.get('http://pharmadistiprobe.fun/api/StorageRoom/GetStorageRoomList'); // Update this URL as needed
        setStorageRooms(response.data.data); // Adjust based on API response structure
      } catch (error) {
        console.error("Error fetching storage rooms:", error);
      }
    };

    fetchStorageRooms();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const filteredRooms = storageRooms.filter(room => {
    const matchesSearch =
      room.storageRoomCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.storageRoomName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || (selectedStatus === 'Hoạt động' ? room.status : !room.status);
    return matchesSearch && matchesStatus;
  });

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
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8 pr-4 py-1 border border-gray-300 rounded-lg w-64"
              value={searchTerm}
              onChange={handleSearch}
            />
            <p>Lọc theo trạng thái</p>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border rounded p-1"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Không hoạt động">Không hoạt động</option>
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
        <StorageRoomTable storageRooms={filteredRooms} />
      </div>
    </div>
  );
};

export default StorageRoomListPage;