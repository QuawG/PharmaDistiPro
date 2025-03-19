import React, { useState } from "react";
import { Trash } from "lucide-react"; // Import the Trash icon

interface Product {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
    price: number; 
    tax: number; 
}

export default function AddPurchaseOrder() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [products] = useState<Product[]>([
        { id: 1, name: "Sản phẩm A" },
        { id: 2, name: "Sản phẩm B" },
        { id: 3, name: "Sản phẩm C" },
    ]);
    const [quantity, setQuantity] = useState<number>(1);

    const suppliers: Supplier[] = [
        { id: 1, name: "Nhà cung cấp 1", price: 100, tax: 10 },
        { id: 2, name: "Nhà cung cấp 2", price: 200, tax: 15 },
        { id: 3, name: "Nhà cung cấp 3", price: 300, tax: 5 },
    ];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleAddProduct = (product: Product) => {
        if (selectedSupplier) {
            const totalPrice = quantity * selectedSupplier.price * (1 + selectedSupplier.tax / 100);
            setSelectedProducts((prev) => [
                ...prev,
                {
                    ...product,
                    quantity: quantity,
                    price: selectedSupplier.price,
                    tax: selectedSupplier.tax,
                    totalPrice: totalPrice,
                },
            ]);
            setSearchTerm("");
            setQuantity(1);
        } else {
            alert("Vui lòng chọn nhà cung cấp trước!");
        }
    };

    const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const supplierId = parseInt(e.target.value);
        const supplier = suppliers.find(s => s.id === supplierId) || null;
        setSelectedSupplier(supplier);
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    // Function to delete a product from the selected products list
    const handleDeleteProduct = (id: number) => {
        setSelectedProducts(prev => prev.filter(product => product.id !== id));
    };

    // Calculate total amount
    const totalAmount = selectedProducts.reduce((sum, product) => sum + product.totalPrice, 0);

    // Function to format numbers to VNĐ
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    return (
        <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Tạo đơn đặt hàng (PO)</h1>
                <p className="text-sm text-gray-500">Tạo đơn đặt hàng mới</p>
            </div>

            {/* Chọn nhà cung cấp */}
            <div className="mb-4">
                <label className="block text-[14px] mb-2 text-gray-700">Chọn nhà cung cấp</label>
                <select
                    onChange={handleSupplierChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Chọn nhà cung cấp</option>
                    {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Quantity Input Section */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nhập số lượng sản phẩm</label>
                <div className="flex items-center mt-1">
                    <button onClick={decrementQuantity} className="px-4 py-2 bg-blue-500 text-white rounded-l-md hover:bg-blue-600 focus:outline-none">
                        -
                    </button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                    />
                    <button onClick={incrementQuantity} className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none">
                        +
                    </button>
                </div>
            </div>

            {/* Thanh tìm kiếm sản phẩm */}
            <div className="mb-4">
                <label className="block text-[14px] mb-2 text-gray-700">Tìm kiếm sản phẩm</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên sản phẩm"
                />
                <ul className="mt-2 border border-gray-300 rounded-md">
                    {products
                        .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(product => (
                            <li key={product.id} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleAddProduct(product)}>
                                {product.name}
                            </li>
                        ))}
                </ul>
            </div>

            {/* Form */}
            <div className="space-y-6 p-5 w-full bg-white rounded-lg shadow">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Mã đơn đặt hàng</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập mã đơn đặt hàng"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Nhà cung cấp</label>
                        <input
                            type="text"
                            value={selectedSupplier ? selectedSupplier.name : ""}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Ngày đặt hàng</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Ngày giao hàng</label>
                        <input
                            type="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Tổng số tiền</label>
                        <input
                            type="text"
                            value={formatCurrency(totalAmount) || "0.000 VNĐ"}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Phí vận chuyển</label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập phí vận chuyển"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">Địa chỉ giao hàng</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập địa chỉ giao hàng"
                        />
                    </div>
                </div>

                {/* Row 3 - Danh sách sản phẩm đã chọn */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Sản phẩm đã chọn:</h2>
                    <table className="min-w-full mt-2 border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2">Sản phẩm</th>
                                <th className="px-4 py-2">Số lượng</th>
                                <th className="px-4 py-2">Giá nhập</th>
                                <th className="px-4 py-2">Thuế (%)</th>
                                <th className="px-4 py-2">Tổng giá</th>
                                <th className="px-4 py-2">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map(product => (
                                <tr key={product.id} className="border-b">
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{product.quantity}</td>
                                    <td className="px-4 py-2">{formatCurrency(product.price)}</td>
                                    <td className="px-4 py-2">{product.tax}</td>
                                    <td className="px-4 py-2">{formatCurrency(product.totalPrice)}</td>
                                    <td className="px-4 py-2">
                                        <button 
                                            className="text-red-500 hover:text-red-600" 
                                            onClick={() => handleDeleteProduct(product.id)}
                                        >
                                            <Trash size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Row 4 */}
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