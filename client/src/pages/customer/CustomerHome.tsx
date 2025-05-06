import { useEffect, useState } from 'react';
import { ShoppingBasket, Truck, Leaf, Heart, Star } from "lucide-react";
import { userData } from '../../api/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../slice/userSlice';
import { RootState } from '../../app/store';

function CustomerHome() {
  const [activeCategory, setActiveCategory] = useState('all');
  const selctor = useSelector((state : RootState) => state.auth.user);
  console.log('selctor', selctor);
  
  // Sample data - replace with actual Redux state data
  const vegetables = [
    { id: 1, name: 'Fresh Carrots', price: 2.99, category: 'root', image: 'https://5.imimg.com/data5/SELLER/Default/2022/10/JY/SK/TN/161422039/fresh-carrots-fresh-red-carrot-for-sale-1513637912-3529401.jpeg', rating: 4.8 },
    { id: 2, name: 'Organic Spinach', price: 3.49, category: 'leafy', image: 'data:image/jpeg;base64,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', rating: 4.9 },
    { id: 3, name: 'Red Bell Peppers', price: 4.29, category: 'fruit', image: 'https://fruitboxco.com/cdn/shop/products/Red_bell_pepper.jpg?v=1579689969', rating: 4.7 },
    { id: 4, name: 'Sweet Potatoes', price: 1.99, category: 'root', image: 'https://c.ndtvimg.com/gws/ms/health-benefits-of-sweet-potatoes/assets/5.png', rating: 4.6 },
    { id: 5, name: 'Fresh Broccoli', price: 2.79, category: 'flower', image: 'https://www.bigbasket.com/media/uploads/p/l/10000661_6-fresho-broccoli.jpg', rating: 4.9 },
    { id: 6, name: 'Kale Bunch', price: 3.29, category: 'leafy', image: 'https://cdn11.bigcommerce.com/s-rl94rv7pw2/images/stencil/1280x1280/products/1039/1045/thumbnail__41003.1743361516.jpg?c=1', rating: 4.5 },
    { id: 7, name: 'Tomatoes', price: 2.49, category: 'fruit', image: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg', rating: 4.8 },
    { id: 8, name: 'Cucumber', price: 1.79, category: 'fruit', image: 'https://seed2plant.in/cdn/shop/products/saladcucumberseeds.jpg?v=1603435556', rating: 4.7 },
  ];
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'leafy', name: 'Leafy Greens' },
    { id: 'root', name: 'Root Vegetables' },
    { id: 'fruit', name: 'Fruit Vegetables' },
    { id: 'flower', name: 'Flower Vegetables' }
  ];
  
  const filteredVegetables = activeCategory === 'all' 
    ? vegetables 
    : vegetables.filter(veg => veg.category === activeCategory);
    const dispatch = useDispatch();

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const paramsemail = params.get('email');
      const email = localStorage.getItem('email');

      if (paramsemail) {
        localStorage.setItem('email', paramsemail);
        const url = new URL(window.location.href);
        url.searchParams.delete('email'); 
        window.history.replaceState({}, document.title, url.pathname); 
        window.location.reload();
      }

      if (email) {
        userData({ email })
          .then(user => {
            dispatch(setUser({
              email: user.email,
              role: user.role,
              name: user.name,
            }));
          })
          .catch(error => {
            console.error('Error fetching user data:', error);
          });
      }
    }, []);
    
 
  
  return (
    <div className="bg-gray-50 min-h-screen overflow-auto no-scrollbar">
      {/* Hero Section with Background Image */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://media.istockphoto.com/id/1352758440/photo/paper-shopping-food-bag-with-grocery-and-vegetables.jpg?s=612x612&w=0&k=20&c=iEYDgT97dpF7DuG4-QUJU3l0-5MKQb01mKbQgEG1pcc=')" }}
        ></div>
        
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
              Farm Fresh <span className="text-green-400">Vegetables</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Locally sourced organic produce delivered straight to your door. 
              Experience the freshness from our farm to your table.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
                Browse Products
              </button>
              <button className="px-8 py-4 bg-white text-green-600 font-medium rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                How It Works
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#f9fafb" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,170.7C960,160,1056,96,1152,90.7C1248,85,1344,139,1392,165.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Our Vegetables?</h2>
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Leaf size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">100% Organic</h3>
            <p className="text-gray-600 text-center">
              We grow all our vegetables using organic farming practices. 
              No pesticides, no chemicals - just pure, natural goodness.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Truck size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Express Delivery</h3>
            <p className="text-gray-600 text-center">
              Same-day delivery options available with our temperature-controlled vehicles 
              ensuring your vegetables arrive fresh and crisp.
            </p>
          </div>
          
          
          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:-translate-y-2 hover:shadow-2xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Heart size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4">Freshness Guarantee</h3>
            <p className="text-gray-600 text-center">
              We stand behind our quality. If you're not completely satisfied with your 
              purchase, we'll refund or replace it, no questions asked.
            </p>
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <div className="bg-green-50 py-24">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Fresh Picks</h2>
            <button className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-105">
              View All
            </button>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {vegetables.slice(0, 4).map(veg => (
              <div key={veg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all">
                <div className="relative h-56 overflow-hidden">
                  <img src={veg.image} alt={veg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                    <Heart size={20} className="text-green-500" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-gray-600 text-sm ml-1">{veg.rating}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{veg.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${veg.price.toFixed(2)}</span>
                    <button className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-110">
                      <ShoppingBasket size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Shop All Products Section */}
      <div className="container mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Shop All Vegetables</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-12 gap-3">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeCategory === category.id 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-4 gap-8">
          {filteredVegetables.map(veg => (
            <div key={veg.id} className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={veg.image} alt={veg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md">
                  <Heart size={20} className="text-green-500" />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center mb-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="text-gray-600 text-sm ml-1">{veg.rating}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{veg.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">${veg.price.toFixed(2)}</span>
                  <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all transform hover:scale-110">
                    <ShoppingBasket size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* About Us Section with Parallax Effect */}
      <div className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://c8.alamy.com/comp/M0J9XD/frame-full-of-fruits-and-vegetables-on-a-wooden-table-seen-from-above-M0J9XD.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">From Our Farm to Your Table</h2>
            <p className="text-xl leading-relaxed mb-8">
              Our family has been farming for generations, perfecting the art of growing 
              the most nutritious and delicious vegetables. We handpick each vegetable 
              at its peak ripeness to ensure you get the best quality produce.
            </p>
            <button className="px-8 py-4 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
              Learn Our Story
            </button>
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-green-500 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Ready to Eat Healthy?</h2>
              <p className="text-green-100 text-xl">Get your first delivery with 15% off</p>
            </div>
            <button className="px-8 py-4 bg-white text-green-600 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerHome;