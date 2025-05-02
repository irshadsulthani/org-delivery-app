import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoute';
import DeliveryBoyRoute from './routes/DeliveryBoyRoute';
import CustomerRoute from './routes/CustomerRoute';
import ReatilerRoute from './routes/ReatilerRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/delivery/*" element={<DeliveryBoyRoute />} />
        <Route path="/*" element={<CustomerRoute />} />
        <Route path="/retailer/*" element={<ReatilerRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;