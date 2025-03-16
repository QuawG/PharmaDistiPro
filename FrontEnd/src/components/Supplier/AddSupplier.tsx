export default function AddSupplier() {
    return (
        <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
    
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo mới nhà cung cấp</h1>
                <p className="text-sm text-gray-500">Tạo mới nhà cung cấp theo form bên dưới</p>
            </div>

  
            <div className="space-y-6 p-5 w-full bg-white rounded-lg shadow">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Tên nhà cung cấp</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập tên nhà cung cấp "
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập email"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Trạng thái</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                            <option value="">Tùy chỉnh trạng thái</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                {/* Row 3 */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-9 py-3.5 bg-amber-500 text-white rounded-sm font-bold text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Lưu
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