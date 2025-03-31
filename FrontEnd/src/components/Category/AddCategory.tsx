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
        message.success("Chủng loại đã được thêm thành công!");
        handleChangePage("Chủng loại");
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setPreviewImage(null);
        handleChangePage("Chủng loại");
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
            <Title level={2}>Tạo chủng loại</Title>
            <Text type="secondary">Tạo chủng loại mới</Text>

            <Card className="mt-5">
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                        label="Mã "
                        name="categoryCode"
                        rules={[{ required: true, message: "Vui lòng nhập mã !" }]}
                    >
                        <Input placeholder="Nhập mã " />
                    </Form.Item>
                    <Form.Item
                        label="Tên loại sản phẩm"
                        name="categoryName"
                        rules={[{ required: true, message: "Vui lòng nhập tên loại sản phẩm!" }]}
                    >
                        <Input placeholder="Nhập loại sản phẩm" />
                    </Form.Item>

                    

                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} placeholder="Nhập mô tả về loại sản phẩm" />
                    </Form.Item>

                    <Form.Item label="Ảnh">
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
