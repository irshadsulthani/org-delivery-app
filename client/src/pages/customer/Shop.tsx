// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiHeart, FiStar, FiShoppingCart, FiChevronRight, FiChevronLeft, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../interfaces/product/IProduct';
import { getProducts } from '../../api/userApi';
import LoadingSpinner from '../../components/Customer/LoadinSpinner';

function Shop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data.data || data);
        setFilteredProducts(data.data || data);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategories.length > 0) count++;
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) count++;
    if (sortOption !== 'default') count++;
    setActiveFilters(count);
  }, [searchTerm, selectedCategories, priceRange, sortOption]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category)
      );
    }

    // Apply price filter
    result = result.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'discount':
        result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case 'newest':
        result.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - 
          new Date(a.createdAt || '').getTime()
        );
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(result);
    setTotalPages(Math.ceil(result.length / productsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, sortOption, priceRange, selectedCategories, productsPerPage]);

  // Calculate max price for range slider
  const maxPrice = Math.max(...products.map(product => product.price), 1000);

  // Extract unique categories for filter
  const categories = [...new Set(products.map(product => product.category))];

  // Toggle favorite status
  const toggleFavorite = (productId: string) => {
    setProducts(prev =>
      prev.map(product =>
        product._id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  };

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Navigate to product details
  const viewProductDetails = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 font-serif">Discover Fresh Delights</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Handpicked quality, delivered to your doorstep with care
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full py-4 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg backdrop-blur-sm bg-white/90"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-6 top-4 text-gray-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Sorting Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white py-2.5 px-4 rounded-lg shadow-sm border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="text-emerald-600" />
              Filters
              {activeFilters > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilters}
                </span>
              )}
            </button>
            
            {/* Active Filters Display */}
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  Search: "{searchTerm}"
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="ml-1.5 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
              {selectedCategories.map(category => (
                <span key={category} className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  {category}
                  <button 
                    onClick={() => setSelectedCategories(prev => prev.filter(c => c !== category))}
                    className="ml-1.5 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
              {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <span className="inline-flex items-center bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  ${priceRange[0]} - ${priceRange[1]}
                  <button 
                    onClick={() => setPriceRange([0, maxPrice])}
                    className="ml-1.5 text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={14} />
                  </button>
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 items-center w-full md:w-auto">
            <label className="text-gray-600 whitespace-nowrap text-sm">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-gray-700 text-sm w-full md:w-auto"
            >
              <option value="default">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="discount">Best Discount</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Mobile Overlay */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowFilters(false)}></div>
          )}
          
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'fixed inset-y-0 left-0 z-50 w-80 p-6 overflow-y-auto' : 'hidden'} md:block w-full md:w-72 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-4 border border-gray-200`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-gray-800">
                Filters
              </h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-8">
              <h4 className="font-medium mb-4 text-gray-700">Price Range</h4>
              <div className="px-2 mb-4">
                <div className="relative h-1 bg-gray-200 rounded-full">
                  <div 
                    className="absolute h-1 bg-emerald-500 rounded-full"
                    style={{ 
                      left: `${(priceRange[0] / maxPrice) * 100}%`, 
                      right: `${100 - (priceRange[1] / maxPrice) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>

            {/* Categories Filter */}
            <div className="mb-8">
              <h4 className="font-medium mb-4 text-gray-700">Categories</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(category => (
                  <label key={category} className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => {
                          setSelectedCategories(prev =>
                            prev.includes(category)
                              ? prev.filter(c => c !== category)
                              : [...prev, category]
                          );
                        }}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
                        selectedCategories.includes(category) 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-300 group-hover:border-emerald-400'
                      }`}>
                        {selectedCategories.includes(category) && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700 group-hover:text-emerald-600 transition-colors">
                        {category}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setPriceRange([0, maxPrice]);
                  setSortOption('default');
                }}
                className="flex-1 py-2.5 text-emerald-600 font-medium hover:text-emerald-800 bg-emerald-50 rounded-lg transition-colors duration-200"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 text-white font-medium bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200 md:hidden"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Product Count */}
            <p className="text-gray-500 mb-6">
              Showing <span className="font-medium text-gray-800">{filteredProducts.length}</span> products
            </p>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onFavoriteToggle={toggleFavorite}
                      onClick={() => viewProductDetails(product._id)}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-1">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FiChevronLeft />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              currentPage === pageNum
                                ? 'bg-emerald-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-1">...</span>
                          <button
                            onClick={() => paginate(totalPages)}
                            className="w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-center"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                          currentPage === totalPages 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <FiChevronRight />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-5 rounded-full mb-6 w-20 h-20 flex items-center justify-center">
                    <FiSearch className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2 text-gray-800">No products found</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategories([]);
                      setPriceRange([0, maxPrice]);
                      setSortOption('default');
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
const ProductCard = ({ 
  product, 
  onFavoriteToggle,
  onClick
}: { 
  product: Product, 
  onFavoriteToggle: (id: string) => void,
  onClick: () => void
}) => {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/300';
  
  const originalPrice = product.discount ? product.price / (1 - product.discount / 100) : null;
  const retailerName = product.retailerId?.shopName || 'Unknown Retailer';
  
  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 group cursor-pointer"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick Action Buttons */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavoriteToggle(product._id);
              }}
              className={`p-3 rounded-full backdrop-blur-sm ${product.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700'} hover:shadow-lg transition-all duration-200`}
              aria-label="Add to favorites"
            >
              <FiHeart className={product.isFavorite ? 'fill-current' : ''} />
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-3 rounded-full backdrop-blur-sm bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg transition-all duration-200"
              aria-label="Add to cart"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {product.discount}% OFF
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
            {product.unit}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">
          {product.description || `Premium quality ${product.name.toLowerCase()}`}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => {
              const ratingValue = Number(product.rating) || 0;
              return (
                <FiStar 
                  key={i} 
                  className={`${i < Math.floor(ratingValue) ? 'text-yellow-400 fill-current' : 'text-gray-300'} w-4 h-4`} 
                />
              );
            })}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating ? `${product.rating}/5` : 'No ratings'})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        {/* Retailer Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
          <span className="text-xs text-gray-500">From:</span>
          <span className="text-xs font-medium ml-1 text-emerald-700">{retailerName}</span>
        </div>
      </div>
    </div>
  );
};



// Error Component
const Error = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center min-h-screen p-4">
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 max-w-md rounded-r-lg shadow-md">
      <div className="flex items-center mb-3">
        <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-bold text-lg">Error</p>
      </div>
      <p>{message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default Shop;