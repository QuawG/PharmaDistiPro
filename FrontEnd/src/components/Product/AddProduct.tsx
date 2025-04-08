import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../pages/Home/AuthContext"; // Import useAuth để lấy user
import { Form, Input, Select, Button, Upload, message, Row, Col, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

interface Category {
  id: number;
  categoryMainId: number;
  categoryName: string;
  categoryCode: string;
  image: string | null;
  subCategories: any[];
}

export default function ProductAdd({ handleChangePage }: { handleChangePage: (page: string) => void }) {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const [form] = Form.useForm(); // Sử dụng Form của Ant Design
  const [categories, setCategories] = useState<Category[]>([]); // Lưu danh mục
  const [fileList, setFileList] = useState<any[]>([]); // Quản lý danh sách file ảnh
  const [loading, setLoading] = useState(false);

  // Lấy danh sách danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://pharmadistiprobe.fun/api/Category/subcategory");
        if (response.status === 200) {
          setCategories(response.data.data); // Lưu danh mục chính
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        message.error("Không thể tải danh sách danh mục. Vui lòng thử lại!");
      }
    };

    fetchCategories();
  }, []);

  // Xử lý thay đổi file upload
  const handleFileChange = ({ fileList }: any) => {
    // Chỉ cho phép file ảnh và kiểm tra kích thước
    const newFileList = fileList.filter((file: any) => {
      const isImage = file.type.startsWith("image/");
      const isLt10M = file.size / 1024 / 1024 < 10; // Kiểm tra kích thước < 10MB
      if (!isImage) {
        message.error("Chỉ được chọn tệp hình ảnh (PNG, JPG, JPEG, GIF)!");
        return false;
      }
      if (!isLt10M) {
        message.error("Ảnh phải nhỏ hơn 10MB!");
        return false;
      }
      return true;
    });
    setFileList(newFileList);
  };

  // Xử lý submit form
  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một ảnh sản phẩm!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại!");
      }

      // Chuẩn bị dữ liệu gửi lên API
      const formDataToSend = new FormData();
      formDataToSend.append("productName", values.productName);
      formDataToSend.append("manufactureName", values.manufactureName);
      formDataToSend.append("categoryId", values.categoryId);
      formDataToSend.append("unit", values.unit);
      formDataToSend.append("status", values.status);
      formDataToSend.append("description", values.description);
      formDataToSend.append("sellingPrice", values.sellingPrice);
      formDataToSend.append("storageconditions", values.storageconditions);
      formDataToSend.append("weight", values.weight);
      formDataToSend.append("vat", values.vat);
      formDataToSend.append("createdBy", user?.customerId.toString() || "");

      // Thêm các file ảnh vào FormData
      fileList.forEach((file: any) => {
        formDataToSend.append("images", file.originFileObj);
      });

      // Gửi yêu cầu lên API
      const response = await axios.post("http://pharmadistiprobe.fun/api/Product", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        message.success("Thêm sản phẩm thành công!");
        handleChangePage("Danh sách sản phẩm");
      } else {
        throw new Error("Phản hồi không hợp lệ từ server!");
      }
    } catch (error: any) {
      console.error("Failed to add product:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Thêm sản phẩm thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tạo sản phẩm</h1>
        <p className="text-sm text-gray-500">Nhập thông tin chi tiết của sản phẩm mới</p>
      </div>

      <Card title="Thông tin sản phẩm" className="w-full">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "true", // Giá trị mặc định cho status
          }}
        >
          <Row gutter={16}>
            {/* <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Mã sản phẩm"
                name="productCode"
                rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm!" }]}
              >
                <Input />
              </Form.Item>
            </Col> */}
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Tên sản phẩm"
                name="productName"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Nhà sản xuất"
                name="manufactureName"
                rules={[{ required: true, message: "Vui lòng nhập nhà sản xuất!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Danh mục"
                name="categoryId"
                rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.categoryName.trim()}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>

            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select>
                  <Option value="true">Đang bán</Option>
                  <Option value="false">Ngừng bán</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Đơn vị tính"
                name="unit"
                rules={[{ required: true, message: "Vui lòng nhập đơn vị tính!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Giá bán (VND)"
                name="sellingPrice"
                rules={[
                  { required: true, message: "Vui lòng nhập giá bán!" },
                  {
                    validator: async (_, value) => {
                      if (!value || Number(value) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Giá bán phải là số dương!"));
                    },
                  },
                ]}
              >
                <Input type="number" min={0} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Trọng lượng (kg)"
                name="weight"
                rules={[
                  { required: true, message: "Vui lòng nhập trọng lượng!" },
                  {
                    validator: async (_, value) => {
                      if (!value || Number(value) > 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Trọng lượng phải là số dương!"));
                    },
                  },
                ]}
              >
                <Input type="number" min={0} step="0.01" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="Nhiệt độ bảo quản (°C)"
                name="storageconditions"
                rules={[
                  { required: true, message: "Vui lòng nhập nhiệt độ bảo quản!" },
                  {
                    validator: async (_, value) => {
                      if (!value || !isNaN(Number(value))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Nhiệt độ bảo quản phải là số!"));
                    },
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item
                label="VAT (%)"
                name="vat"
                rules={[
                  { required: true, message: "Vui lòng nhập VAT!" },
                  {
                    validator: async (_, value) => {
                      if (!value || Number(value) >= 0) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("VAT phải là số không âm!"));
                    },
                  },
                ]}
              >
                <Input type="number" min={0} max={100} />
              </Form.Item>
            </Col>
          </Row>


          <Form.Item
            label="Mô tả sản phẩm"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item label="Ảnh sản phẩm">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={() => false} // Ngăn upload tự động, xử lý trong handleSubmit
              multiple // Cho phép chọn nhiều ảnh
              accept="image/png,image/jpeg,image/gif"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tới 10MB</p>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => handleChangePage("Danh sách sản phẩm")}
              disabled={loading}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}