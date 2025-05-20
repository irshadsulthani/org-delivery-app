import { useState, useEffect, FormEvent, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FiUpload, FiX, FiCheck, FiShoppingBag, FiDollarSign, 
  FiBox, FiTag, FiAlignLeft, FiEdit2, FiTrash2, FiImage 
} from "react-icons/fi";
import { toast } from "react-toastify";
import { getProductById, updateProduct } from "../../api/reatilerApi";
import RetailerSidebar from "../../components/Retailer/ReatilerSidebar";

type ProductImage = {
  url: string;
  publicId: string;
  isNew?: boolean;
  file?: File;
  preview?: string;
};

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    description: "",
    unit: "kg" as const,
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId!);
        setProduct({
          name: response.data.name,
          category: response.data.category,
          price: response.data.price,
          quantity: response.data.quantity,
          description: response.data.description,
          unit: response.data.unit,
        });
        
        setImages(response.data.images.map((img: any) => ({
          url: img.url,
          publicId: img.publicId
        })));
        
        if (response.data.images.length > 0) {
          setSelectedImageIndex(0);
        }
      } catch (error) {
        toast.error("Failed to load product data");
        navigate("/retailer/products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

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
        .slice(0, 3 - images.length)
        .map((file) => ({
          url: "",
          publicId: "",
          file,
          preview: URL.createObjectURL(file),
          isNew: true
        }));

      setImages((prev) => [...prev, ...newImages]);
      
      if (images.length === 0 && newImages.length > 0) {
        setSelectedImageIndex(0);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const removedImage = newImages.splice(index, 1)[0];
      
      // Revoke object URL if it's a new image
      if (removedImage.isNew && removedImage.preview) {
        URL.revokeObjectURL(removedImage.preview);
      }
      
      // Adjust selected image index
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
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("price", product.price.toString());
      formData.append("quantity", product.quantity.toString());
      formData.append("description", product.description);
      formData.append("unit", product.unit);

      // Append new images
      images.forEach((image) => {
        if (image.isNew && image.file) {
          formData.append("newImages", image.file);
        }
      });

      // Append public IDs of images to keep
      images.forEach((image) => {
        if (!image.isNew && image.publicId) {
          formData.append("existingImages", image.publicId);
        }
      });

      await updateProduct(productId!, formData);
      toast.success("Product updated successfully!");
      navigate("/retailer/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up object URLs for new images
      images.forEach((image) => {
        if (image.isNew && image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [images]);

  const tabs = ["Basic Info", "Description", "Images"];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <RetailerSidebar collapsed={false} setCollapsed={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RetailerSidebar collapsed={false} setCollapsed={() => {}} />
      
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
              <p className="text-gray-600">Update your product details</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/retailer/products")}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            >
              <FiX className="mr-1" /> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-100">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`px-6 py-4 font-medium text-sm flex items-center ${
                      activeTab === index
                        ? "text-green-600 border-b-2 border-green-500 bg-green-50"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {index === 0 && <FiShoppingBag className="mr-2" />}
                    {index === 1 && <FiAlignLeft className="mr-2" />}
                    {index === 2 && <FiImage className="mr-2" />}
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FiEdit2 className="mr-2 text-green-600" />
                          Product Information
                        </h3>
                        
                        <div className="mb-5">
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FiShoppingBag className="mr-2" />
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
                            <FiTag className="mr-2" />
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
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-lg border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <FiDollarSign className="mr-2 text-green-600" />
                          Pricing & Inventory
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-5 mb-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                              <FiDollarSign className="mr-2" />
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
                              <FiBox className="mr-2" />
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
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-100 h-48 flex items-center justify-center">
                          {images.length > 0 && selectedImageIndex !== null ? (
                            <img
                              src={images[selectedImageIndex].isNew ? 
                                images[selectedImageIndex].preview : 
                                images[selectedImageIndex].url}
                              alt="Product preview"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400">
                              <FiImage size={48} />
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {product.name || "Product Name"}
                          </h3>
                          <p className="text-gray-500 mb-2">
                            {product.category || "Category"}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-semibold text-green-600">
                              ${product.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {product.quantity} {product.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-lg border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FiAlignLeft className="mr-2 text-green-600" />
                      Product Description
                    </h3>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description
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
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-white p-5 rounded-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FiImage className="mr-2 text-green-600" />
                        Manage Product Images
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Current Images ({images.length}/3)
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                              {images.map((image, index) => (
                                <div 
                                  key={index} 
                                  className={`relative group rounded-lg overflow-hidden ${
                                    selectedImageIndex === index ? "ring-2 ring-green-500" : "border border-gray-200"
                                  }`}
                                  onClick={() => setSelectedImageIndex(index)}
                                >
                                  <div className="aspect-square">
                                    <img
                                      src={image.isNew ? image.preview : image.url}
                                      alt={`Preview ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImage(index);
                                    }}
                                    className="absolute top-2 right-2 bg-white/80 text-red-500 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                  {image.isNew && (
                                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                                      New
                                    </span>
                                  )}
                                </div>
                              ))}
                              
                              {images.length < 3 && (
                                <div
                                  className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer aspect-square hover:bg-gray-50 transition-colors"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <FiUpload className="text-gray-400 mb-1" size={20} />
                                  <span className="text-xs text-gray-500">Add Image</span>
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
                          </div>
                          <p className="text-xs text-gray-500">
                            You can upload up to 3 images. First image will be used as the main display image.
                            Recommended size: 800x800px, JPG or PNG format.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Image Preview
                          </h4>
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center aspect-square">
                            {selectedImageIndex !== null && images[selectedImageIndex] ? (
                              <div className="relative h-full w-full">
                                <img
                                  src={images[selectedImageIndex].isNew ? 
                                    images[selectedImageIndex].preview : 
                                    images[selectedImageIndex].url}
                                  alt="Selected preview"
                                  className="rounded-lg h-full w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="text-center p-8">
                                <FiImage className="text-gray-400 mb-2 mx-auto" size={48} />
                                <p className="text-gray-500 mb-3">No image selected</p>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center mx-auto"
                                >
                                  <FiUpload className="mr-2" />
                                  Upload Image
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h4 className="text-sm font-medium text-amber-800 mb-2 flex items-center">
                        <FiX className="mr-2" />
                        Important Note
                      </h4>
                      <p className="text-xs text-amber-700">
                        Removing existing images will permanently delete them from Cloudinary storage.
                        Make sure you have backups if you might need them later.
                      </p>
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
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
                    >
                      Previous
                    </button>
                  )}
                  {activeTab < 2 ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab + 1)}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center"
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
                          Updating...
                        </>
                      ) : (
                        <>
                          <FiCheck className="mr-2" />
                          Update Product
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

export default EditProduct;