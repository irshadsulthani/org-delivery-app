import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Upload, MapPin, Phone, Mail, User, Lock, Briefcase, Calendar, Search, MapPinned, ChevronDown, Check } from 'lucide-react';

// Define the API key and base URL for OpenCage API
const OPENCAGE_API_KEY = 'YOUR_OPENCAGE_API_KEY'; // Replace with your OpenCage API key
const OPENCAGE_API_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    drivingLicense: '',
    experience: '0-1',
    profileImage: null as File | null,
    idProof: null as File | null,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<{ name: string; state: string; country: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [countryCodes, setCountryCodes] = useState([
    { code: '+1', country: '🇺🇸 United States' },
    { code: '+44', country: '🇬🇧 United Kingdom' },
    { code: '+91', country: '🇮🇳 India' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+86', country: '🇨🇳 China' },
    { code: '+49', country: '🇩🇪 Germany' },
    { code: '+33', country: '🇫🇷 France' },
    { code: '+81', country: '🇯🇵 Japan' },
    { code: '+7', country: '🇷🇺 Russia' },
    { code: '+39', country: '🇮🇹 Italy' },
  ]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const savedFormData = JSON.parse(localStorage.getItem('formData') || '{}');

  useEffect(() => {
    // Populate form data from saved data
    if (savedFormData?.name) {
      setFormData(prev => ({
        ...prev,
        fullName: savedFormData.name,
        email: savedFormData.email
      }));
    }
  }, []);

  // Fetch cities based on search term using OpenCage API
  useEffect(() => {
    const searchCities = async () => {
      if (searchTerm.length < 2) {
        setCities([]);
        return;
      }
  
      setIsSearching(true);
      try {
        const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchTerm
        )}&format=json&limit=10`;
  
        const response = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)',
          },
        });
  
        const data = await response.json();
        
        console.log(data);
        

        if (Array.isArray(data)) {
          const formattedCities = data.map((result: any) => ({
            name: result.display_name.split(',')[0]?.trim() || '',
            state: result.address?.state || '',
            country: result.address?.country || '',
          }));
  
          setCities(formattedCities);
        } else {
          setCities([]);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsSearching(false);
      }
    };
  
    const timer = setTimeout(() => {
      searchCities();
    }, 500);
  
    return () => clearTimeout(timer);
  }, [searchTerm]);
  

  const handleChange = (e:FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleCitySearch = (e: FormEvent) => {
    setSearchTerm((e.target as HTMLInputElement).value);
    setFormData({
      ...formData,
      city: (e.target as HTMLInputElement).value,
    });
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city: { name: any; state: any; country?: string; }) => {
    setFormData({
      ...formData,
      city: city.name,
      state: city.state
    });
    setSearchTerm(city.name);
    setShowCityDropdown(false);
  };

  const handleCountryCodeSelect = (code: string) => {
    setFormData({
      ...formData,
      countryCode: code
    });
    setShowCountryDropdown(false);
  };

  const handleFileChange = (e : FormEvent) => {
    const { name, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      
      // Clear error when user uploads a file
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: '',
        });
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.countryCode) {
      newErrors.countryCode = 'Country code is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }
    
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }
    
    if (!formData.drivingLicense.trim()) {
      newErrors.drivingLicense = 'Driving license number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
      const newErrors: Record<string, string> = {};
    
    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    }
    
    if (!formData.idProof) {
      newErrors.idProof = 'ID proof is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e : FormEvent) => {
    e.preventDefault();
    
    if (step === 3 && validateStep3()) {
      setIsLoading(true);
      try {
        // Here you would typically send the form data to your API
        // const response = await registerDeliveryBoy(formData);
        console.log('Form submitted:', formData);
        
        // Show success and redirect
        setTimeout(() => {
          alert('Registration successful! Please wait for admin approval.');
          navigate('/login');
        }, 1500);
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-10 border border-emerald-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <UserPlus size={28} className="text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Join Our Delivery Team</h1>
            <p className="mt-2 text-gray-600">
              Start earning by delivering fresh vegetables to our customers
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                  step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <User size={22} />
                </div>
                <span className="text-xs mt-2 font-medium">{step === 1 ? <span className="text-emerald-600">Account</span> : "Account"}</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                  step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Briefcase size={22} />
                </div>
                <span className="text-xs mt-2 font-medium">{step === 2 ? <span className="text-emerald-600">Details</span> : "Details"}</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                  step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Upload size={22} />
                </div>
                <span className="text-xs mt-2 font-medium">{step === 3 ? <span className="text-emerald-600">Documents</span> : "Documents"}</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="pl-10 pr-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300 bg-gray-50"
                        defaultValue={savedFormData?.name}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        className="pl-10 pr-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300 bg-gray-50"
                        defaultValue={savedFormData?.email}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1 relative">
                      <button
                        type="button"
                        className="w-full py-3 px-3 inline-flex justify-between items-center text-left border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      >
                        <span>{formData.countryCode}</span>
                        <ChevronDown size={16} className="text-gray-400" />
                      </button>
                      
                      {showCountryDropdown && (
                        <div className="absolute z-10 mt-1 w-48 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                          <ul className="py-1">
                            {countryCodes.map((item) => (
                              <li 
                                key={item.code}
                                className="px-4 py-2 hover:bg-emerald-50 cursor-pointer flex items-center justify-between"
                                onClick={() => handleCountryCodeSelect(item.code)}
                              >
                                <span>{item.country}</span>
                                {formData.countryCode === item.code && (
                                  <Check size={16} className="text-emerald-500" />
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {errors.countryCode && <p className="mt-1 text-sm text-red-600">{errors.countryCode}</p>}
                    </div>
                    
                    <div className="col-span-4 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.phone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="1234567890"
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinned size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleCitySearch}
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.city ? 'border-red-300' : ''
                        }`}
                        placeholder="Search for a city..."
                        autoComplete="off"
                        onFocus={() => setShowCityDropdown(true)}
                      />
                      
                      {showCityDropdown && searchTerm.length >= 2 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                          {isSearching ? (
                            <div className="flex justify-center items-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                            </div>
                          ) : cities.length > 0 ? (
                            <ul className="py-1">
                              {cities.map((city, index) => (
                                <li 
                                  key={index}
                                  className="px-4 py-2 hover:bg-emerald-50 cursor-pointer"
                                  onClick={() => handleCitySelect(city)}
                                >
                                  <div className="font-medium">{city.name}</div>
                                  <div className="text-xs text-gray-500">{city.state}, {city.country}</div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No cities found</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code*
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`px-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.zipCode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Experience
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="px-3 py-3 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="0-1">0-1 years</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Type*
                    </label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className={`px-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.vehicleType ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="bike">Bike</option>
                      <option value="scooter">Scooter</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                    </select>
                    {errors.vehicleType && <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Number*
                    </label>
                    <input
                      type="text"
                      id="vehicleNumber"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      className={`px-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.vehicleNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="ABC123"
                    />
                    {errors.vehicleNumber && <p className="mt-1 text-sm text-red-600">{errors.vehicleNumber}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="drivingLicense" className="block text-sm font-medium text-gray-700 mb-1">
                    Driving License Number*
                  </label>
                  <input
                    type="text"
                    id="drivingLicense"
                    name="drivingLicense"
                    value={formData.drivingLicense}
                    onChange={handleChange}
                    className={`px-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.drivingLicense ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="DL12345678"
                  />
                  {errors.drivingLicense && <p className="mt-1 text-sm text-red-600">{errors.drivingLicense}</p>}
                </div>
              </div>
            )}
            
            {/* Step 3: Document Upload */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center bg-emerald-50">
                  <div className="space-y-3">
                    <div className="mx-auto flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm">
                      <Upload size={24} className="text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Upload Your Documents</h3>
                    <p className="text-sm text-gray-500">
                      Please upload clear photos of your documents for verification
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Photo*
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      errors.profileImage ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400'
                    }`}>
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <User size={24} className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.profileImage 
                            ? formData.profileImage.name 
                            : 'Click to upload your photo'}
                        </p>
                        <label
                          htmlFor="profileImage"
                          className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-md text                          text-sm font-medium transition-colors"
                        >
                          Choose File
                        </label>
                        <input
                          type="file"
                          id="profileImage"
                          name="profileImage"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                    {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
                  </div>

                  <div>
                    <label htmlFor="idProof" className="block text-sm font-medium text-gray-700 mb-1">
                      ID Proof (Aadhaar/Passport/Driving License)*
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
                      errors.idProof ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-emerald-400'
                    }`}>
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Lock size={24} className="text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {formData.idProof 
                            ? formData.idProof.name 
                            : 'Click to upload your ID proof'}
                        </p>
                        <label
                          htmlFor="idProof"
                          className="cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Choose File
                        </label>
                        <input
                          type="file"
                          id="idProof"
                          name="idProof"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                          className="hidden"
                        />
                      </div>
                    </div>
                    {errors.idProof && <p className="mt-1 text-sm text-red-600">{errors.idProof}</p>}
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Please ensure all documents are clear and valid. Blurry or expired documents will delay your approval process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-10 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Previous
                </button>
              ) : (
                <div></div> 
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-emerald-600 rounded-lg text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;