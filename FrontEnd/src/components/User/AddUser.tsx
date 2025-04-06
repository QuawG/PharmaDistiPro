import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import $ from "jquery"; // Import jQuery nếu bạn cần dùng nó


const { Option } = Select;

// Define role mapping
const roles = {
  1: "Giám đốc",
  2: "Quản lí kho",
  3: "Trưởng phòng kinh doanh",
  4: "Nhân viên bán hàng",
};

export default function AddUser() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // Specify the type as string | null
  const [form] = Form.useForm(); // Sử dụng Form instance của Ant Design để quản lý form
  const [file, setFile] = useState<File | null>(null); // Specify the type as File | null

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const selectedFile = fileInput.files[0];
      setFile(selectedFile); // TypeScript will now know that 'file' can be a File or null
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setAvatarPreview(event.target.result as string); // 'avatarPreview' is now a string or null
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (values:any) => {
    const formData = new FormData();
    formData.append("UserName", values.userName);
    formData.append("FirstName", values.firstName);
    formData.append("LastName", values.lastName);
    formData.append("Phone", values.phone);
    formData.append("Email", values.email);
    formData.append("Password", values.password);
    formData.append("Address", values.address);
    formData.append("Age", values.age.toString()); // Chuyển số thành chuỗi
    formData.append("RoleId", values.roleId.toString());
    formData.append("Status", values.status.toString());
    if (file) {
      formData.append("avatar", file); // Thêm file avatar nếu có
    }
    $.ajax({
        async: false,
        type: "POST",
        url: 'http://pharmadistiprobe.fun/api/User/CreateUser',
        data: formData,
        processData: false, // không xử lý dữ liệu
        contentType: false, // không gửi content type mặc định
        success: function (receivedData) {
            // remove localStorage
            console.log(receivedData);
           message.success("Đã tạo người dùng thành công!");
        form.resetFields(); // Reset form sau khi thành công
        setAvatarPreview(null);
        setFile(null);        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        error: function (xhr) {
            console.error(xhr.responseText);
            $('#errorMessage').removeClass('d-none');
            $('#errorMessage').fadeIn().delay(3000).fadeOut();
        }
    });

    
  };

  return (
    <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Tạo người dùng mới</h1>
        <p className="text-sm text-gray-500">Tạo một người dùng mới theo form bên dưới</p>
      </div>

      <div className="p-5 bg-white rounded-lg shadow w-full max-w-7xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: true }} // Giá trị mặc định cho status
        >
          <Form.Item label="Avatar">
            <Input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 rounded-full object-cover mt-2"
              />
            )}
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Form.Item
              label="Tên đăng nhập"
              name="userName"
              rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>

            <Form.Item
              label="Tên riêng"
              name="firstName"
              rules={[{ required: true, message: "Vui lòng nhập tên riêng!" }]}
            >
              <Input placeholder="Nhập tên riêng" />
            </Form.Item>

            <Form.Item
              label="Tên họ"
              name="lastName"
              rules={[{ required: true, message: "Vui lòng nhập tên họ!" }]}
            >
              <Input placeholder="Nhập tên họ" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
            >
              <Input type="tel" placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input type="email" placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Tuổi"
              name="age"
              rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
            >
              <Input type="number" placeholder="Nhập tuổi" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="roleId"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select placeholder="Chọn vai trò">
                {Object.entries(roles).map(([id, name]) => (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái tài khoản"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái tài khoản!" }]}
            >
              <Select placeholder="Chọn trạng thái tài khoản">
                <Option value={true}>Kích hoạt</Option>
                <Option value={false}>Vô hiệu hóa</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="default" onClick={() => message.info("Đã hủy!")}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
