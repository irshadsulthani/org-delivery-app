<<<<<<< HEAD
import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Edit3,
  Save,
  Plus,
  Trash2,
  Star,
=======
import { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  Star, 
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  Camera,
  X,
  CheckCircle,
  Home,
  ShoppingBag,
  Menu,
<<<<<<< HEAD
  Loader2,
} from "lucide-react";
import DashboardSidebar from "../../components/Customer/DashboardSidebar";
=======
  Loader2
} from 'lucide-react';
import DashboardSidebar from '../../components/Customer/DashboardSidebar';
>>>>>>> d387b79 (feat:- now doing the customer address adding)
import {
  getCustomerProfile,
  updateCustomerProfile,
  addCustomerAddress,
  updateCustomerAddress,
<<<<<<< HEAD
  deleteCustomerAddress,
} from "../../api/customerApi";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/Customer/LoadinSpinner";

interface Address {
  _id: string;
=======
  deleteCustomerAddress
} from '../../api/customerApi';

interface Address {
  id: string;
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  profileImageUrl: string;
  memberSince: string;
  totalOrders: number;
  addresses: Address[];
<<<<<<< HEAD
  profileImageFile?: File | null;
=======
>>>>>>> d387b79 (feat:- now doing the customer address adding)
}

const ProfilePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
<<<<<<< HEAD
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState<
    { name: string; state: string; country: string }[]
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
=======
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    profileImageUrl: "",
    memberSince: "",
    totalOrders: 0,
<<<<<<< HEAD
    addresses: [],
  });
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
=======
    addresses: []
  });
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await getCustomerProfile();
      setProfile(data);
    } catch (error) {
<<<<<<< HEAD
      console.error("Failed to fetch profile:", error);
=======
      console.error('Failed to fetch profile:', error);
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);

      // Preview the image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfile((prev) => ({
            ...prev,
            profileImageUrl: event.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
=======

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
>>>>>>> d387b79 (feat:- now doing the customer address adding)
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("phone", profile.phone);

      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      await updateCustomerProfile(formData);

      setEditMode(false);
      showSuccess("Profile updated successfully!");
      fetchProfileData(); // Refresh the profile data
    } catch (error) {
      console.error("Failed to update profile:", error);
=======
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('phone', profile.phone);
      
      await updateCustomerProfile(formData);
      setEditMode(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    } finally {
      setLoading(false);
    }
  };
<<<<<<< HEAD
const validateAddress = (address: typeof newAddress): boolean => {
  const { street, city, state, zipCode, country } = address;

  if (!street) {
    toast.error("Street is required.");
    return false;
  }
  if (!city) {
    toast.error("City is required.");
    return false;
  }
  if (!state) {
    toast.error("State is required.");
    return false;
  }
  if (!zipCode) {
    toast.error("Zip code is required.");
    return false;
  }
  if (!/^\d{6}$/.test(zipCode)) {
    toast.error("Zip code must be 6 digits.");
    return false;
  }
  if (!country) {
    toast.error("Country is required.");
    return false;
  }

  return true;
};

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

const resetAddressForm = () => {
  setNewAddress({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  setShowAddDialog(false);
};


const handleAddAddress = async () => {
  if (!validateAddress(newAddress)) return;

  try {
    setLoading(true);
    const response = await addCustomerAddress(newAddress);

    // Update local state immediately instead of waiting for refresh
    setProfile(prev => ({
      ...prev,
      addresses: [...prev.addresses, response],
    }));

    await fetchProfileData(); // Optionally refresh profile data

    resetAddressForm();
    toast.success("Address added successfully!");
  } catch (error) {
    console.error("Failed to add address:", error);
    toast.error("Failed to add address. Please try again.");
  } finally {
    setLoading(false);
  }
};
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
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchCities, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

const handleEditAddress = async () => {
  if (!editingAddress) return;

  try {
    setLoading(true);
    const updatedAddress = await updateCustomerAddress(editingAddress._id, {
      street: editingAddress.street,
      city: editingAddress.city,
      state: editingAddress.state,
      zipCode: editingAddress.zipCode,
      country: editingAddress.country,
    });

    // Update local state immediately
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => 
        addr._id === editingAddress._id ? updatedAddress : addr
      ),
    }));

    await fetchProfileData(); // Optionally refresh profile data

    setShowEditDialog(false);
    setEditingAddress(null);
    toast.success("Address updated successfully!");
  } catch (error) {
    console.error("Failed to update address:", error);
    toast.error("Failed to update address. Please try again.");
  } finally {
    setLoading(false);
  }
};

const handleDeleteAddress = async (addressId: string) => {
  try {
    setLoading(true);
    await deleteCustomerAddress(addressId);

    // Update local state immediately
    setProfile(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr._id !== addressId),
    }));

    await fetchProfileData();

    toast.success("Address deleted successfully!");
  } catch (error) {
    console.error("Failed to delete address:", error);
    toast.error("Failed to delete address. Please try again.");
  } finally {
    setLoading(false);
  }
};
=======

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      return;
    }

    try {
      setLoading(true);
      const response = await addCustomerAddress(newAddress);
      
      setProfile(prev => ({
        ...prev,
        addresses: [...prev.addresses, response]
      }));

      setNewAddress({ street: '', city: '', state: '', zipCode: '', country: '' });
      setShowAddDialog(false);
      showSuccess('Address added successfully!');
    } catch (error) {
      console.error('Failed to add address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress) return;

    try {
      setLoading(true);
      const updatedAddress = await updateCustomerAddress(editingAddress.id, {
        street: editingAddress.street,
        city: editingAddress.city,
        state: editingAddress.state,
        zipCode: editingAddress.zipCode,
        country: editingAddress.country
      });

      setProfile(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr => 
          addr.id === editingAddress.id ? updatedAddress : addr
        )
      }));

      setShowEditDialog(false);
      setEditingAddress(null);
      showSuccess('Address updated successfully!');
    } catch (error) {
      console.error('Failed to update address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await deleteCustomerAddress(addressId);
      
      setProfile(prev => ({
        ...prev,
        addresses: prev.addresses.filter(addr => addr.id !== addressId)
      }));
      
      showSuccess('Address deleted successfully!');
    } catch (error) {
      console.error('Failed to delete address:', error);
    } finally {
      setLoading(false);
    }
  };
>>>>>>> d387b79 (feat:- now doing the customer address adding)

  const handleSetDefault = async (addressId: string) => {
    try {
      setLoading(true);
<<<<<<< HEAD
      await updateCustomerAddress(addressId, { isDefault: true });

      setProfile((prev) => ({
        ...prev,
        addresses: prev.addresses.map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        })),
      }));
      await fetchProfileData();
      showSuccess("Default address updated!");
    } catch (error) {
      console.error("Failed to set default address:", error);
=======
      // Assuming your API supports setting default address
      await updateCustomerAddress(addressId, { isDefault: true });
      
      setProfile(prev => ({
        ...prev,
        addresses: prev.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }))
      }));
      
      showSuccess('Default address updated!');
    } catch (error) {
      console.error('Failed to set default address:', error);
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setShowEditDialog(true);
  };

  if (loading && !profile.name) {
    return (
<<<<<<< HEAD
     <>
     <DashboardSidebar 
             isOpen={sidebarOpen} 
             onClose={handleCloseSidebar} 
           />
           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
     </>
=======
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
      </div>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">My Profile</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex">
        {/* Sidebar */}
<<<<<<< HEAD
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

=======
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />
        
>>>>>>> d387b79 (feat:- now doing the customer address adding)
        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 rounded-lg flex items-center animate-fade-in">
                <CheckCircle size={20} className="mr-3" />
                {successMessage}
              </div>
            )}

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                My Profile
              </h1>
<<<<<<< HEAD
              <p className="text-slate-600">
                Manage your account information and preferences
              </p>
=======
              <p className="text-slate-600">Manage your account information and preferences</p>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="xl:col-span-1">
<<<<<<< HEAD
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 transition-all hover:shadow-lg">
                  <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                  <div className="relative px-6 pb-6">
                    <div className="flex justify-center -mt-16">
                      <div className="relative group">
                        <img
                          src={
                            profile.profileImageUrl ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
                          }
                          alt={profile.name}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
                        />
                        <label className="absolute bottom-2 right-2 p-2 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all cursor-pointer transform hover:scale-110">
                          <Camera size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <h2 className="text-2xl font-bold text-slate-800">
                        {profile.name}
                      </h2>
                      <p className="text-slate-600 mt-1">{profile.email}</p>
                      <p className="text-slate-500 text-sm mt-2">
                        Member since {profile.memberSince}
                      </p>
=======
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                  <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                  <div className="relative px-6 pb-6">
                    <div className="flex justify-center -mt-16">
                      <div className="relative">
                        <img
                          src={profile.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"}
                          alt={profile.name}
                          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                        <button className="absolute bottom-2 right-2 p-2 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors">
                          <Camera size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-center mt-4">
                      <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                      <p className="text-slate-600 mt-1">{profile.email}</p>
                      <p className="text-slate-500 text-sm mt-2">Member since {profile.memberSince}</p>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    </div>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center text-slate-600">
                        <Phone size={16} className="mr-3 text-slate-400" />
<<<<<<< HEAD
                        <span className="text-sm">
                          {profile.phone || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <ShoppingBag
                          size={16}
                          className="mr-3 text-slate-400"
                        />
                        <span className="text-sm">
                          {profile.totalOrders} orders completed
                        </span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Home size={16} className="mr-3 text-slate-400" />
                        <span className="text-sm">
                          {profile.addresses.length} saved addresses
                        </span>
=======
                        <span className="text-sm">{profile.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <ShoppingBag size={16} className="mr-3 text-slate-400" />
                        <span className="text-sm">{profile.totalOrders} orders completed</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Home size={16} className="mr-3 text-slate-400" />
                        <span className="text-sm">{profile.addresses.length} saved addresses</span>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-2 space-y-8">
                {/* Personal Information */}
<<<<<<< HEAD
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-md">
=======
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                  <div className="border-b border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
<<<<<<< HEAD
                        <h3 className="text-xl font-semibold text-slate-800">
                          Personal Information
                        </h3>
                      </div>

=======
                        <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
                      </div>
                      
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                      {editMode ? (
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
<<<<<<< HEAD
                          className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all font-medium shadow-sm"
=======
                          className="flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save size={16} className="mr-2" />
                          )}
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => setEditMode(true)}
<<<<<<< HEAD
                          className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium shadow-sm"
=======
                          className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                        >
                          <Edit3 size={16} className="mr-2" />
                          Edit
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) =>
                            setProfile({ ...profile, name: e.target.value })
                          }
=======
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                          disabled={!editMode}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 transition-colors"
                        />
                      </div>
                      <div>
<<<<<<< HEAD
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email Address
                        </label>
=======
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                        <input
                          type="email"
                          value={profile.email}
                          disabled
<<<<<<< HEAD
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-800"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
=======
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                          disabled={!editMode}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
<<<<<<< HEAD
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all hover:shadow-md">
=======
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                  <div className="border-b border-slate-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
<<<<<<< HEAD
                        <h3 className="text-xl font-semibold text-slate-800">
                          Delivery Addresses
                        </h3>
                      </div>

=======
                        <h3 className="text-xl font-semibold text-slate-800">Delivery Addresses</h3>
                      </div>
                      
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                      <button
                        onClick={() => setShowAddDialog(true)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all font-medium shadow-md"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Address
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {profile.addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
<<<<<<< HEAD
                        <h4 className="text-lg font-medium text-slate-600 mb-2">
                          No addresses saved
                        </h4>
                        <p className="text-slate-500">
                          Add your first delivery address to get started
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {profile.addresses?.length ? (
                          profile.addresses.map((address) => {
                            if (!address) return null;
                            const addressId = address._id || address._id;

                            return (
                              <div
                                key={addressId}
                                className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                                  address.isDefault
                                    ? "border-emerald-300 bg-emerald-50"
                                    : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                              >
                                {address.isDefault && (
                                  <div className="absolute top-4 right-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                      <Star size={12} className="mr-1" />
                                      Default
                                    </span>
                                  </div>
                                )}

                                <div className="space-y-2 mb-4">
                                  <p className="font-medium text-slate-800">
                                    {address.street || "No street address"}
                                  </p>
                                  <p className="text-slate-600">
                                    {address.city || "Unknown city"},{" "}
                                    {address.state || ""}{" "}
                                    {address.zipCode || ""}
                                  </p>
                                  <p className="text-slate-500 text-sm">
                                    {address.country || "No country specified"}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                                  <div className="flex space-x-3">
                                    {!address.isDefault && (
                                      <button
                                        onClick={() =>
                                          handleSetDefault(addressId)
                                        }
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                      >
                                        Set as Default
                                      </button>
                                    )}
                                    <button
                                      onClick={() => openEditDialog(address)}
                                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                    >
                                      Edit
                                    </button>
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleDeleteAddress(addressId)
                                    }
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full text-center py-12">
                            <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-slate-600 mb-2">
                              No addresses saved
                            </h4>
                            <p className="text-slate-500">
                              Add your first delivery address to get started
                            </p>
                          </div>
                        )}
=======
                        <h4 className="text-lg font-medium text-slate-600 mb-2">No addresses saved</h4>
                        <p className="text-slate-500">Add your first delivery address to get started</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {profile.addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`relative p-6 rounded-xl border-2 transition-all hover:shadow-md ${
                              address.isDefault 
                                ? 'border-emerald-300 bg-emerald-50' 
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            {address.isDefault && (
                              <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  <Star size={12} className="mr-1" />
                                  Default
                                </span>
                              </div>
                            )}
                            
                            <div className="space-y-2 mb-4">
                              <p className="font-medium text-slate-800">{address.street}</p>
                              <p className="text-slate-600">{address.city}, {address.state} {address.zipCode}</p>
                              <p className="text-slate-500 text-sm">{address.country}</p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                              <div className="flex space-x-3">
                                {!address.isDefault && (
                                  <button
                                    onClick={() => handleSetDefault(address.id)}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                  >
                                    Set as Default
                                  </button>
                                )}
                                <button
                                  onClick={() => openEditDialog(address)}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Edit
                                </button>
                              </div>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddDialog && (
<<<<<<< HEAD
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  Add New Address
                </h3>
=======
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Add New Address</h3>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                <button
                  onClick={() => setShowAddDialog(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
<<<<<<< HEAD

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => {
                        setNewAddress({ ...newAddress, city: e.target.value });
                        setSearchTerm(e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="New York"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-3.5">
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      </div>
                    )}
                    {cities.length > 0 && searchTerm.length >= 2 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg border border-slate-200 max-h-60 overflow-auto">
                        {cities.map((city, index) => (
                          <div
                            key={`${city.name}-${city.state}-${index}`} // Unique key for each city
                            className="px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => {
                              setNewAddress({
                                ...newAddress,
                                city: city.name,
                                state: city.state,
                                country: city.country,
                              });
                              setCities([]);
                              setSearchTerm("");
                            }}
                          >
                            <div className="font-medium">{city.name}</div>
                            <div className="text-sm text-slate-500">
                              {city.state && `${city.state}, `}
                              {city.country}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, zipCode: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
=======
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="NY"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    placeholder="10001"
                  />
                </div>
                <div>
<<<<<<< HEAD
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, country: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
=======
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> d387b79 (feat:- now doing the customer address adding)
            <div className="p-6 border-t border-slate-200 flex space-x-3">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAddress}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all font-medium shadow-md disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
<<<<<<< HEAD
                  "Save Address"
=======
                  'Save Address'
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {showEditDialog && editingAddress && (
<<<<<<< HEAD
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">
                  Edit Address
                </h3>
=======
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-800">Edit Address</h3>
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>
<<<<<<< HEAD

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  value={editingAddress.street}
                  onChange={(e) =>
                    setEditingAddress({
                      ...editingAddress,
                      street: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={editingAddress.city}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
=======
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                <input
                  type="text"
                  value={editingAddress.street}
                  onChange={(e) => setEditingAddress({...editingAddress, street: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    value={editingAddress.city}
                    onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    placeholder="New York"
                  />
                </div>
                <div>
<<<<<<< HEAD
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={editingAddress.state}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        state: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
=======
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  <input
                    type="text"
                    value={editingAddress.state}
                    onChange={(e) => setEditingAddress({...editingAddress, state: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    placeholder="NY"
                  />
                </div>
              </div>
<<<<<<< HEAD

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={editingAddress.zipCode}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        zipCode: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
=======
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={editingAddress.zipCode}
                    onChange={(e) => setEditingAddress({...editingAddress, zipCode: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    placeholder="10001"
                  />
                </div>
                <div>
<<<<<<< HEAD
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editingAddress.country}
                    onChange={(e) =>
                      setEditingAddress({
                        ...editingAddress,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
=======
                  <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={editingAddress.country}
                    onChange={(e) => setEditingAddress({...editingAddress, country: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> d387b79 (feat:- now doing the customer address adding)
            <div className="p-6 border-t border-slate-200 flex space-x-3">
              <button
                onClick={() => setShowEditDialog(false)}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditAddress}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all font-medium shadow-md disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
<<<<<<< HEAD
                  "Update Address"
=======
                  'Update Address'
>>>>>>> d387b79 (feat:- now doing the customer address adding)
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;