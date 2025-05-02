import { Bell, Menu, Search } from "lucide-react"

function AdminHeader() {
    const location = window.location.pathname;
    const pageName = location.split('/').filter(Boolean).pop() || 'Home';
    const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
     
  return (
    <header className="bg-white shadow-sm z-10">
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center">
        <button className="md:hidden mr-4 text-gray-600 hover:text-gray-900 focus:outline-none">
          <Menu size={24} />
        </button>
        <h1 className="text-xl text-gray-800 font-bold">Admin {formattedPageName}</h1>
      </div>
      
      <div className="flex items-center space-x-5">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 pl-10 pr-4 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-medium shadow-md">
            AD
          </div>
          <div className="ml-2 hidden sm:block">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@deliverease.com</p>
          </div>
        </div>
      </div>
    </div>
  </header>
  )
}

export default AdminHeader