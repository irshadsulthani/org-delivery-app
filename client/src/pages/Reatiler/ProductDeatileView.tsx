import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiBox, 
  FiPackage,  
  FiCalendar, 
  FiX,
  FiGrid,
  FiMinus,
  FiPlus,
  FiShare2,
  FiHeart,
  FiStar,
  FiFileText,
  FiTag
} from "react-icons/fi";
import RetailerSidebar from "../../components/Retailer/ReatilerSidebar";
import { getProductById, deleteProduct } from "../../api/reatilerApi";

// Product type definition
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  images: { url: string; publicId: string }[];
}

function RetailerProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  const fetchProductDetails = async (productId: string) => {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      console.log(data);
      
      setProduct(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (product) {
      navigate(`/retailer/products/edit/${product._id}`);
    }
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProduct(product._id);
      setIsDeleteModalOpen(false);
      navigate("/retailer/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const getStockStatusStyle = () => {
    if (!product) return {};
    
    if (product.quantity > 10) {
      return { bgColor: "bg-emerald-100", textColor: "text-emerald-700" };
    } else if (product.quantity > 0) {
      return { bgColor: "bg-amber-100", textColor: "text-amber-700" };
    } else {
      return { bgColor: "bg-red-100", textColor: "text-red-700" };
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleImageZoom = () => {
    setZoomedImage(!zoomedImage);
  };

  const formattedDate = (dateString?: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RetailerSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <div className="flex-1 transition-all duration-300">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/retailer/products")}
                className="mr-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors duration-200"
                aria-label="Back to products"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Product Details</h1>
                <p className="text-emerald-100 text-sm">View and manage your product information</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm flex items-start">
              <FiX className="mr-3 mt-1 flex-shrink-0" />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto p-1 text-red-500 hover:text-red-700"
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="mt-6 text-gray-600 font-medium">Loading product details...</p>
            </div>
          ) : product ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Product Image Gallery - Left Side */}
                <div className="lg:col-span-1 lg:border-r border-gray-100">
                  <div className="sticky top-6 p-6">
                    <div className="relative">
                      <div 
                        className={`aspect-square mb-6 bg-gray-50 rounded-xl overflow-hidden ${zoomedImage ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                        onClick={handleImageZoom}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[activeImage].url}
                            alt={product.name}
                            className={`w-full h-full transition-all duration-500 ${
                              zoomedImage ? 'object-cover scale-125' : 'object-contain scale-100'
                            }`}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 bg-gray-100">
                            <FiBox size={72} />
                          </div>
                        )}
                        
                        {/* Image controls overlay */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageZoom();
                            }}
                            className="p-2 bg-white/90 rounded-full shadow-md text-gray-700 hover:text-emerald-600 transition-colors"
                          >
                            <FiGrid size={16} />
                          </button>
                          
                          <button 
                            className="p-2 bg-white/90 rounded-full shadow-md text-gray-700 hover:text-emerald-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiShare2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-5 gap-2">
                          {product.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                                activeImage === index 
                                  ? 'ring-2 ring-emerald-500 ring-offset-2' 
                                  : 'border border-gray-200 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img
                                src={image.url}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Product Details - Right Side */}
                <div className="lg:col-span-2 p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                      {product.category}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <FiHeart size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-emerald-600">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 ml-2">per {product.unit}</span>
                    </div>
                    
                    <div className={`px-4 py-2 rounded-full ${getStockStatusStyle().bgColor} ${getStockStatusStyle().textColor} font-medium flex items-center shadow-sm`}>
                      <FiPackage className="mr-2" size={16} />
                      {product.quantity > 0 ? `${product.quantity} ${product.unit} in stock` : 'Out of stock'}
                    </div>
                  </div>
                  
                  {/* Product Rating (placeholder) */}
                  <div className="flex items-center mb-6">
                    <div className="flex text-amber-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} size={18} className="fill-current" />
                      ))}
                    </div>
                    <span className="text-gray-600">(24 reviews)</span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <FiFileText className="mr-2 text-emerald-600" size={18} />
                      Product Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                  {/* Additional Product Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                      <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                        <FiTag size={18} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Product ID</h4>
                        <p className="text-gray-600 text-sm font-mono mt-1">{product._id}</p>
                      </div>
                    </div>
                    
                    {product.createdAt && (
                      <div className="bg-gray-50 rounded-xl p-4 flex items-start">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 mr-4">
                          <FiCalendar size={18} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Added on</h4>
                          <p className="text-gray-600 text-sm mt-1">{formattedDate(product.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    <button
                      onClick={handleEdit}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FiEdit2 className="mr-2" size={18} />
                      Edit Product
                    </button>
                    
                    <button
                      onClick={confirmDelete}
                      className="flex-1 border-2 border-red-500 text-red-500 hover:bg-red-50 py-3.5 px-6 rounded-xl font-medium flex items-center justify-center transition-colors duration-200"
                    >
                      <FiTrash2 className="mr-2" size={18} />
                      Delete Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto">
              <div className="relative inline-block mb-6">
                <div className="bg-gray-100 p-8 rounded-full">
                  <FiBox className="text-gray-400" size={64} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-red-100 p-2 rounded-full border-4 border-white text-red-500">
                  <FiX size={24} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Product Not Found</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                The product you're looking for doesn't exist or may have been removed from your inventory.
              </p>
              <button
                onClick={() => navigate("/retailer/products")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-medium inline-flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <FiArrowLeft className="mr-2" size={18} />
                Back to Product List
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
              <FiTrash2 className="text-red-600" size={28} />
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-gray-800 text-center">Confirm Deletion</h3>
            <p className="text-gray-600 mb-8 text-center">
              Are you sure you want to delete <span className="font-semibold">{product?.name}</span>? This action cannot be undone and all associated data will be permanently removed.
            </p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium text-gray-700 transition-colors duration-200 min-w-[120px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors duration-200 min-w-[120px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Image Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 animate-fadeIn cursor-zoom-out"
          onClick={() => setZoomedImage(false)}
        >
          {product?.images && product.images.length > 0 && (
            <img
              src={product.images[activeImage].url}
              alt={product.name}
              className="max-w-full max-h-full object-contain animate-scaleIn"
            />
          )}
          <button 
            className="absolute top-4 right-4 bg-white/10 text-white p-2 rounded-full hover:bg-white/20"
            onClick={() => setZoomedImage(false)}
          >
            <FiX size={24} />
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
        
        /* Fix for number input arrows */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        /* Make image fill for aspect ratio */
        .aspect-square {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
        }
        
        .aspect-square > img, 
        .aspect-square > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}

export default RetailerProductDetailPage;