import React, { useState, useEffect } from 'react';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { FileText, Table, Printer } from 'lucide-react';
import ExcelJS from 'exceljs';
import SupplierTable from '../../components/Supplier/SupplierTable';
import axios from 'axios';

interface Supplier {
  id: number;
  supplierCode: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  createdBy: string;  // Ensure this matches the expected type in SupplierTable
  createdDate: string;
  status: boolean;
}

const SupplierListPage: React.FC<{ handleChangePage: (page: string) => void; }> = ({ handleChangePage }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://pharmadistiprobe.fun/api/Supplier/GetSupplierList');
        setSuppliers(response.data.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch =
      supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierPhone.includes(searchTerm);
    const matchesStatus = !selectedStatus || (selectedStatus === 'Active' ? supplier.status : !supplier.status);
    return matchesSearch && matchesStatus;
  });

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Suppliers');
    
    // Đặt tiêu đề cột
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Mã nhà cung cấp', key: 'supplierCode', width: 20 },
      { header: 'Tên nhà cung cấp', key: 'supplierName', width: 30 },
      { header: 'Địa chỉ', key: 'supplierAddress', width: 30 },
      { header: 'Số điện thoại', key: 'supplierPhone', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
    ];
  
    // Thêm dữ liệu
    filteredSuppliers.forEach(supplier => {
      worksheet.addRow({
        id: supplier.id,
        supplierCode: supplier.supplierCode,
        supplierName: supplier.supplierName,
        supplierAddress: supplier.supplierAddress,
        supplierPhone: supplier.supplierPhone,
        status: supplier.status ? 'Hoạt động' : 'Không hoạt động',
      });
    });
  
    // Định dạng tiêu đề
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
  
    // Định dạng ô
    worksheet.eachRow({ includeEmpty: true }, (row: ExcelJS.Row, _: number) => {
      row.eachCell({ includeEmpty: true }, (cell: ExcelJS.Cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
  
    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Danh_Sách_Nhà_Cung_Cấp.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
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
        <SupplierTable suppliers={filteredSuppliers} />
      </div>
    </div>
  );
};

export default SupplierListPage;