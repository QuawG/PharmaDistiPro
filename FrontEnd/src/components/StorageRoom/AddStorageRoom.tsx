import React, { useState } from "react";

interface StorageRoom {
    id: number;
    code: string; 
    name: string; 
    status: string; 
    temperature: number;
    humidity: number; 
    capacity: number; 
}

export default function AddStorageRoom() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, setStorageRooms] = useState<StorageRoom[]>([]);
    // storageRooms
    const [newStorageRoom, setNewStorageRoom] = useState<Partial<StorageRoom>>({
        code: "",
        name: "",
        status: "",
        temperature: 0,
        humidity: 0,
        capacity: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewStorageRoom((prev) => ({
            ...prev,
            [name]: name === "temperature" || name === "humidity" || name === "capacity" ? parseFloat(value) : value,
        }));
    };

    const handleAddStorageRoom = () => {
        if (!newStorageRoom.code || !newStorageRoom.name || !newStorageRoom.status) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        setStorageRooms((prev) => [
            ...prev,
            {
                id: prev.length + 1, // Tăng ID tự động
                ...newStorageRoom,
            } as StorageRoom,
        ]);

        // Reset form
        setNewStorageRoom({ code: "", name: "", status: "", temperature: 0, humidity: 0, capacity: 0 });
    };

    return (
        <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo kho mới</h1>
                <p className="text-sm text-gray-500">Tạo kho hàng mới</p>
            </div>

            {/* Form */}
            <div className="space-y-6 p-5 w-full bg-white rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Mã kho</label>
                        <input
                            type="text"
                            name="code"
                            value={newStorageRoom.code}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập mã kho"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Tên kho</label>
                        <input
                            type="text"
                            name="name"
                            value={newStorageRoom.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên kho"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Trạng thái</label>
                        <select
                            name="status"
                            value={newStorageRoom.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Không hoạt động">Không hoạt động</option>
                            <option value="Đang chờ">Đang chờ</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Nhiệt độ (°C)</label>
                        <input
                            type="number"
                            name="temperature"
                            value={newStorageRoom.temperature}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập nhiệt độ"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Độ ẩm (%)</label>
                        <input
                            type="number"
                            name="humidity"
                            value={newStorageRoom.humidity}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập độ ẩm"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Sức chứa</label>
                        <input
                            type="number"
                            name="capacity"
                            value={newStorageRoom.capacity}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập sức chứa"
                        />
                    </div>
                </div>

                {/* Nút Tạo kho */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleAddStorageRoom}
                        className="px-9 py-3.5 bg-amber-500 text-white rounded-sm font-bold text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Tạo kho
                    </button>
                    <button
                        type="button"
                        className="px-9 py-3.5 bg-gray-500 text-white rounded-sm font-bold text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}