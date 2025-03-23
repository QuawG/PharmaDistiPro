import React, { useState } from "react";
import { Form, Input, Upload, Button, Card, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AddCategory: React.FC<{ handleChangePage: (page: string) => void }> = ({ handleChangePage }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleSubmit = (values: any) => {
        console.log("Adding Category:", values);
        message.success("Danh mục đã được thêm thành công!");
        handleChangePage("Danh sách danh mục chính");
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setPreviewImage(null);
        handleChangePage("Danh sách danh mục chính");
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
            <Title level={2}>Tạo danh mục chính</Title>
            <Text type="secondary">Tạo danh mục chính mới</Text>

            <Card className="mt-5">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Tên danh mục"
                        name="categoryName"
                        rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
                    >
                        <Input placeholder="Nhập tên danh mục" />
                    </Form.Item>

                    <Form.Item
                        label="Mã danh mục"
                        name="categoryCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã danh mục!" }]}
                    >
                        <Input placeholder="Nhập mã danh mục" />
                    </Form.Item>

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} placeholder="Nhập mô tả danh mục" />
                    </Form.Item>

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
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {previewImage && (
                            <div className="mt-3">
                                <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
                            </div>
                        )}
                        <Text type="secondary">Hỗ trợ định dạng PNG, JPG, GIF (tối đa 10MB)</Text>
                    </Form.Item>

                    <div className="flex gap-4">
                        <Button type="primary" htmlType="submit">
                            Lưu
                        </Button>
                        <Button onClick={handleCancel}>Hủy</Button>
                        
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AddCategory;
