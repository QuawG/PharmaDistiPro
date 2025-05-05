import React, { useState, useEffect } from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined, } from '@ant-design/icons';
// import ExcelJS from 'exceljs';
import SupplierTable from '../../components/Supplier/SupplierTable';
import axios from 'axios';

interface Supplier {
  id: number;
  supplierCode: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  createdBy: string;
  createdDate: string;
  status: boolean;
}

interface SupplierListPageProps {
  handleChangePage: (page: string) => void;
}

const SupplierListPage: React.FC<SupplierListPageProps> = ({  }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://pharmadistiprobe.fun/api/Supplier/GetSupplierList');
        setSuppliers(response.data.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierPhone.includes(searchTerm);
    const matchesStatus = !selectedStatus || (selectedStatus === 'Active' ? supplier.status : !supplier.status);
    return matchesSearch && matchesStatus;
  });

  // const exportToExcel = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet('Suppliers');

  //   worksheet.columns = [
  //     { header: 'ID', key: 'id', width: 10 },
  //     { header: 'Mã nhà cung cấp', key: 'supplierCode', width: 20 },
  //     { header: 'Tên nhà cung cấp', key: 'supplierName', width: 30 },
  //     { header: 'Địa chỉ', key: 'supplierAddress', width: 30 },
  //     { header: 'Số điện thoại', key: 'supplierPhone', width: 15 },
  //     { header: 'Trạng thái', key: 'status', width: 15 },
  //   ];

  //   filteredSuppliers.forEach((supplier) => {
  //     worksheet.addRow({
  //       id: supplier.id,
  //       supplierCode: supplier.supplierCode,
  //       supplierName: supplier.supplierName,
  //       supplierAddress: supplier.supplierAddress,
  //       supplierPhone: supplier.supplierPhone,
  //       status: supplier.status ? 'Hoạt động' : 'Không hoạt động',
  //     });
  //   });

  //   worksheet.getRow(1).font = { bold: true, size: 12 };
  //   worksheet.getRow(1).alignment = { horizontal: 'center' };

  //   worksheet.eachRow({ includeEmpty: true }, (row) => {
  //     row.eachCell({ includeEmpty: true }, (cell) => {
  //       cell.border = {
  //         top: { style: 'thin' },
  //         left: { style: 'thin' },
  //         bottom: { style: 'thin' },
  //         right: { style: 'thin' },
  //       };
  //       cell.alignment = { vertical: 'middle', horizontal: 'center' };
  //     });
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'Danh_Sach_Nha_Cung_Cap.xlsx';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  return (
    <div className="p-6 mt-[60px] overflow-auto w-full bg-[#fafbfe]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Danh sách nhà cung cấp</h1>
          <p className="text-sm text-gray-500">Quản lý nhà cung cấp</p>
        </div>
        {/* <Button type="primary" onClick={() => handleChangePage('Tạo nhà cung cấp')}>
          Tạo mới nhà cung cấp
        </Button> */}
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <Space>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Lọc theo trạng thái"
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ width: 150 }}
              allowClear
            >
              <Select.Option value="">Tất cả trạng thái</Select.Option>
              <Select.Option value="Active">Hoạt động</Select.Option>
              <Select.Option value="Inactive">Không hoạt động</Select.Option>
            </Select>
          </Space>
          {/* <Space>
            <Button icon={<FileTextOutlined />} />
            <Button icon={<FileExcelOutlined />} onClick={exportToExcel} />
            <Button icon={<PrinterOutlined />} />
          </Space> */}
        </div>
        <SupplierTable suppliers={filteredSuppliers} />
      </div>
    </div>
  );
};

export default SupplierListPage;