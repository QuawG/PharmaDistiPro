import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface Category {
  id: number;
  name: string;
  code: string;
  createdBy: string;
  image?: string;
}

interface UpdateCategoryProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSave: (updatedCategory: Category) => void;
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({
  isOpen,
  onClose,
  category,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
      setPreviewImage(category.image || "assets/img/product/noimage.png");
    }
  }, [category, form]);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
        form.setFieldsValue({ image: e.target.result as string });
      }
    };
    reader.readAsDataURL(file);
    return false; // Ngăn không tải lên server
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({ ...category, ...values });
      message.success("Cập nhật loại sản phẩm!");
      onClose();
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin!");
    }
  };

  return (
    <Modal
      title="Cập nhật loại sản phẩm"
      open={isOpen}
      onCancel={onClose}
      onOk={handleSave}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        {/* Upload ảnh */}
        <Form.Item name="image" label="Ảnh ">
          <Upload
            showUploadList={false}
            beforeUpload={handleUpload}
            accept="image/*"
          >
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
          label="Tên loại sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên loại sản phẩm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="Mã "
          rules={[{ required: true, message: "Vui lòng nhập mã !" }]}
        >
          <Input />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default UpdateCategory;