import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  Calendar,
  MapPinned,
  ChevronDown,
  Check,
  Building2,
  FileText,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { registerRetailer } from "../../api/reatilerApi";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  shopName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  establishmentYear: string;
  shopLicense: string;
  shopImage: File | null;
  shopLicenseImage: File | null;
}

const RetailerRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    shopName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    establishmentYear: "",
    shopLicense: "",
    shopImage: null,
    shopLicenseImage: null,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<
    { name: string; state: string; country: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [countryCodes] = useState([
    { code: "+1", country: "🇺🇸 United States" },
    { code: "+44", country: "🇬🇧 United Kingdom" },
    { code: "+91", country: "🇮🇳 India" },
    { code: "+61", country: "🇦🇺 Australia" },
    { code: "+86", country: "🇨🇳 China" },
    { code: "+49", country: "🇩🇪 Germany" },
    { code: "+33", country: "🇫🇷 France" },
    { code: "+81", country: "🇯🇵 Japan" },
    { code: "+7", country: "🇷🇺 Russia" },
    { code: "+39", country: "🇮🇹 Italy" },
  ]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Load saved user data from local storage
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("formData") || "{}");
    if (savedFormData?.name) {
      setFormData((prev) => ({
        ...prev,
        fullName: savedFormData.name,
        email: savedFormData.email,
      }));
    }
  }, []);

  // City Search Effect
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
            "User-Agent": "RetailerRegistration/1.0",
          },
        });

        const data = await response.json();
        setCities(
          Array.isArray(data)
            ? data.map((result: any) => ({
                name: result.display_name.split(",")[0]?.trim() || "",
                state: result.address?.state || "",
                country: result.address?.country || "",
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to fetch city data. Please try again.");
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchCities, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCitySearch = (e: FormEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchTerm(value);
    setFormData((prev) => ({
      ...prev,
      city: value,
    }));
    setShowCityDropdown(true);
  };

  const handleCitySelect = (city: {
    name: string;
    state: string;
    country: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      city: city.name,
      state: city.state || "",
      country: city.country || "United States",
    }));
    setSearchTerm(city.name);
    setShowCityDropdown(false);
    setErrors((prev) => ({
      ...prev,
      city: "",
      state: "",
    }));
  };

  const handleCountryCodeSelect = (code: string, country: string) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: code,
      country: country.replace(/^[^\w]+/, ""), // Remove emoji flag
    }));
    setShowCountryDropdown(false);
    setErrors((prev) => ({
      ...prev,
      countryCode: "",
    }));
  };

  const handleFileChange = (e: FormEvent) => {
    const { name, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.countryCode) {
      newErrors.countryCode = "Country code is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = "ZIP code must be 5-6 digits";
    }

    if (!formData.shopLicense.trim()) {
      newErrors.shopLicense = "Shop license number is required";
    }

    if (!formData.establishmentYear) {
      newErrors.establishmentYear = "Establishment year is required";
    } else {
      const currentYear = new Date().getFullYear();
      const enteredYear = parseInt(formData.establishmentYear);
      if (enteredYear > currentYear) {
        newErrors.establishmentYear =
          "Establishment year cannot be in the future";
      } else if (enteredYear < 1900) {
        newErrors.establishmentYear = "Please enter a valid year";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.shopImage) {
      newErrors.shopImage = "Shop image is required";
    } else if (formData.shopImage.size > 5 * 1024 * 1024) {
      newErrors.shopImage = "Image must be less than 5MB";
    } else if (
      !["image/jpeg", "image/png", "image/gif"].includes(
        formData.shopImage.type
      )
    ) {
      newErrors.shopImage = "Only JPEG, PNG or GIF allowed";
    }

    if (!formData.shopLicenseImage) {
      newErrors.shopLicenseImage = "Shop license image is required";
    } else if (formData.shopLicenseImage.size > 5 * 1024 * 1024) {
      newErrors.shopLicenseImage = "File must be less than 5MB";
    } else if (
      !["image/jpeg", "image/png", "application/pdf"].includes(
        formData.shopLicenseImage.type
      )
    ) {
      newErrors.shopLicenseImage = "Only JPEG, PNG or PDF allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) {
      toast.error("Please fix the errors before proceeding");
      return;
    } else if (step === 2 && !validateStep2()) {
      toast.error("Please fix the errors before proceeding");
      return;
    }

    toast.success(
      step === 1 ? "Personal information saved!" : "Shop details saved!"
    );
    setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      // toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append("userId", formData.fullName); // Using fullName as userId placeholder
      formDataToSend.append("shopName", formData.shopName);
      formDataToSend.append("description", ""); // Empty description as it's optional

      // Address fields
      formDataToSend.append("address[street]", formData.address);
      formDataToSend.append("address[area]", ""); // Empty area as it's not collected
      formDataToSend.append("address[city]", formData.city);
      formDataToSend.append("address[state]", formData.state);
      formDataToSend.append("address[zipCode]", formData.zipCode);
      formDataToSend.append("address[country]", formData.country);

      // Add files
      if (formData.shopImage) {
        formDataToSend.append("shopImage", formData.shopImage);
      }
      if (formData.shopLicenseImage) {
        formDataToSend.append("shopLicense", formData.shopLicenseImage);
      }

      // Add other fields
      formDataToSend.append(
        "phone",
        `${formData.countryCode}${formData.phone}`
      );
      formDataToSend.append("email", formData.email);
      formDataToSend.append("shopLicenseNumber", formData.shopLicense);
      formDataToSend.append("establishmentYear", formData.establishmentYear);

      const response = await registerRetailer(formDataToSend);
      console.log("Registration successful:", response);

      // Clear local storage after successful registration
      localStorage.removeItem("formData");

      toast.success(
        <div>
          <h3 className="font-bold">Registration Successful!</h3>
          <p className="text-sm">
            Your application is under review. We'll notify you once approved.
          </p>
        </div>,
        { autoClose: 5000 }
      );

      navigate("/retailer/sign-up");
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again later.";
      if (error.response) {
        if (error.response.data?.errors) {
          const backendErrors = error.response.data.errors;
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          errorMessage = "Please fix the highlighted errors in the form.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

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

  const StepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  step === stepNumber
                    ? "bg-blue-600 text-white"
                    : step > stepNumber
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {step > stepNumber ? <Check size={20} /> : stepNumber}
            </div>

            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-1 ${
                  step > stepNumber ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const StepTitle = () => {
    const titles = ["Personal Information", "Shop Details", "Document Upload"];
    return (
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{titles[step - 1]}</h2>
        <p className="text-gray-500 mt-1">
          {step === 1 && "Please provide your contact details"}
          {step === 2 && "Tell us about your retail business"}
          {step === 3 && "Upload required documents"}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-600 rounded-xl mb-4">
            <ShoppingBag className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Retailer Registration
          </h1>
          <p className="mt-2 text-gray-600">
            Join our marketplace and start selling your products
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Progress indicator and step title */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 pt-8 pb-4 px-8">
            <StepIndicator />
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">
                {step === 1
                  ? "Personal Information"
                  : step === 2
                  ? "Shop Details"
                  : "Document Upload"}
              </h2>
              <p className="text-blue-100 mt-1">
                {step === 1
                  ? "Let's get to know you better"
                  : step === 2
                  ? "Tell us about your business"
                  : "Upload required verification documents"}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Contact Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-blue-500" />
                      </div>
                      <div className="pl-10 pr-3 py-3 block w-full rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                        <p className="text-gray-700 font-medium">
                          {formData.fullName || "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-blue-500" />
                      </div>
                      <div className="pl-10 pr-3 py-3 block w-full rounded-lg border border-gray-200 shadow-sm bg-gray-50">
                        <p className="text-gray-700 font-medium">
                          {formData.email || "Loading..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-1 relative">
                      <button
                        type="button"
                        className={`w-full py-3 px-3 inline-flex justify-between items-center text-left border rounded-lg bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.countryCode
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          setShowCountryDropdown(!showCountryDropdown)
                        }
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
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                                onClick={() =>
                                  handleCountryCodeSelect(
                                    item.code,
                                    item.country
                                  )
                                }
                              >
                                <span>{item.country}</span>
                                {formData.countryCode === item.code && (
                                  <Check size={16} className="text-blue-500" />
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {errors.countryCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.countryCode}
                        </p>
                      )}
                    </div>

                    <div className="col-span-4 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-blue-500" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.phone
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="1234567890"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-800 flex items-center mb-2">
                    <Check size={16} className="mr-2" /> Why we need your
                    information
                  </h4>
                  <p className="text-sm text-blue-700">
                    We collect this information to verify your identity and
                    provide you with a secure account. Your details will help
                    customers contact you directly about your products.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Shop Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 size={18} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.shopName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="John's Grocery Store"
                    />
                  </div>
                  {errors.shopName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shopName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Address*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.address
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPinned size={18} className="text-blue-500" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleCitySearch}
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.city
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Search for a city..."
                        autoComplete="off"
                        onFocus={() => setShowCityDropdown(true)}
                      />

                      {showCityDropdown && searchTerm.length >= 2 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                          {isSearching ? (
                            <div className="flex justify-center items-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                          ) : cities.length > 0 ? (
                            <ul className="py-1">
                              {cities.map((city, index) => (
                                <li
                                  key={index}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition duration-150"
                                  onClick={() => handleCitySelect(city)}
                                >
                                  <div className="font-medium">{city.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {city.state}, {city.country}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No cities found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State*
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`px-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.state
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="State"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code*
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`px-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.zipCode
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="12345"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Establishment Year*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={18} className="text-blue-500" />
                      </div>
                      <input
                        type="number"
                        name="establishmentYear"
                        value={formData.establishmentYear}
                        onChange={handleChange}
                        className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.establishmentYear
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="2015"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    {errors.establishmentYear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.establishmentYear}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop License Number*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-blue-500" />
                    </div>
                    <input
                      type="text"
                      name="shopLicense"
                      value={formData.shopLicense}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 block w-full rounded-lg border shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.shopLicense
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="License number"
                    />
                  </div>
                  {errors.shopLicense && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shopLicense}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-800 flex items-center mb-2">
                    <Check size={16} className="mr-2" /> Business Verification
                  </h4>
                  <p className="text-sm text-blue-700">
                    This information helps us verify your business legitimacy
                    and ensure a trustworthy marketplace for all users. Your
                    shop details will be visible to customers.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Document Upload */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Image*
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      errors.shopImage
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Upload size={24} className="text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        {formData.shopImage ? (
                          <span className="font-medium text-blue-600">
                            {formData.shopImage.name}
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG or GIF (Max 5MB)
                      </p>
                      <input
                        type="file"
                        id="shopImage"
                        name="shopImage"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/gif"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("shopImage")?.click()
                        }
                        className="mt-3 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>
                  {errors.shopImage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shopImage}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop License Document*
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center ${
                      errors.shopLicenseImage
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={24} className="text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600 mb-1">
                        {formData.shopLicenseImage ? (
                          <span className="font-medium text-blue-600">
                            {formData.shopLicenseImage.name}
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG or PDF (Max 5MB)
                      </p>
                      <input
                        type="file"
                        id="shopLicenseImage"
                        name="shopLicenseImage"
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,application/pdf"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("shopLicenseImage")?.click()
                        }
                        className="mt-3 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium rounded-lg"
                      >
                        Choose File
                      </button>
                    </div>
                  </div>
                  {errors.shopLicenseImage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.shopLicenseImage}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-medium text-blue-800 flex items-center mb-2">
                    <Lock size={16} className="mr-2" /> Secure Document Handling
                  </h4>
                  <p className="text-sm text-blue-700">
                    Your documents are encrypted and stored securely. We only
                    use them for verification purposes and they won't be shared
                    with third parties without your consent.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Previous
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Next Step
                  <ArrowRight size={18} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="ml-auto flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <Check size={18} className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Form Progress */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Step {step} of 3
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/retailers/login")}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Sign in here
            </button>
          </p>
          <p className="mt-2">
            By registering, you agree to our{" "}
            <button className="text-blue-600 hover:text-blue-500 font-medium">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-blue-600 hover:text-blue-500 font-medium">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RetailerRegistrationForm;