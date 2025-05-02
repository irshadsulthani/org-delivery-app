import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Upload, MapPin, Phone, Mail, User, Lock, Briefcase, Calendar } from 'lucide-react';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    zipCode: '',
    dateOfBirth: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    drivingLicense: '',
    experience: '0-1',
    profileImage: null,
    idProof: null,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
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
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Join Our Delivery Team</h1>
            <p className="mt-2 text-gray-600">
              Start earning by delivering fresh vegetables to our customers
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <User size={20} />
                </div>
                <span className="text-xs mt-1">Account</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Briefcase size={20} />
                </div>
                <span className="text-xs mt-1">Details</span>
              </div>
              
              <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
              
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <Upload size={20} />
                </div>
                <span className="text-xs mt-1">Documents</span>
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
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.fullName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
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
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="johndoe@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="********"
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="********"
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
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
                      className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`px-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="New York"
                    />
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
                      className={`px-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                        className={`pl-10 pr-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                      className="px-3 py-2 block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className={`px-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                      className={`px-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                    className={`px-3 py-2 block w-full rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
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
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-1">
                    <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                      Profile Photo*
                    </label>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                        formData.profileImage ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-100'
                      }`}>
                        {formData.profileImage ? (
                          <img
                            src={URL.createObjectURL(formData.profileImage as File)}
                            alt="Profile Preview"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <label
                          htmlFor="profileImage"
                          className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-200"
                        >
                          <span className="text-sm font-medium">Choose file</span>
                          <input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        {formData.profileImage && (
                          <span className="ml-2 text-sm text-gray-500">
                            {(formData.profileImage as File).name}
                          </span>
                        )}
                      </div>
                    </div>
                    {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a clear, recent photo of your face.
                    </p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <div className="space-y-1">
                    <label htmlFor="idProof" className="block text-sm font-medium text-gray-700">
                      Government ID Proof*
                    </label>
                    <div className="flex flex-col items-center space-y-2">
                      <div className={`w-full h-40 flex items-center justify-center ${
                        formData.idProof ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-100'
                      } rounded-lg`}>
                        {formData.idProof ? (
                          <div className="flex items-center text-emerald-500">
                            <Upload size={24} className="mr-2" />
                            <span className="font-medium">File uploaded</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <Upload size={36} />
                            <span className="mt-2 text-sm">Upload ID proof</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <label
                          htmlFor="idProof"
                          className="cursor-pointer px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 border border-emerald-200"
                        >
                          <span className="text-sm font-medium">Choose file</span>
                          <input
                            id="idProof"
                            name="idProof"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        {formData.idProof && (
                          <span className="ml-2 text-sm text-gray-500">
                            {(formData.idProof as File).name}
                          </span>
                        )}
                      </div>
                    </div>
                    {errors.idProof && <p className="mt-1 text-sm text-red-600">{errors.idProof}</p>}
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a clear image of your government-issued ID (passport, driver's license, etc.)
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto flex items-center px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Already registered? <a href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;