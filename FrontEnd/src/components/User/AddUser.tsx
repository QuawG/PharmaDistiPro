import { useState } from "react";
import { Form, Input, Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function AddUser() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        employeeId: '',
        status: '',
        password: '',
        avatar: '' // Add avatar to the initial state
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setAvatarPreview(e.target.result as string);
                setUser({ ...user, avatar: e.target.result as string });
            }
        };
        reader.readAsDataURL(file);
        return false; // Prevent uploading to the server
    };

    const handleSubmit = async () => {
        try {
            console.log("User data:", user);
            message.success("Đã tạo người dùng thành công!");
        } catch (error) {
            message.error("Vui lòng điền đầy đủ thông tin!");
        }
    };

    return (
        <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo người dùng mới</h1>
                <p className="text-sm text-gray-500">Tạo một người dùng mới</p>
            </div>

            <div className="p-5 bg-white rounded-lg shadow w-full max-w-7xl mx-auto">
                {/* Form */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                        <Form.Item label="Mã số nhân viên" name="employeeId" required>
                            <Input
                                name="employeeId"
                                value={user.employeeId}
                                onChange={handleChange}
                                placeholder="Nhập mã số nhân viên"
                            />
                        </Form.Item>


                        <Form.Item label="Tên riêng" name="firstName" required>
                            <Input
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                placeholder="Nhập tên riêng"
                            />
                        </Form.Item>

                        <Form.Item label="Tên họ" name="lastName" required>
                            <Input
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                placeholder="Nhập tên họ"
                            />
                        </Form.Item>

                        <Form.Item label="Email" name="email" required>
                            <Input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                            />
                        </Form.Item>

                        <Form.Item label="Số điện thoại" name="phone" required>
                            <Input
                                type="tel"
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address" required>
                            <Input
                                name="address"
                                value={user.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                            />
                        </Form.Item>

                        <Form.Item label="Vai trò" name="role" required>
                            <Select
                                value={user.role}
                                onChange={(value) => setUser({ ...user, role: value })}
                                placeholder="Chọn vai trò"
                            >
                                <Select.Option value="warehouse_manager">Quản lý kho</Select.Option>
                                <Select.Option value="sales_staff">Nhân viên bán hàng</Select.Option>
                                <Select.Option value="sales_manager">Quản lý bán hàng</Select.Option>
                            </Select>
                        </Form.Item>


                        <Form.Item label="Trạng thái tài khoản" name="status" required>
                            <Select
                                value={user.status}
                                onChange={(value) => setUser({ ...user, status: value })}
                                placeholder="Chọn trạng thái tài khoản"
                            >
                                <Select.Option value="active">Kích hoạt</Select.Option>
                                <Select.Option value="inactive">Vô hiệu hóa</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Mật khẩu" name="password" required>
                            <Input.Password
                                name="password"
                                value={user.password}
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
