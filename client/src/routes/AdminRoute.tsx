import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPublicRoute from '../protectedRoutes/admin/AdminPublicRoute';
import AdminProtectedRoutes from '../protectedRoutes/admin/AdminProtectedRoutes';
import CustomerListing from '../pages/admin/CustomerListing';
import DeliveryBoyListing from '../pages/admin/DeliveryBoyListing';
import RetailerListing from '../pages/admin/ReatilersListing';
import DeliveryBoyDetailsPage from '../pages/admin/DeliveryBoyDetails';
import RetailerDeatiles from '../pages/admin/RetailerDeatiles';


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminProtectedRoutes />}>
        <Route path='/dashboard' element={ <AdminDashboard /> } />
        <Route path='/customers' element={ <CustomerListing />} />
        <Route path='/delivery-boys' element={ <DeliveryBoyListing />} />
        <Route path='/retailers' element={<RetailerListing />} />
        <Route path="/delivery-boy/:id" element={<DeliveryBoyDetailsPage />} />
        <Route path='/retailer/:id' element={<RetailerDeatiles/>} />
      </Route>
      <Route element={<AdminPublicRoute />}>
        <Route path="/login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
