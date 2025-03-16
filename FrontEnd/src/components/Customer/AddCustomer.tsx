import { useState } from "react";

export default function AddCustomer() {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-5 w-full mt-[60px]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo khách hàng</h1>
                <p className="text-sm text-gray-500">Tạo khách hàng mới</p>
            </div>

            {/* Form */}
            <div className="space-y-6 p-5 w-full bg-gray-100 rounded-lg">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm text-gray-700 font-medium">Tên khách hàng</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên khách hàng"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập Email"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm text-gray-700 font-medium">Số điện thoại</label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="space-y-1">
                        <label className="block text-sm text-gray-700 font-medium">Địa chỉ</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm text-gray-700 font-medium">Trạng thái</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option value="">Chọn trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm text-gray-700 font-medium">Mật khẩu</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mật khẩu"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                    <button
                        type="submit"
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
