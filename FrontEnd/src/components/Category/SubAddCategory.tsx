import React, { useState, useEffect } from "react";
import { Form, Input, Select, Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useAuth } from "../../pages/Home/AuthContext"; // Điều chỉnh đường dẫn theo cấu trúc dự án

const { Title, Text } = Typography;
const { Option } = Select;

interface MainCategory {
  id: number;
  categoryName: string;
}

const SubAddCategory: React.FC<{ handleChangePage: (page: string) => void }> = ({ handleChangePage }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
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
        } else {
          message.error("Không thể lấy danh mục chính: " + response.data.message);
        }
      } catch (error) {
        message.error("Lỗi khi lấy danh mục chính!");
      }
    };
    fetchMainCategories();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }
      if (!user) {
        throw new Error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      }

      const formData = new FormData();
      formData.append("CategoryName", values.categoryName);
      formData.append("CategoryMainId", values.parentCategory);
      if (fileList[0]) {
        formData.append("Image", fileList[0]);
      }

      const response = await axios.post("http://pharmadistiprobe.fun/api/Category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        message.success("Danh mục thuốc đã được thêm thành công!");
        form.resetFields();
        setFileList([]);
        setPreviewImage(null);
        handleChangePage("Danh sách danh mục thuốc");
      } else {
        message.error("Tạo danh mục thuốc thất bại: " + response.data.message);
      }
    } catch (error: any) {
      message.error(error.message || "Tạo danh mục thuốc thất bại!");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setPreviewImage(null);
    handleChangePage("Danh sách danh mục thuốc");
  };

  const handleImageChange = ({ file }: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFileList([file]);
  };

  return (
    <div className="p-6 mt-[60px] w-full bg-[#f8f9fc]">
      <div className="w-[80%]">
        <Title level={2}>Tạo danh mục thuốc</Title>
        <Text type="secondary" className="block mb-5">
          Tạo danh mục thuốc mới
        </Text>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="w-full">
          {/* Danh mục hệ thống */}
          <Form.Item
            label="Chủng loại"
            name="parentCategory"
            rules={[{ required: true, message: "Vui lòng chọn chủng loại!" }]}
          >
            <Select placeholder="Chọn chủng loại">
              {mainCategories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Tên danh mục */}
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          {/* Ảnh danh mục */}
          <Form.Item label="Ảnh danh mục">
            <Upload
              beforeUpload={(file) => {
                handleImageChange({ file });
                return false;
              }}
              onRemove={() => {
                setFileList([]);
                setPreviewImage(null);
              }}
              fileList={fileList}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {previewImage && (
              <div className="mt-3 flex justify-center">
                <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
              </div>
            )}
            <Text type="secondary">Hỗ trợ định dạng PNG, JPG, GIF (tối đa 10MB)</Text>
          </Form.Item>

          {/* Nút lưu & hủy */}
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SubAddCategory;