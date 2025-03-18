import { useState } from "react";

export default function AddCustomer() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [customer, setCustomer] = useState({
        firstName: '',
        email: '',
        phone: '',
        address: '',
        status: '',
        password: '',
        pharmacyCode: '',  // New field for Pharmacy Code
        taxCode: '',       // New field for Tax Code
    });

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Customer data:', customer);
    };

    return (
        <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo nhà thuốc</h1>
                <p className="text-sm text-gray-500">Tạo nhà thuốc mới</p>
            </div>

            {/* Form */}
            <div className="space-y-6 p-5 w-full bg-white rounded-lg shadow">
                {/* Row for Avatar */}
                <div className="flex items-center space-x-4 mb-6">
                    <label className="block text-sm text-gray-700 font-medium">Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                {avatarPreview && (
                    <div className="mb-4">
                        <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full border border-gray-300 object-cover" />
                    </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Tên nhà thuốc</label>
                        <input
                            type="text"
                            name="firstName"
                            value={customer.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên nhà thuốc"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={customer.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập Email"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={customer.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            name="address"
                            value={customer.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Mã nhà thuốc</label>
                        <input
                            type="text"
                            name="pharmacyCode"
                            value={customer.pharmacyCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập mã nhà thuốc"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Mã số thuế</label>
                        <input
                            type="text"
                            name="taxCode"
                            value={customer.taxCode}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập mã số thuế"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Trạng thái</label>
                        <select
                            name="status"
                            value={customer.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            name="password"
                            value={customer.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold text-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                    >
                        Lưu
                    </button>
                    <button
                        type="button"
                        className="px-6 py-3 bg-gray-500 text-white rounded-md font-semibold text-sm hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}