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
    { id: 1, name: 'Fresh Carrots', price: 2.99, category: 'root', image: '/api/placeholder/300/200', rating: 4.8 },
    { id: 2, name: 'Organic Spinach', price: 3.49, category: 'leafy', image: '/api/placeholder/300/200', rating: 4.9 },
    { id: 3, name: 'Red Bell Peppers', price: 4.29, category: 'fruit', image: '/api/placeholder/300/200', rating: 4.7 },
    { id: 4, name: 'Sweet Potatoes', price: 1.99, category: 'root', image: '/api/placeholder/300/200', rating: 4.6 },
    { id: 5, name: 'Fresh Broccoli', price: 2.79, category: 'flower', image: '/api/placeholder/300/200', rating: 4.9 },
    { id: 6, name: 'Kale Bunch', price: 3.29, category: 'leafy', image: '/api/placeholder/300/200', rating: 4.5 },
    { id: 7, name: 'Tomatoes', price: 2.49, category: 'fruit', image: '/api/placeholder/300/200', rating: 4.8 },
    { id: 8, name: 'Cucumber', price: 1.79, category: 'fruit', image: '/api/placeholder/300/200', rating: 4.7 },
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