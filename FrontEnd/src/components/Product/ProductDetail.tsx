import { ChevronLeft, ChevronRight, Printer, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function ProductDetailsModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
      const timer = setTimeout(() => setMounted(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out bg-black/30 backdrop-blur-sm ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-[90vw] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl transition-all duration-300 ease-out transform ${
          visible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-8 scale-95 opacity-0"
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Product Details</h1>
            <p className="text-sm text-gray-500">Full details of a product</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6 p-4 border-gray-300 border-[1px] rounded-lg inline-block">
                <div className="flex items-center gap-4">
                  <img src="https://cdn-dfhjh.nitrocdn.com/BzQnABYFnLkAUVnIDRwDtFjmHEaLtdtL/assets/images/optimized/rev-a58b9b0/www.gtin.info/wp-content/uploads/2015/02/barcode-16.png" alt="Barcode" className="h-20" />
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Printer className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Details Table */}
              <div className="border-[1px] border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <tbody >
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50 w-1/3">Product</td>
                      <td className="px-4 py-3">Macbook pro</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Category</td>
                      <td className="px-4 py-3">Computers</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Sub Category</td>
                      <td className="px-4 py-3">None</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Brand</td>
                      <td className="px-4 py-3">None</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Unit</td>
                      <td className="px-4 py-3">Piece</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">SKU</td>
                      <td className="px-4 py-3">PT0001</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Minimum Qty</td>
                      <td className="px-4 py-3">5</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Quantity</td>
                      <td className="px-4 py-3">50</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Tax</td>
                      <td className="px-4 py-3">0.00 %</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Discount Type</td>
                      <td className="px-4 py-3">Percentage</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Price</td>
                      <td className="px-4 py-3">1500.00</td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Status</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                      </td>
                    </tr>
                    <tr className="border-b-[1px] border-b-gray-300">
                      <td className="px-4 py-3 bg-gray-50">Description</td>
                      <td className="px-4 py-3">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Product Image */}
            <div className="lg:col-span-1">
              <div className="border-[1px] border-gray-300 rounded-lg p-4">
                <div className="relative">
                  <img src="https://mac24h.vn/images/detailed/94/macbook_pro_2019_gia_tot_4j3d-ch.jpg" alt="Product" className="w-full rounded-lg" />
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-50">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-50">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-center text-sm text-gray-600">
                  macbookpro.jpg
                  <span className="text-gray-400 ml-1">581kb</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}