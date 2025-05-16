import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CheckCircle,
  FileText,
  Upload,
  MapPin,
  Building2,
  Lock,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  ArrowLeft,
  XCircle,
  Loader2,
  ShieldCheck,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import { RootState } from "../../app/store";
import { registerRetailer } from "../../api/reatilerApi";

interface CityResult {
  name: string;
  state: string;
  country: string;
}

const RetailerProfileCompletion = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Get email from Redux store
  const userEmail = useSelector(
    (state: RootState) => state.retailer.retailer?.email
  );

  console.log("userEmail", userEmail);

  // City search state
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  // Mock data - replace with actual data fetching
  const [registrationStatus, setRegistrationStatus] = useState({
    basicInfo: true,
    businessDetails: false,
    documents: false,
    verification: "pending", // 'pending', 'approved', 'rejected'
  });

  // Form state
  const [formData, setFormData] = useState({
    email: userEmail || "",
    shopName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    establishmentYear: "",
    shopLicenseNumber: "",
    shopImage: null as File | null,
    shopLicense: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  useEffect(() => {
    // Fetch registration status and form data
    const fetchData = async () => {
      try {
        // const response = await getRetailerRegistrationStatus();
        // setRegistrationStatus(response.status);
        // setFormData(response.data);
      } catch (error) {
        toast.error("Failed to load registration data");
      }
    };

    fetchData();
  }, []);

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.shopName) newErrors.shopName = "Shop name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.address) newErrors.address = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
      if (!formData.establishmentYear)
        newErrors.establishmentYear = "Establishment year is required";
      if (!formData.shopLicenseNumber)
        newErrors.shopLicenseNumber = "License number is required";
    }

    if (step === 2) {
      if (!formData.shopImage) newErrors.shopImage = "Shop photo is required";
      if (!formData.shopLicense)
        newErrors.shopLicense = "License document is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (step: number) => {
    if (!validateStep(step)) {
      toast.error("Please fill all required fields");
      return;
    }

    // Only proceed to next step without submitting
    if (step < 3) {
      setCurrentStep(step + 1);
      return;
    }

    // Only submit when on the final step
    setIsLoading(true);
    try {
      // Convert formData object to FormData instance
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("shopName", formData.shopName);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address[street]", formData.address);
      formDataToSend.append("address[area]", ""); // Empty area as it's not collected
      formDataToSend.append("address[city]", formData.city);
      formDataToSend.append("address[state]", formData.state);
      formDataToSend.append("address[zipCode]", formData.zipCode);
      formDataToSend.append("establishmentYear", formData.establishmentYear);
      formDataToSend.append("shopLicenseNumber", formData.shopLicenseNumber);
      if (formData.shopImage) {
        formDataToSend.append("shopImage", formData.shopImage);
      }
      if (formData.shopLicense) {
        formDataToSend.append("shopLicense", formData.shopLicense);
      }

      console.log("formDataToSend", formDataToSend);

      await registerRetailer(formDataToSend);
      toast.success("Registration completed successfully!");
      navigate('/retailer/dashboard')
      setIsComplete(true);
    } catch (error) {
      toast.error("Failed to complete registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: CityResult) => {
    setFormData({
      ...formData,
      city: city.name,
      state: city.state,
    });
    setShowCityDropdown(false);
  };

  const renderStatusBadge = () => {
    switch (registrationStatus.verification) {
      case "approved":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-green-50 border border-green-200 shadow-sm">
            <BadgeCheck className="mr-2 h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Approved & Verified
            </span>
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-red-50 border border-red-200 shadow-sm">
            <XCircle className="mr-2 h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              Needs Correction
            </span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200 shadow-sm">
            <Clock className="mr-2 h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Under Review
            </span>
          </div>
        );
    }
  };

  const renderStepIndicator = (step: number, label: string) => (
    <div
      className={`flex flex-col items-center ${
        currentStep === step
          ? "text-blue-600"
          : step < currentStep || isComplete
          ? "text-green-600"
          : "text-gray-400"
      }`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${
          currentStep === step
            ? "bg-blue-100 border-2 border-blue-600"
            : step < currentStep || isComplete
            ? "bg-green-100 border-2 border-green-600"
            : "bg-gray-100 border-2 border-gray-300"
        }`}
      >
        {step < currentStep || isComplete ? (
          <CheckCircle className="h-6 w-6" />
        ) : (
          <span className="text-lg font-semibold">{step}</span>
        )}
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </div>
  );

  const renderConnector = (active: boolean) => (
    <div
      className={`flex-1 h-1 mx-4 ${
        active ? "bg-gradient-to-r from-blue-500 to-green-500" : "bg-gray-200"
      } rounded-full`}
    ></div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Retailer Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finish setting up your account to access the full marketplace
            features
          </p>
          <div className="mt-6">{renderStatusBadge()}</div>
        </div>

        {/* Progress tracker */}
        <div className="mb-12 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            {renderStepIndicator(1, "Business Info")}
            {renderConnector(currentStep > 1 || isComplete)}
            {renderStepIndicator(2, "Documents")}
            {renderConnector(currentStep > 2 || isComplete)}
            {renderStepIndicator(3, "Verification")}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {isComplete ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Registration Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Your registration is now under review. We'll notify you via
                email once approved, typically within 1-2 business days.
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-800">
                    Confirmation sent to {formData.email}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/retailer/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-lg bg-blue-100 mr-4">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Business Information
                      </h2>
                      <p className="text-gray-600">
                        Tell us about your retail business
                      </p>
                    </div>
                  </div>

                  {registrationStatus.verification === "rejected" && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircle className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Registration requires updates
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>
                              Our team found some issues with your registration.
                              Please review and update the following:
                            </p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                              <li>Shop license document is expired</li>
                              <li>Business address needs verification</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shop Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className={`pl-10 w-full rounded-lg border ${
                            errors.shopName
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } shadow-sm`}
                          value={formData.shopName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shopName: e.target.value,
                            })
                          }
                          placeholder="Your shop name"
                        />
                      </div>
                      {errors.shopName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shopName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          className={`pl-10 w-full rounded-lg border ${
                            errors.phone
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } shadow-sm`}
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+1 (___) ___-____"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className={`pl-10 w-full rounded-lg border ${
                          errors.address
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } shadow-sm`}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Street address"
                      />
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className={`pl-10 w-full rounded-lg border ${
                            errors.city
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } shadow-sm`}
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowCityDropdown(true);
                          }}
                          onFocus={() => setShowCityDropdown(true)}
                          placeholder="Search city..."
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        {showCityDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                            {isSearching ? (
                              <div className="p-2 text-center text-gray-500">
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                <p className="mt-1 text-sm">Searching...</p>
                              </div>
                            ) : cities.length > 0 ? (
                              cities.map((city, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => {
                                    handleCitySelect(city);
                                    setSearchTerm(city.name);
                                  }}
                                >
                                  <div className="font-medium">{city.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {city.state}, {city.country}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-center text-gray-500">
                                No cities found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded-lg border ${
                          errors.state
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } shadow-sm`}
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full rounded-lg border ${
                          errors.zipCode
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } shadow-sm`}
                        value={formData.zipCode}
                        onChange={(e) =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                        placeholder="Postal code"
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Establishment Year{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          className={`pl-10 w-full rounded-lg border ${
                            errors.establishmentYear
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } shadow-sm`}
                          value={formData.establishmentYear}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              establishmentYear: e.target.value,
                            })
                          }
                          placeholder="Year founded"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className={`pl-10 w-full rounded-lg border ${
                            errors.shopLicenseNumber
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } shadow-sm`}
                          value={formData.shopLicenseNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shopLicenseNumber: e.target.value,
                            })
                          }
                          placeholder="Business license number"
                        />
                      </div>
                      {errors.shopLicenseNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.shopLicenseNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={() => handleSubmit(1)}
                      disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md flex items-center disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Document Upload */}
              {currentStep === 2 && (
                <div className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-lg bg-blue-100 mr-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Document Verification
                      </h2>
                      <p className="text-gray-600">
                        Upload required documents for verification
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Required Documents
                    </h3>

                    <div className="space-y-6">
                      {/* Shop Image */}
                      <div
                        className={`border ${
                          errors.shopImage
                            ? "border-red-300"
                            : "border-gray-200"
                        } rounded-xl p-6 bg-gray-50`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-lg font-medium text-gray-900">
                              Shop Photo
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Upload a clear photo showing your shop front or
                              interior
                            </p>
                            <div className="mt-4">
                              <div className="flex items-center">
                                {formData.shopImage ? (
                                  <div className="flex items-center text-sm text-gray-500">
                                    <span className="font-medium text-gray-900 mr-2">
                                      {formData.shopImage.name}
                                    </span>
                                    <button
                                      type="button"
                                      className="text-blue-600 hover:text-blue-500"
                                      onClick={() =>
                                        setFormData({
                                          ...formData,
                                          shopImage: null,
                                        })
                                      }
                                    >
                                      Change
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                      <div className="flex flex-col items-center">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                          Click to upload
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                          PNG, JPG up to 5MB
                                        </p>
                                      </div>
                                      <input
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            shopImage:
                                              e.target.files &&
                                              e.target.files[0]
                                                ? e.target.files[0]
                                                : null,
                                          })
                                        }
                                      />
                                    </div>
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {errors.shopImage && (
                        <p className="text-sm text-red-600 -mt-4">
                          {errors.shopImage}
                        </p>
                      )}

                      {/* License Document */}
                      <div
                        className={`border ${
                          errors.shopLicense
                            ? "border-red-300"
                            : "border-gray-200"
                        } rounded-xl p-6 bg-gray-50`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-lg font-medium text-gray-900">
                              Business License
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              Upload a clear copy of your business license or
                              permit
                            </p>
                            <div className="mt-4">
                              <div className="flex items-center">
                                {formData.shopLicense ? (
                                  <div className="flex items-center text-sm text-gray-500">
                                    <span className="font-medium text-gray-900 mr-2">
                                      {formData.shopLicense.name}
                                    </span>
                                    <button
                                      type="button"
                                      className="text-blue-600 hover:text-blue-500"
                                      onClick={() =>
                                        setFormData({
                                          ...formData,
                                          shopLicense: null,
                                        })
                                      }
                                    >
                                      Change
                                    </button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                      <div className="flex flex-col items-center">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                          Click to upload
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                          PDF, PNG, JPG up to 5MB
                                        </p>
                                      </div>
                                      <input
                                        type="file"
                                        className="sr-only"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={(e) =>
                                          setFormData({
                                            ...formData,
                                            shopLicense:
                                              e.target.files &&
                                              e.target.files[0]
                                                ? e.target.files[0]
                                                : null,
                                          })
                                        }
                                      />
                                    </div>
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {errors.shopLicense && (
                        <p className="text-sm text-red-600 -mt-4">
                          {errors.shopLicense}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center shadow-sm"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={() => handleSubmit(2)}
                      disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md flex items-center disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review and Submit */}
              {currentStep === 3 && (
                <div className="p-8">
                  <div className="flex items-center mb-8">
                    <div className="p-3 rounded-lg bg-blue-100 mr-4">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Review and Submit
                      </h2>
                      <p className="text-gray-600">
                        Verify your information before submission
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-6">
                      Review Your Information
                    </h3>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Business Information
                          </h4>
                          <dl className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Shop Name
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900 font-medium">
                                {formData.shopName || "Not provided"}
                              </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Contact Email
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900 font-medium">
                                {formData.email || "Not provided"}
                              </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Phone
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900 font-medium">
                                {formData.phone || "Not provided"}
                              </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Address
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900">
                                {formData.address || "Not provided"}
                                <br />
                                {formData.city}, {formData.state}{" "}
                                {formData.zipCode}
                              </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Established
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900">
                                {formData.establishmentYear || "Not provided"}
                              </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                License Number
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900">
                                {formData.shopLicenseNumber || "Not provided"}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Documents
                          </h4>
                          <dl className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                Shop Photo
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900">
                                {formData.shopImage ? (
                                  <span className="text-green-600 font-medium">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    Not uploaded
                                  </span>
                                )}
                              </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <dt className="text-sm font-medium text-gray-500">
                                License Document
                              </dt>
                              <dd className="col-span-2 text-sm text-gray-900">
                                {formData.shopLicense ? (
                                  <span className="text-green-600 font-medium">
                                    Uploaded
                                  </span>
                                ) : (
                                  <span className="text-red-600">
                                    Not uploaded
                                  </span>
                                )}
                              </dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 mb-8">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Lock className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium text-blue-800 mb-1">
                          Secure Submission
                        </h4>
                        <p className="text-sm text-blue-700">
                          Your information is encrypted and securely stored. By
                          submitting, you agree to our verification process
                          which may take 1-2 business days. You'll receive
                          confirmation at {formData.email}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center shadow-sm"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </button>
                    <button
                      onClick={() => handleSubmit(3)}
                      disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-md flex items-center disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit for Verification"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetailerProfileCompletion;
