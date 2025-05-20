// src/pages/Shop.tsx
import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiHeart, FiStar, FiShoppingCart, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { Product } from '../../interfaces/product/IProduct';
import { getProducts } from '../../api/userApi';

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
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

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://pattern.monster/groceries/'), url('https://pattern.monster/diagonal-stripes/')", backgroundBlendMode: "overlay" }}></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">Fresh Groceries Delivered</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">Shop the best quality fruits, vegetables and more - delivered right to your doorstep</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full py-4 px-6 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute right-6 top-4 text-gray-500 text-xl" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Mobile Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white py-3 px-5 rounded-lg shadow-sm border border-gray-100 font-medium text-gray-700 w-full justify-center"
            >
              <FiFilter className="text-emerald-600" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-4 border border-gray-100`}>
            <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center">
              <FiFilter className="mr-2 text-emerald-600" />
              Filters
            </h3>
            
            {/* Price Range Filter */}
            <div className="mb-8">
              <h4 className="font-medium mb-4 text-gray-700">Price Range</h4>
              <div className="flex justify-between mb-3 text-sm text-gray-600">
                <span>${priceRange[0].toFixed(2)}</span>
                <span>${priceRange[1].toFixed(2)}</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center">
                  <div className="h-1 w-full bg-gray-200 rounded-full"></div>
                  <div className="absolute inset-y-0 bg-emerald-500 h-1 rounded-full" style={{ 
                    left: `${(priceRange[0] / maxPrice) * 100}%`, 
                    right: `${100 - (priceRange[1] / maxPrice) * 100}%` 
                  }}></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full appearance-none bg-transparent pointer-events-auto"
                  style={{ zIndex: 10 }}
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full appearance-none bg-transparent pointer-events-auto absolute top-0"
                  style={{ zIndex: 10 }}
                />
              </div>
            </div>

            {/* Categories Filter */}
            <div className="mb-8">
              <h4 className="font-medium mb-4 text-gray-700">Categories</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map(category => (
                  <label key={category} className="flex items-center cursor-pointer group">
                    <div className="relative">
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
                        className="opacity-0 absolute h-5 w-5"
                      />
                      <div className={`border-2 rounded-md border-gray-300 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-3 ${
                        selectedCategories.includes(category) 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'group-hover:border-emerald-500'
                      }`}>
                        <svg 
                          className={`fill-current w-3 h-3 text-white pointer-events-none ${
                            selectedCategories.includes(category) ? 'opacity-100' : 'opacity-0'
                          }`} 
                          viewBox="0 0 20 20"
                        >
                          <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700 group-hover:text-emerald-600 transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategories([]);
                setPriceRange([0, maxPrice]);
                setSortOption('default');
              }}
              className="w-full py-3 text-emerald-600 font-medium hover:text-emerald-800 bg-emerald-50 rounded-lg transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sorting Options */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-600 mb-4 sm:mb-0">
                Showing <span className="font-medium text-gray-800">{filteredProducts.length}</span> products
              </p>
              <div className="flex gap-4 items-center">
                <label className="text-gray-600 whitespace-nowrap">Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-gray-700"
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

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-500'
                      }`}
                    >
                      <FiChevronLeft />
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
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
                            className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                              currentPage === pageNum
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 self-end">...</span>
                          <button
                            onClick={() => paginate(totalPages)}
                            className="w-10 h-10 rounded-lg border bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center justify-center"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-500'
                      }`}
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 p-5 rounded-full mb-6">
                    <FiSearch className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-medium mb-2 text-gray-800">No products found</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    We couldn't find any products matching your current search or filter criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategories([]);
                      setPriceRange([0, maxPrice]);
                      setSortOption('default');
                    }}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
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
const ProductCard = ({ product, onFavoriteToggle }: { product: Product, onFavoriteToggle: (id: string) => void }) => {
  // Get the main image URL
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/300';
  
  // Calculate original price if there's a discount
  const originalPrice = product.discount ? product.price / (1 - product.discount / 100) : null;
  
  // Format retailer info
  const retailerName = product.retailerId?.shopName || 'Unknown Retailer';
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
      {/* Product Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick Action Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-3">
            <button
              onClick={() => onFavoriteToggle(product._id)}
              className={`p-3 rounded-full ${product.isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'} hover:shadow-lg transition-all duration-200`}
              aria-label="Add to favorites"
            >
              <FiHeart className={product.isFavorite ? 'fill-current' : ''} />
            </button>
            <button 
              className="p-3 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg transition-all duration-200"
              aria-label="Add to cart"
            >
              <FiShoppingCart />
            </button>
          </div>
        </div>
        
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {product.discount}% OFF
          </div>
        )}
        
        {/* Status Badge (if available) */}
        {product.status && (
          <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {product.status}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors duration-200">
            {product.name}
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
            {product.unit}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 h-10">
          {product.description || `Premium quality ${product.name.toLowerCase()} fresh from local farms.`}
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
          <button className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors duration-200 shadow-sm">
            <FiShoppingCart />
          </button>
        </div>
        
        {/* Retailer Info */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center">
          <span className="text-xs text-gray-500">Sold by:</span>
          <span className="text-xs font-medium ml-1 text-emerald-700">{retailerName}</span>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-emerald-500 animate-spin"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-r-4 border-l-4 border-transparent border-r-emerald-300 border-l-emerald-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
    </div>
  </div>
);

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