import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminPublicRoute from '../protectedRoutes/admin/AdminPublicRoute';
import AdminProtectedRoutes from '../protectedRoutes/admin/AdminProtectedRoutes';
import CustomerListing from '../pages/admin/CustomerListing';

function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminProtectedRoutes />}>
        <Route path='/dashboard' element={ <AdminDashboard /> } />
        <Route path='/customers' element={ <CustomerListing />} />
      </Route>
      <Route element={<AdminPublicRoute />}>
        <Route path="/login" element={<AdminLogin />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;
