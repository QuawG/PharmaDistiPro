import React, { useState } from 'react';
import { MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Table, Button, Modal } from 'antd';
import UpdateCategory from '../Category/UpdateCategory';

interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

interface CategoryTableProps {
  CATEGORY_DATA: Category[];
}

const CategoryTable: React.FC<CategoryTableProps> = ({ CATEGORY_DATA }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORY_DATA);

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

  const columns = [
    {
      title: 'Tên danh mục',
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
      title: 'Mã danh mục',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Tính năng',
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
    <div className="bg-white">
      <Table dataSource={categories} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

      {/* Popup Update Category */}
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
