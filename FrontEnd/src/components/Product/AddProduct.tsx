export default function ProductAdd() {
    return (
      <div className="p-6 w-full transition-all rounded-lg shadow-sm mt-[60px] bg-[#fafbfe]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Product Add</h1>
          <p className="text-sm text-gray-500">Create new product</p>
        </div>
  
        {/* Form */}
        <div className="space-y-6 p-5 w-full bg-white rounded-lg shadow">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Choose Category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="food">Food</option>
              </select>
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Sub Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Choose Sub Category</option>
                <option value="phones">Phones</option>
                <option value="laptops">Laptops</option>
                <option value="tablets">Tablets</option>
              </select>
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Brand
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Choose Brand</option>
                <option value="apple">Apple</option>
                <option value="samsung">Samsung</option>
                <option value="sony">Sony</option>
              </select>
            </div>
          </div>
  
          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Unit
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Choose Unit</option>
                <option value="piece">Piece</option>
                <option value="kg">Kilogram</option>
                <option value="liter">Liter</option>
              </select>
            </div>
  
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Minimum Qty
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter minimum quantity"
              />
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
              />
            </div>
          </div>
  
          {/* Description */}
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>
  
          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Tax
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Choose Tax</option>
                <option value="none">None</option>
                <option value="vat">VAT (10%)</option>
                <option value="gst">GST (7%)</option>
              </select>
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Discount Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Percentage</option>
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Price
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>
  
            <div className="space-y-1">
              <label className="block text-[14px] mb-2 text-gray-700">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  bg-white">
                <option value="">Closed</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
  
          <div className="space-y-1">
            <label className="block text-[14px] mb-2 text-gray-700">
              Product Image
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
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
  
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-9 py-3.5 bg-amber-500 text-white rounded-sm font-bold text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-9 py-3.5 bg-gray-500 text-white rounded-sm font-bold text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }
  