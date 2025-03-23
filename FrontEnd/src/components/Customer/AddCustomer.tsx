import { useState } from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function AddCustomer() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [customer, setCustomer] = useState({
        firstName: '',
        email: '',
        phone: '',
        address: '',
        status: '',
        password: '',
        pharmacyCode: '',
        taxCode: '',
        avatar: '' // Add avatar to the initial state
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setAvatarPreview(e.target.result as string);
                setCustomer({ ...customer, avatar: e.target.result as string });
            }
        };
        reader.readAsDataURL(file);
        return false; // Prevent uploading to the server
    };

    const handleSubmit = async () => {
        try {
            console.log("Customer data:", customer);
            message.success("Đã tạo nhà thuốc thành công!");
        } catch (error) {
            message.error("Vui lòng điền đầy đủ thông tin!");
        }
    };

    return (
        <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo nhà thuốc</h1>
                <p className="text-sm text-gray-500">Tạo nhà thuốc mới</p>
            </div>



            {/* Form */}
            <div className="p-5 bg-white rounded-lg shadow w-full max-w-7xl mx-auto">
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="space-y-6 p-5 w-full bg-white rounded-lg shadow"
                >
                    {/* Avatar */}
                    <Form.Item label="Avatar" valuePropName="fileList" getValueFromEvent={handleAvatarChange}>
                        <Upload
                            name="avatar"
                            showUploadList={false}
                            beforeUpload={handleAvatarChange}
                            accept="image/*"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover" />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item label="Tên nhà thuốc" name="firstName" required>
                            <Input
                                name="firstName"
                                value={customer.firstName}
                                onChange={handleChange}
                                placeholder="Nhập tên nhà thuốc"
                            />
                        </Form.Item>

                        <Form.Item label="Mã nhà thuốc" name="pharmacyCode" required>
                            <Input
                                type="text"
                                name="pharmacyCode"
                                value={customer.pharmacyCode}
                                onChange={handleChange}
                                placeholder="Nhập mã nhà thuốc"
                            />
                        </Form.Item>

                        <Form.Item label="Số điện thoại" name="phone" required>
                            <Input
                                type="tel"
                                name="phone"
                                value={customer.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address" required>
                            <Input
                                type="text"
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                            />
                        </Form.Item>

                        <Form.Item label="Email" name="email" required>
                            <Input
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                placeholder="Nhập Email"
                            />
                        </Form.Item>

                        <Form.Item label="Mã số thuế" name="taxCode" required>
                            <Input
                                type="text"
                                name="taxCode"
                                value={customer.taxCode}
                                onChange={handleChange}
                                placeholder="Nhập mã số thuế"
                            />
                        </Form.Item>

                        <Form.Item label="Trạng thái" required>
                            <Select
                                value={customer.status}
                                onChange={(value) => setCustomer({ ...customer, status: value })}
                                placeholder="Chọn trạng thái"
                            >
                                <Select.Option value="active">Hoạt động</Select.Option>
                                <Select.Option value="inactive">Không hoạt động</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Mật khẩu" name="password" required>
                            <Input.Password
                                name="password"
                                value={customer.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                            />
                        </Form.Item>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold text-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                        >
                            Tạo
                        </Button>
                        <Button
                            type="default"
                            onClick={() => console.log('Cancel action')}
                            className="px-6 py-3 bg-gray-500 text-white rounded-md font-semibold text-sm hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                        >
                            Hủy
                        </Button>
                    </div>
                </Form>
            </div>

        </div>
    );
}
