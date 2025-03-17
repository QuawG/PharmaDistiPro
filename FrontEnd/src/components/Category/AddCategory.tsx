import React, { useState } from "react";

const AddCategory: React.FC<{ handleChangePage: (page: string) => void }> = ({ handleChangePage }) => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryCode, setCategoryCode] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Adding Category:", { categoryName, categoryCode, description, image });
        alert("Category added successfully!");
        handleChangePage("Danh sách danh mục chính");
    };

    const handleCancel = () => {
        setCategoryName("");
        setCategoryCode("");
        setDescription("");
        setImage(null);
        handleChangePage("Danh sách danh mục chính");
    };

    return (
        <div className="p-6 mt-[60px] w-full bg-[#f8f9fc]">
            <h1 className="text-2xl font-semibold text-gray-900">Tạo danh mục chính</h1>
            <p className="text-sm text-gray-500">Tạo danh mục chính mới</p>

            <div className="mt-5 bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Tên danh mục</label>
                        <input
                            type="text"
                            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Mã danh mục</label>
                        <input
                            type="text"
                            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categoryCode}
                            onChange={(e) => setCategoryCode(e.target.value)}
                            required
                        />
                    </div>



                    <div className="space-y-1">
                        <label className="block text-[14px] mb-2 text-gray-700">
                            Ảnh danh mục
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                    >
                                        <span>Chọn file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">hoặc kéo thả</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF tới 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-[#FF9F43] hover:bg-orange-600 text-white px-5 py-2 rounded-md font-medium shadow-md"
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md font-medium shadow-md"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
