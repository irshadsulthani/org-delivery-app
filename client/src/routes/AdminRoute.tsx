import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPublicRoute from '../protectedRoutes/admin/AdminPublicRoute';
import AdminProtectedRoutes from '../protectedRoutes/admin/AdminProtectedRoutes';
import CustomerListing from '../pages/admin/CustomerListing';
import DeliveryBoyListing from '../pages/admin/DeliveryBoyListing';
import RetailerListing from '../pages/admin/ReatilersListing';


function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminProtectedRoutes />}>
        <Route path='/dashboard' element={ <AdminDashboard /> } />
        <Route path='/customers' element={ <CustomerListing />} />
        <Route path='/delivery-boy' element={ <DeliveryBoyListing />} />
        <Route path='/reatilers' element={<RetailerListing />} />
      </Route>
      <Route element={<AdminPublicRoute />}>
        <Route path="/login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
