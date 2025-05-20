import { useState, useEffect, SetStateAction, JSXElementConstructor, ReactElement, ReactNode, ReactPortal } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiBox, 
  FiX, 
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiAlertTriangle,
  FiCheck,
  FiInfo
} from "react-icons/fi";
import RetailerSidebar from "../../components/Retailer/ReatilerSidebar";
import { getRetailerProducts, deleteProduct } from "../../api/reatilerApi";
import { toast, ToastContainer, ToastContentProps } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Product type definition
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  description: string;
  images: { url: string; publicId: string }[];
}

function RetailerProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"name" | "price" | "quantity">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Toast configuration
  const notifySuccess = (message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const notifyError = (message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const notifyInfo = (message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getRetailerProducts();
      console.log('data', data);
      
      if (data.error) {
        setError(data.error);
        notifyError(data.error);
        return;
      }
      
      setProducts(data);
      
      // Extract unique categories for filter
      const uniqueCategories = Array.from(new Set(data.map((product: { category: any; }) => product.category))) as string[];
      setCategories(uniqueCategories);
      
      if (data.length === 0) {
        notifyInfo("No products found. Add some products to get started!");
      } else {
        notifySuccess(`${data.length} products loaded successfully!`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId: string) => {
    navigate(`/retailer/products/edit/${productId}`);
  };

  const viewProductDetails = (productId: string) => {
    navigate(`/retailer/products/view/${productId}`);
  };

  const confirmDelete = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await deleteProduct(productToDelete);

      if (response && response.error) {
        notifyError(response.error);
        return;
      }

      setProducts(products.filter(product => product._id !== productToDelete));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      notifySuccess("Product deleted successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product";
      notifyError(errorMessage);
    }
  };

  const handleSort = (sortType: "name" | "price" | "quantity") => {
    setSort(sortType);
    
    const sortedProducts = [...products];
    
    switch(sortType) {
      case "name":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "quantity":
        sortedProducts.sort((a, b) => b.quantity - a.quantity);
        break;
    }
    
    setProducts(sortedProducts);
    notifyInfo(`Products sorted by ${sortType}`);
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: SetStateAction<number>) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    notifyInfo("Filters cleared");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <RetailerSidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      <div className="flex-1 transition-all duration-300">
        {/* Header with beautiful gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-md">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Product Inventory</h1>
                <p className="text-emerald-100 mt-1">Manage your products effectively</p>
              </div>
              <button
                onClick={() => navigate("/retailer/add-product")}
                className="bg-white text-emerald-600 hover:bg-emerald-50 px-5 py-3 rounded-lg flex items-center shadow-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                <FiPlus className="mr-2" size={20} />
                Add New Product
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-sm flex items-start">
              <FiAlertTriangle className="mr-3 mt-1 flex-shrink-0" />
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto p-1 text-red-500 hover:text-red-700"
              >
                <FiX size={16} />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Enhanced Search and filter panel */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative flex-1 max-w-xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex items-center bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                    <FiFilter className="text-gray-500 mr-2" size={18} />
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 pr-8"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <FiGrid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                      <FiList size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Sort options */}
              <div className="flex gap-2 mt-4">
                <div className="text-sm text-gray-500 flex items-center mr-2">Sort by:</div>
                <button 
                  onClick={() => handleSort("name")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${sort === 'name' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Name
                </button>
                <button 
                  onClick={() => handleSort("price")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${sort === 'price' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Price
                </button>
                <button 
                  onClick={() => handleSort("quantity")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full ${sort === 'quantity' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Stock
                </button>
              </div>
            </div>

            {/* Product listing */}
            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin"></div>
                  <p className="mt-6 text-gray-600 font-medium">Loading your products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative">
                    <div className="bg-gray-50 p-6 rounded-full mb-4">
                      <FiBox className="text-gray-400" size={48} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-gray-100 p-2 rounded-full border-4 border-white">
                      <FiX className="text-gray-500" size={20} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">No products found</h3>
                  <p className="text-gray-500 max-w-md">
                    {searchTerm || filterCategory 
                      ? "Try adjusting your search terms or category filter to find what you're looking for." 
                      : "You haven't added any products yet. Click 'Add New Product' to get started."}
                  </p>
                  {(searchTerm || filterCategory) && (
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium transition-colors duration-200"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((product) => (
                    <div 
                      key={product._id} 
                      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div 
                        className="relative h-60 bg-gray-50 overflow-hidden cursor-pointer"
                        onClick={() => viewProductDetails(product._id)}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300 bg-gray-100">
                            <FiBox size={64} />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          {product.category}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-4 w-full">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewProductDetails(product._id);
                              }}
                              className="w-full py-2 bg-white/90 text-emerald-700 rounded-lg flex items-center justify-center font-medium"
                            >
                              <FiEye className="mr-2" /> View Details
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 
                          className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors"
                          onClick={() => viewProductDetails(product._id)}
                        >
                          {product.name}
                        </h3>
                        
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-semibold text-emerald-600">${product.price.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/ {product.unit}</span></span>
                          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                            product.quantity > 10 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : product.quantity > 0 
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {product.quantity > 0 ? `${product.quantity} ${product.unit} in stock` : 'Out of stock'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-5 line-clamp-2 h-12">
                          {product.description}
                        </p>
                        
                        <div className="flex justify-between pt-3 border-t border-gray-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product._id);
                            }}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200 flex items-center"
                          >
                            <FiEdit2 className="mr-1.5" size={14} /> Edit
                          </button>
                          
                          <button
                            onClick={(e) => confirmDelete(product._id, e)}
                            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors duration-200 flex items-center"
                          >
                            <FiTrash2 className="mr-1.5" size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {currentItems.map((product) => (
                    <div 
                      key={product._id} 
                      className="flex flex-col sm:flex-row py-4 group hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    >
                      <div 
                        className="relative w-full sm:w-40 h-32 sm:h-24 mb-4 sm:mb-0 mr-0 sm:mr-4 cursor-pointer"
                        onClick={() => viewProductDetails(product._id)}
                      >
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-gray-300 bg-gray-100 rounded-xl">
                            <FiBox size={32} />
                          </div>
                        )}
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                          {product.category}
                        </div>
                      </div>
                      
                      <div className="flex-grow pr-4">
                        <h3 
                          className="font-bold text-lg text-gray-800 mb-1 cursor-pointer hover:text-emerald-600 transition-colors"
                          onClick={() => viewProductDetails(product._id)}
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-600 line-clamp-1 mb-2 text-sm">
                          {product.description}
                        </p>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold text-emerald-600 mr-4">${product.price.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/ {product.unit}</span></span>
                          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                            product.quantity > 10 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : product.quantity > 0 
                                ? 'bg-amber-100 text-amber-700' 
                                : 'bg-red-100 text-red-700'
                          }`}>
                            {product.quantity > 0 ? `${product.quantity} ${product.unit} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col gap-2 mt-4 sm:mt-0 justify-end sm:justify-center items-center">
                        <button
                          onClick={() => viewProductDetails(product._id)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium transition-colors duration-200 flex items-center"
                        >
                          <FiEye className="mr-1.5" size={14} /> View
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product._id);
                            }}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                          >
                            <FiEdit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => confirmDelete(product._id, e)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Pagination Component */}
              {filteredProducts.length > itemsPerPage && (
                <div className="flex items-center justify-center mt-10">
                  <nav className="flex items-center space-x-1">
                    <button 
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      className={`p-2 rounded-lg border border-gray-200 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      disabled={currentPage === 1}
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    
                    {pageNumbers.map(number => (
                      <button 
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 rounded-lg ${currentPage === number 
                          ? 'bg-emerald-500 text-white' 
                          : 'border border-gray-200 hover:bg-gray-50 text-gray-700'} 
                          flex items-center justify-center font-medium transition-colors duration-200`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      className={`p-2 rounded-lg border border-gray-200 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      disabled={currentPage === totalPages}
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
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
              Are you sure you want to delete this product? This action cannot be undone and all associated data will be permanently removed.
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

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

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
      `}</style>
    </div>
  );
}

export default RetailerProductsPage;