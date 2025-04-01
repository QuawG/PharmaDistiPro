import React, { useState, useEffect } from 'react';
import { MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, UnorderedListOutlined, FileExcelOutlined, PrinterOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Table, Button, Modal, Input } from 'antd';
import * as XLSX from 'xlsx';
import UpdateCategory from '../Category/UpdateCategory';

interface Category {
  id: number;
  name: string;
  code: string;
  createdBy: string;
  image?: string;
}

interface CategoryTableProps {
  CATEGORY_DATA: Category[];
  handleChangePage: (page: string, categoryId?: number) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ CATEGORY_DATA, handleChangePage }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORY_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);


  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD") // Tách dấu ra khỏi ký tự gốc
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d") // Thay thế 'đ' thành 'd'
      .replace(/Đ/g, "D") // Thay thế 'Đ' thành 'D'
      .toLowerCase(); // Chuyển về chữ thường
  };
  const showDeleteConfirm = (category: Category) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        setCategories(categories.filter(cat => cat.id !== category.id));
      },
    });
  };

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
  };

  const printTable = () => {
    const selectedCategories = selectedRowKeys.length > 0
      ? categories.filter(category => selectedRowKeys.includes(category.id))
      : categories;

    if (selectedCategories.length === 0) {
      alert("Không có danh mục nào được chọn để in.");
      return;
    }

    const printContents = `
      <h2 style="text-align: center;">Danh sách danh mục</h2>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
          <th>Mã chủng loại</th>
            <th>Tên chủng loại</th>
            
            <th>Người tạo</th>
          </tr>
        </thead>
        <tbody>
          ${selectedCategories.map(category => `
            <tr>
                         <td>${category.code}</td>
              <td>${category.name}</td>

              <td>${category.createdBy}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const printWindow = window.open('', '', 'height=800,width=1000');
    if (printWindow) {
      printWindow.document.write(printContents);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(categories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    XLSX.writeFile(workbook, "DanhSachDanhMuc.xlsx");
  };

  const filterCategories = () => {
    let filteredCategories = [...CATEGORY_DATA];

    if (searchTerm.trim()) {
      filteredCategories = filteredCategories.filter(category =>
        removeVietnameseTones(category.name).includes(removeVietnameseTones(searchTerm))
      );
    }

    setCategories(filteredCategories);
  };

  useEffect(() => {
    filterCategories();
  }, [searchTerm]);

  const columns = [
    {
      title: 'Mã chủng loại',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Chủng loại',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <div className="flex items-center gap-3">
          <img
            src={record.image || 'assets/img/product/noimage.png'}
            alt={record.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },

    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: <UnorderedListOutlined />,
      key: 'actions',
      render: (_: any, record: Category) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => {
                setSelectedCategory(record);
                setIsEditModalOpen(true);
              }}>
                <EditOutlined /> Chỉnh sửa
              </Menu.Item>
              <Menu.Item key="delete" onClick={() => showDeleteConfirm(record)} danger>
                <DeleteOutlined /> Xóa
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Tìm kiếm theo tên chủng loại"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={() => handleChangePage("Tạo chủng loại")}>
          + Tạo chủng loại mới
        </Button>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={exportToExcel}
          style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
        >
          Xuất Excel
        </Button>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={printTable}
        >
          In danh sách
        </Button>
      </div>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: handleRowSelectionChange,
        }}
        columns={columns}
        dataSource={categories}
        rowKey="id"
      />

      <UpdateCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        category={selectedCategory}
        onSave={(updatedCategory) => {
          setCategories(categories.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
        }}
      />
    </div>
  );
};

export default CategoryTable;
