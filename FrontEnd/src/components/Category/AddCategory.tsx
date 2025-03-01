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
        handleChangePage("Category List");
    };
    
    const handleCancel = () => {
        setCategoryName("");
        setCategoryCode("");
        setDescription("");
        setImage(null);
        handleChangePage("Category List");
    };

    return (
        <div className="p-6 mt-[60px] w-full bg-[#f8f9fc]">
            <h1 className="text-2xl font-semibold text-gray-900">Add Category</h1>
            <p className="text-sm text-gray-500">Create new category</p>

            <div className="mt-5 bg-white shadow rounded-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Category Name</label>
                        <input
                            type="text"
                            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Category Code</label>
                        <input
                            type="text"
                            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={categoryCode}
                            onChange={(e) => setCategoryCode(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Description</label>
                        <textarea
                            className="border border-gray-300 p-3 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Upload Image</label>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            className="border border-gray-300 p-2 w-full rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="bg-[#FF9F43] hover:bg-orange-600 text-white px-5 py-2 rounded-md font-medium shadow-md"
                        >
                            Submit
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md font-medium shadow-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
