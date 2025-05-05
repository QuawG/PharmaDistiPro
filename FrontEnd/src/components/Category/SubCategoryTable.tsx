import React, { useState, useEffect } from "react";
import {
  MoreOutlined,
  EditOutlined,
  // DeleteOutlined,
  // ExclamationCircleOutlined,
  UnorderedListOutlined,
  // FileExcelOutlined,
  // PrinterOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Table, Button, Modal, Input, Form, Upload, message, Select } from "antd";
// import * as XLSX from "xlsx";
import axios from "axios";

interface SubCategory {
  id: number;
  name: string;
  parentCategory: string;
  categoryMainId: number;
  code: string;
  description: string;
  createdBy: string;
  image?: string;
}

interface MainCategory {
  id: number;
  categoryName: string;
}

interface UpdateSubCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  subCategory: SubCategory | null;
  onSave: (updatedSubCategory: SubCategory) => void;
}

interface SubCategoryTableProps {
  SUBCATEGORY_DATA: SubCategory[];
  handleChangePage: (page: string, subCategoryId?: number) => void;
}

// Thành phần UpdateSubCategory
const UpdateSubCategory: React.FC<UpdateSubCategoryProps> = ({ isOpen, onClose, subCategory, onSave }) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);

  // Lấy danh sách danh mục chính từ API
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Category/tree", {
          headers: { Accept: "*/*" },
        });
        if (response.data.success) {
          const categories = response.data.data.map((cat: any) => ({
            id: cat.id,
            categoryName: cat.categoryName,
          }));
          setMainCategories(categories);
        }
      } catch (error) {
        message.error("Không thể lấy danh mục chính!");
      }
    };
    fetchMainCategories();
  }, []);

  useEffect(() => {
    if (subCategory) {
      form.setFieldsValue({
        name: subCategory.name,
        code: subCategory.code,
        parentCategory: subCategory.parentCategory,
        description: subCategory.description,
        categoryMainId: subCategory.categoryMainId,
      });
      setPreviewImage(subCategory.image || "assets/img/product/noimage.png");
    }
  }, [subCategory, form]);

  const handleUpload = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      const formData = new FormData();
      formData.append("CategoryName", values.name);
      formData.append("CategoryCode", subCategory!.code);
      formData.append("CategoryMainId", values.categoryMainId);
      if (file) {
        formData.append("Image", file);
      }

      const response = await axios.put(
        `http://pharmadistiprobe.fun/api/Category/${subCategory?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedSubCategory: SubCategory = {
          id: subCategory!.id,
          name: response.data.data.categoryName,
          code: response.data.data.categoryCode,
          categoryMainId: response.data.data.categoryMainId,
          parentCategory: values.parentCategory || subCategory!.parentCategory,
          description: values.description || subCategory!.description,
          createdBy: subCategory!.createdBy,
          image: response.data.data.image || subCategory!.image,
        };
        onSave(updatedSubCategory);
        message.success("Cập nhật danh mục thuốc thành công!");
        form.resetFields();
        setFile(null);
        setPreviewImage(null);
        onClose();
      } else {
        message.error("Cập nhật thất bại: " + response.data.message);
      }
    } catch (error: any) {
      message.error(error.message || "Cập nhật danh mục thuốc thất bại!");
    }
  };

  return (
    <Modal
      title="Cập nhật danh mục thuốc"
      open={isOpen}
      onCancel={() => {
        form.resetFields();
        setFile(null);
        setPreviewImage(null);
        onClose();
      }}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="image" label="Ảnh">
          <Upload showUploadList={false} beforeUpload={handleUpload} accept="image/*">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 mt-2 object-cover border rounded-md"
            />
          )}
        </Form.Item>

        <Form.Item
          name="name"
          label="Tên danh mục thuốc"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục thuốc!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="Mã danh mục thuốc"
          rules={[{ required: true, message: "Vui lòng nhập mã danh mục thuốc!" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="categoryMainId"
          label="Chủng loại"
          rules={[{ required: true, message: "Vui lòng chọn danh mục chính!" }]}
        >
          <Select placeholder="Chọn danh mục chính">
            {mainCategories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
{/* 
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

// Thành phần SubCategoryTable
const SubCategoryTable: React.FC<SubCategoryTableProps> = ({ SUBCATEGORY_DATA,  }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>(SUBCATEGORY_DATA);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState<number | null>(null);

  // Lấy danh sách danh mục chính từ API
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Category/tree", {
          headers: { Accept: "*/*" },
        });
        if (response.data.success) {
          const categories = response.data.data.map((cat: any) => ({
            id: cat.id,
            categoryName: cat.categoryName,
          }));
          setMainCategories(categories);
        }
      } catch (error) {
        message.error("Không thể lấy danh mục chính!");
      }
    };
    fetchMainCategories();
  }, []);

  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

  // const showDeleteConfirm = (subCategory: SubCategory) => {
  //   Modal.confirm({
  //     title: "Xác nhận xóa",
  //     icon: <ExclamationCircleOutlined />,
  //     content: `Bạn có chắc chắn muốn xóa danh mục thuốc "${subCategory.name}" không?`,
  //     okText: "Xóa",
  //     okType: "danger",
  //     cancelText: "Hủy",
  //     onOk() {
  //       setSubCategories(subCategories.filter((sub) => sub.id !== subCategory.id));
  //       message.success("Xóa danh mục thuốc thành công!");
  //     },
  //   });
  // };

  const handleRowSelectionChange = (selectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(selectedRowKeys as number[]);
  };

  // const printTable = () => {
  //   const selectedSubCategories =
  //     selectedRowKeys.length > 0
  //       ? subCategories.filter((subCategory) => selectedRowKeys.includes(subCategory.id))
  //       : subCategories;

  //   if (selectedSubCategories.length === 0) {
  //     message.warning("Không có danh mục thuốc nào được chọn để in.");
  //     return;
  //   }

  //   const printContents = `
  //     <h2 style="text-align: center;">Danh sách danh mục thuốc</h2>
  //     <table border="1" style="width: 100%; border-collapse: collapse;">
  //       <thead>
  //         <tr>
  //           <th>Mã danh mục</th>
  //           <th>Tên danh mục</th>
  //           <th>Chủng loại</th>
  //           <th>Người tạo</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         ${selectedSubCategories
  //           .map(
  //             (subCategory) => `
  //           <tr>
  //             <td>${subCategory.code}</td>
  //             <td>${subCategory.name}</td>
  //             <td>${subCategory.parentCategory}</td>
  //             <td>${subCategory.createdBy}</td>
  //           </tr>
  //         `
  //           )
  //           .join("")}
  //       </tbody>
  //     </table>
  //   `;

  //   const printWindow = window.open("", "", "height=800,width=1000");
  //   if (printWindow) {
  //     printWindow.document.write(printContents);
  //     printWindow.document.close();
  //     printWindow.print();
  //   }
  // };

  // const exportToExcel = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(subCategories);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "SubCategories");
  //   XLSX.writeFile(workbook, "DanhSachDanhMucPhu.xlsx");
  // };

  const filterSubCategories = () => {
    let filteredSubCategories = [...SUBCATEGORY_DATA];

    if (searchTerm.trim()) {
      filteredSubCategories = filteredSubCategories.filter((subCategory) =>
        removeVietnameseTones(subCategory.name).includes(removeVietnameseTones(searchTerm))
      );
    }

    if (selectedMainCategory !== null) {
      filteredSubCategories = filteredSubCategories.filter(
        (subCategory) => subCategory.categoryMainId === selectedMainCategory
      );
    }

    setSubCategories(filteredSubCategories);
  };

  useEffect(() => {
    filterSubCategories();
  }, [searchTerm, selectedMainCategory, SUBCATEGORY_DATA]);

  const columns = [
    {
      title: "Mã danh mục",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Danh mục thuốc",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: SubCategory) => (
        <div className="flex items-center gap-3">
          <img
            src={record.image || "assets/img/product/noimage.png"}
            alt={record.name}
            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
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
    // {
    //   title: "Người tạo",
    //   dataIndex: "createdBy",
    //   key: "createdBy",
    // },
    {
      title: <UnorderedListOutlined />,
      key: "actions",
      render: (_: any, record: SubCategory) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="edit"
                onClick={() => {
                  setSelectedSubCategory(record);
                  setIsEditModalOpen(true);
                }}
              >
                <EditOutlined /> Chỉnh sửa
              </Menu.Item>
              {/* <Menu.Item key="delete" onClick={() => showDeleteConfirm(record)} danger>
                <DeleteOutlined /> Xóa
              </Menu.Item> */}
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
          placeholder="Tìm kiếm theo tên danh mục thuốc"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Lọc theo chủng loại"
          style={{ width: 200 }}
          allowClear
          onChange={(value) => setSelectedMainCategory(value || null)}
        >
          {mainCategories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </Select.Option>
          ))}
        </Select>
        {/* <Button type="primary" icon={<FileExcelOutlined />} onClick={exportToExcel}>
          Xuất Excel
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={printTable}>
          In danh sách
        </Button> */}
        {/* <Button
          type="primary"
          onClick={() => handleChangePage("Tạo danh mục thuốc")}
        >
          + Tạo danh mục thuốc mới
        </Button> */}
      </div>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: handleRowSelectionChange,
        }}
        columns={columns}
        dataSource={subCategories}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <UpdateSubCategory
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subCategory={selectedSubCategory}
        onSave={(updatedSubCategory) => {
          setSubCategories(
            subCategories.map((sub) => (sub.id === updatedSubCategory.id ? updatedSubCategory : sub))
          );
        }}
      />
    </div>
  );
};

export default SubCategoryTable;