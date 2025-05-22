// src/pages/ProductDetail.tsx
import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiStar,
  FiShoppingCart,
  FiChevronLeft,
  FiShare2,
  FiTruck,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import { Product } from "../../interfaces/product/IProduct";
import { getProductById } from "../../api/reatilerApi";
import LoadingSpinner from "../../components/Customer/LoadinSpinner";

function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(productId!);
        console.log("data", data, "data");

        setProduct(data.data);
        setIsFavorite(data.isFavorite || false);
      } catch (err) {
        setError("Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error} />;
  if (!product) return <NotFound />;

  // Calculate original price if there's a discount
  const originalPrice = product.discount
    ? product.price / (1 - product.discount / 100)
    : null;

  // Format retailer info
  const retailerName = product.retailerId?.shopName || "Unknown Retailer";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <FiChevronLeft className="mr-1" />
            Back to shop
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="lg:w-1/2">
            {/* Main Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-4">
              <img
                src={
                  product.images?.[selectedImage]?.url ||
                  "https://via.placeholder.com/800"
                }
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-emerald-500"
                      : "border-gray-200"
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
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {product.name}
                  </h1>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>Sold by: </span>
                    <span className="text-emerald-600 ml-1 font-medium">
                      {retailerName}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full ${
                      isFavorite
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-600"
                    } hover:shadow-md transition-all`}
                  >
                    <FiHeart className={isFavorite ? "fill-current" : ""} />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:shadow-md transition-all">
                    <FiShare2 />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`${
                        i < Math.floor(Number(product.rating))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      } w-5 h-5`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating ? `${product.rating}/5` : "No ratings yet"} •{" "}
                  {product.reviews?.length || 0} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center">
                  {/* // Fix for the price display section */}
                  <span className="text-3xl font-bold text-gray-900 mr-3">
                    $
                    {typeof product.price === "number"
                      ? product.price.toFixed(2)
                      : "0.00"}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      $
                      {typeof originalPrice === "number"
                        ? originalPrice.toFixed(2)
                        : "0.00"}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="ml-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-bold">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                {product.quantity > 0 ? (
                  <div className="text-emerald-600 text-sm mt-1 flex items-center">
                    <FiCheck className="mr-1" />
                    In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="text-red-500 text-sm mt-1">Out of Stock</div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300 bg-white text-gray-900">
                    {quantity}
                  </div>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <FiShoppingCart />
                  Add to Cart
                </button>
                <button className="flex-1 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 px-6 rounded-lg font-medium transition-colors">
                  Buy Now
                </button>
              </div>

              {/* Delivery Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                    <FiTruck size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Free Delivery</h3>
                    <p className="text-gray-600 text-sm">
                      Estimated delivery: 2-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Quality Guarantee
                    </h3>
                    <p className="text-gray-600 text-sm">
                      30-day return policy
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Product Details
              </h2>
              <div className="prose prose-sm text-gray-600">
                {product?.description || (
                  <p>
                    This premium quality {product?.name?.toLowerCase()} is
                    carefully selected for freshness and taste. Grown with
                    sustainable farming practices and delivered at peak
                    ripeness.
                  </p>
                )}
              </div>

              {/* Specifications */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="text-gray-900">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Unit</p>
                    <p className="text-gray-900">{product.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="text-gray-900">{product.weight || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Origin</p>
                    <p className="text-gray-900">{product.origin || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map(
                  (
                    review: {
                      userName: string;
                      rating: number;
                      createdAt: string | number | Date;
                      comment:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<
                                unknown,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined;
                    },
                    index: Key | null | undefined
                  ) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-3">
                          {review.userName?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.userName || "Anonymous"}
                          </h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                } w-4 h-4`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              {review.createdAt
                                ? new Date(
                                    review.createdAt
                                  ).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}

            {/* Review Form */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Write a Review</h3>
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-gray-300 hover:text-yellow-400 focus:outline-none"
                      >
                        <FiStar className="w-6 h-6" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="review" className="block text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                    placeholder="Share your experience with this product..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You May Also Like
          </h2>
          {/* You would fetch and display related products here */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Sample related product cards would go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

// Error Component
const Error = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center min-h-screen p-4">
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 max-w-md rounded-r-lg shadow-md">
      <div className="flex items-center mb-3">
        <svg
          className="h-6 w-6 text-red-500 mr-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
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

// Not Found Component
const NotFound = () => (
  <div className="flex justify-center items-center min-h-screen p-4">
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center border border-gray-200">
      <div className="bg-gray-100 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        Product Not Found
      </h2>
      <p className="text-gray-600 mb-6">
        The product you're looking for doesn't exist or may have been removed.
      </p>
      <button
        onClick={() => window.history.back()}
        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
      >
        Back to Shop
      </button>
    </div>
  </div>
);

export default ProductDetail;
