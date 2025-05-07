import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Tag, 
  DollarSign, 
  Percent, 
  FileText, 
  AlertCircle, 
  Image as ImageIcon,
  Save,
  Plus,
  X,
  ArrowLeft,
  Home,
  ShoppingBag,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  Search
} from 'lucide-react';
import RetailerSidebar from '../../components/reatilerComponents/ReatilerSidebar';
import { To } from 'react-router-dom';

// Define TypeScript interfaces
interface ProductFormData {
  name: string;
  category: string;
  price: string;
  discountPrice: string;
  quantity: string;
  description: string;
  tags: string[];
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  quantity?: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

// API service for product operations
const productService = {
  // Get all categories
  // getCategories: async (): Promise<Category[]> => {
  //   try {
  //     const response = await fetch('/api/categories');
  //     if (!response.ok) throw new Error('Failed to fetch categories');
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error fetching categories:', error);
  //     return [];
  //   }
  // },

  // Add new product
  addProduct: async (productData: FormData): Promise<any> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: productData, // Using FormData to handle file uploads
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }
};

const AddProductPage: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    quantity: '',
    description: '',
    tags: []
  });
  
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on component mount
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const categoriesData = await productService.getCategories();
  //     setCategories(categoriesData.length > 0 ? categoriesData : [
  //       { id: "1", name: "Fruits" },
  //       { id: "2", name: "Vegetables" },
  //       { id: "3", name: "Dairy" },
  //       { id: "4", name: "Bakery" },
  //       { id: "5", name: "Meat" },
  //       { id: "6", name: "Beverages" }
  //     ]);
  //   };
    
  //   fetchCategories();
  // }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newImages = [...images];
      const newImageFiles = [...imageFiles];
      
      newImages[index] = URL.createObjectURL(file);
      newImageFiles[index] = file;
      
      setImages(newImages);
      setImageFiles(newImageFiles);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    
    newImages[index] = null;
    newImageFiles[index] = null;
    
    setImages(newImages);
    setImageFiles(newImageFiles);
  };

  // Add a tag
  const addTag = () => {
    if (currentTag.trim() !== '' && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()]
      });
      setCurrentTag('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.price) errors.price = "Price is required";
    if (parseFloat(formData.price) <= 0) errors.price = "Price must be greater than zero";
    if (!formData.quantity) errors.quantity = "Quantity is required";
    if (parseInt(formData.quantity) < 0) errors.quantity = "Quantity cannot be negative";
    if (!formData.description.trim()) errors.description = "Description is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    // Create FormData object for API submission
    const apiFormData = new FormData();
    
    // Append text data
    apiFormData.append('name', formData.name);
    apiFormData.append('category', formData.category);
    apiFormData.append('price', formData.price);
    apiFormData.append('quantity', formData.quantity);
    apiFormData.append('description', formData.description);
    
    if (formData.discountPrice) {
      apiFormData.append('discountPrice', formData.discountPrice);
    }
    
    // Append tags as JSON string
    apiFormData.append('tags', JSON.stringify(formData.tags));
    
    // Append images
    imageFiles.forEach((file, index) => {
      if (file) {
        apiFormData.append(`image${index + 1}`, file);
      }
    });
    
    setLoading(true);
    setError(null);
    
    try {
      // Send data to API
      const response = await productService.addProduct(apiFormData);
      console.log('Product added successfully:', response);
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          category: '',
          price: '',
          discountPrice: '',
          quantity: '',
          description: '',
          tags: []
        });
        setImages([null, null, null, null]);
        setImageFiles([null, null, null, null]);
        setSuccess(false);
      }, 3000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  // Image upload component
  const ImageUpload: React.FC<{ index: number, image: string | null }> = ({ index, image }) => (
    <div className="relative border border-dashed border-gray-300 bg-gray-50 rounded-xl overflow-hidden h-36 flex items-center justify-center group">
      {image ? (
        <>
          <img 
            src={image} 
            alt={`Product ${index + 1}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
              type="button"
              onClick={() => removeImage(index)} 
              className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </>
      ) : (
        <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-gray-100 transition-colors">
          <ImageIcon size={32} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">Add Image</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => handleImageChange(e, index)} 
          />
        </label>
      )}
      {index === 0 && image && (
        <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1">
          Main
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <RetailerSidebar retailerName={''} storeName={''} onNavigate={(path: To) => {
        console.log('Navigating to:', path);
      }} activePage={''} />
        
        <main className="container mx-auto px-4 py-8">
          {/* Status alerts */}
          {success && (
            <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md flex items-center">
              <span className="mr-2">✓</span>
              Product added successfully!
            </div>
          )}
          
          {error && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md flex items-center">
              <AlertCircle size={20} className="mr-2" />
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Left Column - Product Details */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                      <Package size={18} className="mr-2 text-blue-600" />
                      Product Details
                    </h2>
                    
                    {/* Product Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Package size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${formErrors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter product name"
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {formErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Category
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag size={18} className="text-gray-400" />
                        </div>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${formErrors.category ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white`}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      {formErrors.category && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {formErrors.category}
                        </p>
                      )}
                    </div>

                    {/* Price and Discount */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border ${formErrors.price ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        {formErrors.price && (
                          <p className="text-red-500 text-xs mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" /> {formErrors.price}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Discount Price (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Percent size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Quantity in Stock
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${formErrors.quantity ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter quantity"
                        min="0"
                      />
                      {formErrors.quantity && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {formErrors.quantity}
                        </p>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Tags (Optional)
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add tags"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Images and Description */}
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                      <ImageIcon size={18} className="mr-2 text-blue-600" />
                      Product Images & Description
                    </h2>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Images (Up to 4)
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {[0, 1, 2, 3].map((index) => (
                          <ImageUpload 
                            key={index} 
                            index={index} 
                            image={images[index]} 
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <AlertCircle size={14} className="mr-1 text-blue-500" />
                        First image will be used as the product thumbnail
                      </p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Product Description
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FileText size={18} className="text-gray-400" />
                        </div>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={6}
                          className={`w-full pl-10 pr-4 py-2 border ${formErrors.description ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Enter product description..."
                        />
                      </div>
                      {formErrors.description && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" /> {formErrors.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 mt-8 border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                      rounded-lg text-white font-medium shadow-md 
                      flex items-center justify-center min-w-32
                      ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'}
                      transition-all
                    `}
                  >
                    {loading ? (
                      <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save size={18} className="mr-2" />
                    )}
                    {loading ? 'Saving...' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>

    </div>
  );
};

export default AddProductPage;