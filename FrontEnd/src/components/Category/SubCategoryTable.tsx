import React, { useState } from "react";
import { MoreOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Table, Button, Modal, Image } from "antd";
import UpdateSubCategory from "../Category/UpdateSubCategory";

interface SubCategory {
  id: number;
  name: string;
  parentCategory: string;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

interface SubCategoryTableProps {
  SUBCATEGORY_DATA: SubCategory[];
}

const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ SUBCATEGORY_DATA }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(SUBCATEGORY_DATA);

  const showDeleteConfirm = (subCategory: SubCategory) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa danh mục phụ "${subCategory.name}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setSubCategories(subCategories.filter(sub => sub.id !== subCategory.id));
      },
    });
  };

  const columns = [
    {
      title: "Danh mục thuốc",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SubCategory) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.image || "assets/img/product/noimage.png"}
            alt={record.name}
            width={40}
            height={40}
            className="rounded-lg object-cover bg-gray-100"
            preview={false}
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: "Chủng loại",
      dataIndex: "parentCategory",
      key: "parentCategory",
    },
    {
      title: "Mã danh mục",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Tính năng",
      key: "actions",
      render: (_: any, record: SubCategory) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" onClick={() => {
                setSelectedSubCategory(record);
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
      <Table dataSource={subCategories} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />

      {/* Popup Update SubCategory */}
      <UpdateSubCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={selectedSubCategory}
        onSave={(updatedSubCategory) => {
          setSubCategories(subCategories.map(sub => (sub.id === updatedSubCategory.id ? updatedSubCategory : sub)));
        }}
      />
    </div>
  );
};

export default SubCategoryTable;
