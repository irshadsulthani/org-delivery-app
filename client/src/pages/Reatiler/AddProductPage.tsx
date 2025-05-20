import { useState, useEffect, FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiX, FiCheck, FiShoppingBag, FiDollarSign, FiBox, FiTag, FiAlignLeft } from "react-icons/fi";
import { addProduct } from "../../api/reatilerApi";
import RetailerSidebar from "../../components/Retailer/ReatilerSidebar";

function AddProductPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    unit: "kg" as const,
  });

  const [images, setImages] = useState<{
    file: File;
    preview: string;
    uploaded?: { url: string; publicId: string };
  }[]>([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    images.length > 0 ? 0 : null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
        .slice(0, 3 - images.length) // Limit to 3 images
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      setImages((prev) => [...prev, ...newImages]);
      
      // If this is the first image, select it
      if (images.length === 0 && newImages.length > 0) {
        setSelectedImageIndex(0);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      
      // Adjust selected image index if necessary
      if (newImages.length === 0) {
        setSelectedImageIndex(null);
      } else if (selectedImageIndex === index) {
        setSelectedImageIndex(0);
      } else if (selectedImageIndex !== null && selectedImageIndex > index) {
        setSelectedImageIndex(selectedImageIndex - 1);
      }
      
      return newImages;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("price", product.price.toString());
      formData.append("quantity", product.quantity.toString());
      formData.append("description", product.description);
      formData.append("unit", product.unit);

      // Append all images
      images.forEach((image) => {
        formData.append("images", image.file);
      });

      await addProduct(formData);
      setSuccess(true);
      setTimeout(() => navigate("/retailer/products"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const tabs = ["Basic Info", "Description", "Images"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RetailerSidebar collapsed={false} setCollapsed={function (collapsed: boolean): void {
        throw new Error("Function not implemented.");
      }} />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
            <button
              type="button"
              onClick={() => navigate("/retailer/products")}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-center shadow-sm">
              <FiX className="mr-3 flex-shrink-0" size={20} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md flex items-center shadow-sm">
              <FiCheck className="mr-3 flex-shrink-0" size={20} />
              <span>Product added successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`px-6 py-4 font-medium text-sm ${
                      activeTab === index
                        ? "text-green-600 border-b-2 border-green-500 bg-green-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiShoppingBag className="mr-2" size={16} />
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={product.name}
                          onChange={handleInputChange}
                          placeholder="Enter product name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <FiTag className="mr-2" size={16} />
                          Category
                        </label>
                        <input
                          type="text"
                          name="category"
                          value={product.category}
                          onChange={handleInputChange}
                          placeholder="Product category"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FiDollarSign className="mr-2" size={16} />
                            Price
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                              $
                            </span>
                            <input
                              type="number"
                              name="price"
                              min="0"
                              step="0.01"
                              value={product.price}
                              onChange={handleInputChange}
                              placeholder="0.00"
                              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FiBox className="mr-2" size={16} />
                            Quantity
                          </label>
                          <input
                            type="number"
                            name="quantity"
                            min="0"
                            value={product.quantity}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Unit of Measurement
                        </label>
                        <select
                          name="unit"
                          value={product.unit}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="kg">Kilogram (kg)</option>
                          <option value="g">Gram (g)</option>
                          <option value="lb">Pound (lb)</option>
                          <option value="piece">Piece</option>
                          <option value="bunch">Bunch</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 w-full">
                        <div className="text-gray-400 mb-3">
                          <FiShoppingBag size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-1">
                          {product.name || "New Product"}
                        </h3>
                        <p className="text-gray-500 mb-2">
                          {product.category || "Category"}
                        </p>
                        <div className="text-lg font-semibold text-green-600">
                          ${product.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {product.quantity} {product.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiAlignLeft className="mr-2" size={16} />
                      Product Description
                    </label>
                    <textarea
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product in detail. Include features, benefits, and any other information customers should know."
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>
                        {product.description.length} characters
                        {product.description.length < 100 && product.description.length > 0 && (
                          <span className="text-amber-500 ml-2">
                            (Consider adding more details)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Product Images</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {images.map((image, index) => (
                              <div 
                                key={index} 
                                className={`relative group cursor-pointer ${
                                  selectedImageIndex === index ? "ring-2 ring-green-500" : ""
                                }`}
                                onClick={() => setSelectedImageIndex(index)}
                              >
                                <div className="aspect-w-1 aspect-h-1">
                                  <img
                                    src={image.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-md"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FiX size={14} />
                                </button>
                              </div>
                            ))}
                            
                            {images.length < 3 && (
                              <div
                                className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer h-24 hover:bg-gray-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <FiUpload className="text-gray-400 mb-1" size={20} />
                                <span className="text-xs text-gray-500">Upload</span>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handleImageChange}
                                  className="hidden"
                                  accept="image/*"
                                  multiple
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Upload up to 3 high-quality images of your product. First image will be used as the main image.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Image Preview</h3>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                          {selectedImageIndex !== null && images[selectedImageIndex] ? (
                            <div className="relative">
                              <img
                                src={images[selectedImageIndex].preview}
                                alt="Selected preview"
                                className="rounded-lg max-h-72 max-w-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <FiUpload className="text-gray-400 mb-2 mx-auto" size={32} />
                              <p className="text-gray-500">No images selected</p>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-3 px-3 py-1 text-sm text-green-600 border border-green-500 rounded-md hover:bg-green-50"
                              >
                                Upload Images
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {activeTab < 2 ? (
                    <span>All fields marked with * are required</span>
                  ) : (
                    <span>At least one product image is required</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  {activeTab > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab - 1)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}
                  {activeTab < 2 ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab + 1)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || images.length === 0}
                      className={`px-5 py-2 rounded-md text-white font-medium ${
                        isSubmitting || images.length === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      } flex items-center`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <FiCheck className="mr-2" />
                          Add Product
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;