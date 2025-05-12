import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Upload, MapPin, Phone, Mail, User, Lock, Briefcase, Calendar, MapPinned, ChevronDown, Check } from 'lucide-react';
import { registerDeliveryBoy } from '../../api/deliveryBoyApi';
import { toast } from 'react-toastify';

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
  const [countryCodes] = useState([
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
  
  // Get saved form data from localStorage
  const savedFormData = JSON.parse(localStorage.getItem('formData') || '{}');

  useEffect(() => {
    if (savedFormData?.name) {
      setFormData(prev => ({
        ...prev,
        fullName: savedFormData.name,
        email: savedFormData.email
      }));
    }
  }, []);

  // Fetch cities based on search term
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
        setCities(Array.isArray(data) ? data.map((result: any) => ({
          name: result.display_name.split(',')[0]?.trim() || '',
          state: result.address?.state || '',
          country: result.address?.country || '',
        })) : []);
      } catch (error) {
        console.error('Error fetching cities:', error);
        toast.error('Failed to fetch city data. Please try again.');
      } finally {
        setIsSearching(false);
      }
    };
  
    const timer = setTimeout(searchCities, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Validate if user is 18+ years old
  const validateAge = (dateString: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dateString);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCitySearch = (e: FormEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    setFormData(prev => ({
      ...prev,
      city: value,
    }));
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city: { name: string; state: string }) => {
    setFormData(prev => ({
      ...prev,
      city: city.name,
      state: city.state || ''
    }));
    setSearchTerm(city.name);
    setShowCityDropdown(false);
    setErrors(prev => ({
      ...prev,
      city: '',
      state: '',
    }));
  };

  const handleCountryCodeSelect = (code: string) => {
    setFormData(prev => ({
      ...prev,
      countryCode: code
    }));
    setShowCountryDropdown(false);
    setErrors(prev => ({
      ...prev,
      countryCode: '',
    }));
  };

  const handleFileChange = (e: FormEvent) => {
    const { name, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0],
      }));
      
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    }
  };

  const validateStep1 = (): boolean => {
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
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in Step 1 before proceeding');
      return false;
    }
    
    return true;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length < 10) {
      newErrors.address = 'Address should be at least 10 characters';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    } else if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5-6 digits';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }
    
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vehicle type is required';
    }
    
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    } else if (!/^[A-Za-z0-9]{6,12}$/.test(formData.vehicleNumber)) {
      newErrors.vehicleNumber = 'Invalid vehicle number format (6-12 alphanumeric characters)';
    }
    
    if (!formData.drivingLicense.trim()) {
      newErrors.drivingLicense = 'Driving license number is required';
    } else if (!/^[A-Za-z0-9]{8,15}$/.test(formData.drivingLicense)) {
      newErrors.drivingLicense = 'Invalid license number format (8-15 alphanumeric characters)';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in Step 2 before proceeding');
      return false;
    }
    
    return true;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.profileImage) {
      newErrors.profileImage = 'Profile image is required';
    } else if (formData.profileImage.size > 5 * 1024 * 1024) {
      newErrors.profileImage = 'Image must be less than 5MB';
    } else if (!['image/jpeg', 'image/png', 'image/gif'].includes(formData.profileImage.type)) {
      newErrors.profileImage = 'Only JPEG, PNG or GIF allowed';
    }
    
    if (!formData.idProof) {
      newErrors.idProof = 'ID proof is required';
    } else if (formData.idProof.size > 5 * 1024 * 1024) {
      newErrors.idProof = 'File must be less than 5MB';
    } else if (!['image/jpeg', 'image/png', 'application/pdf'].includes(formData.idProof.type)) {
      newErrors.idProof = 'Only JPEG, PNG or PDF allowed';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors in Step 3 before submitting');
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      toast.success('Step 1 completed successfully!');
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      toast.success('Step 2 completed successfully!');
      setStep(3);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;
    
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && typeof value !== 'object') {
          formDataToSend.append(key, value);
        }
      });
      
      // Add files
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      if (formData.idProof) {
        formDataToSend.append('verificationImage', formData.idProof);
      }
      console.log('savedFormData',savedFormData);
      
      const response = await registerDeliveryBoy(formDataToSend);
      console.log('Registration successful:', response);
      
      // Clear local storage after successful registration
      localStorage.removeItem('formData');
      
      console.log('after savedFormData',savedFormData);
      toast.success(
        <div>
          <h3 className="font-bold">Registration Successful!</h3>
          <p className="text-sm">Your application is under review. We'll notify you once approved.</p>
        </div>,
        { autoClose: 5000 }
      );
      
      navigate('/delivery/sign-up');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again later.';
      if (error.response) {
        if (error.response.data?.errors) {
          // Handle field-specific errors from backend
          const backendErrors = error.response.data.errors;
          setErrors(prev => ({ ...prev, ...backendErrors }));
          
          errorMessage = 'Please fix the highlighted errors in the form.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      console.log(savedFormData,'savedFormData');
      

      toast.error(
        <div>
          <h3 className="font-bold">Registration Error</h3>
          <p className="text-sm">{errorMessage}</p>
        </div>,
        { autoClose: 5000 }
      );
      
    } finally {
      setIsLoading(false);
    }
  };

  // ... (rest of the component remains the same, just use the updated validation and error handling)
  
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* ... (previous JSX remains the same) */}
      
      {/* Progress Indicator */}
      <div className="mb-10">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                step >= stepNumber ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber === 1 ? <User size={22} /> : 
                 stepNumber === 2 ? <Briefcase size={22} /> : <Upload size={22} />}
              </div>
              <span className="text-xs mt-2 font-medium">
                {step === stepNumber ? (
                  <span className="text-emerald-600">
                    {stepNumber === 1 ? 'Account' : stepNumber === 2 ? 'Details' : 'Documents'}
                  </span>
                ) : (
                  stepNumber === 1 ? 'Account' : stepNumber === 2 ? 'Details' : 'Documents'
                )}
              </span>
            </div>
          ))}
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
                    className={`w-full py-3 px-3 inline-flex justify-between items-center text-left border rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.countryCode ? 'border-red-300' : 'border-gray-300'
                    }`}
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
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State*
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`px-3 py-3 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="State"
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
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
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                  />
                </div>
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </div>
        )}
        
        {/* Step 3: Document Upload */}
        {step === 3 && (
          <div className="space-y-8">
            <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
              errors.profileImage ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}>
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <Upload size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Upload Profile Photo</h3>
                <p className="text-sm text-gray-500 mb-4">JPEG, PNG or GIF (Max 5MB)</p>
                
                <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                  Choose File
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                
                {formData.profileImage && (
                  <p className="mt-3 text-sm text-gray-600">
                    Selected: {formData.profileImage.name}
                    ({Math.round(formData.profileImage.size / 1024)} KB)
                  </p>
                )}
              </div>
              {errors.profileImage && (
                <p className="mt-2 text-sm text-red-600">{errors.profileImage}</p>
              )}
            </div>
            
            <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
              errors.idProof ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}>
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <Lock size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Upload ID Proof</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Upload a clear photo of your government-issued ID (Driver's License, Passport, etc.)
                </p>
                
                <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                  Choose File
                  <input
                    type="file"
                    name="idProof"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                </label>
                
                {formData.idProof && (
                  <p className="mt-3 text-sm text-gray-600">
                    Selected: {formData.idProof.name}
                    ({Math.round(formData.idProof.size / 1024)} KB)
                  </p>
                )}
              </div>
              {errors.idProof && (
                <p className="mt-2 text-sm text-red-600">{errors.idProof}</p>
              )}
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-emerald-800 mb-2">Important Notes:</h4>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• All documents must be clear and valid</li>
                <li>• Your profile photo must clearly show your face</li>
                <li>• ID proof must match your registration details</li>
                <li>• Approval may take 1-2 business days</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200"
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
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
  );
};

export default RegisterForm;