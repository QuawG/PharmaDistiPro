import React, { useState } from "react";
import { Form, Input, Select, Upload, Button, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const SubAddCategory: React.FC<{ handleChangePage: (page: string) => void }> = ({ handleChangePage }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit = (values: any) => {
        console.log("Adding Sub Category:", values);
        message.success("Danh mục phụ đã được thêm thành công!");
        handleChangePage("Danh sách danh mục phụ");
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setPreviewImage(null);
        handleChangePage("Danh sách danh mục phụ");
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
                <Title level={2} >Tạo danh mục thuốc</Title>
                <Text type="secondary" className="block  mb-5">Tạo danh mục thuốc mới</Text>

                <Form form={form} layout="vertical" onFinish={handleSubmit} className="w-full">
                    {/* Danh mục hệ thống */}
                    <Form.Item
                        label="Chủng loại"
                        name="parentCategory"
                        rules={[{ required: true, message: "Vui lòng chọn chủng loại!" }]}
                    >
                        <Select placeholder="Chọn chủng loại">
                            <Option value="Category">Chủng loại</Option>
                        </Select>
                    </Form.Item>
                    {/* Mã danh mục */}
                    <Form.Item
                        label="Mã danh mục"
                        name="categoryCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã danh mục!" }]}
                    >
                        <Input placeholder="Nhập mã danh mục" />
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
