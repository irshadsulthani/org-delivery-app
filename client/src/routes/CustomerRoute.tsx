import { Route, Routes, useLocation } from "react-router-dom";
import CustomerSignUp from "../pages/customer/CustomerSignUp";
import CustomerHome from "../pages/customer/CustomerHome";
import Navbar from "../components/Customer/Navbar";
import UserProtectedRoutes from "../protectedRoutes/user/UserProtectedRoutes";
import UserPublicRoute from "../protectedRoutes/user/UserPublicRoute";
import Shop from "../pages/customer/Shop";
import ProductDetail from "../pages/customer/ProductDetail";

function CustomerRoute() {
  const location = useLocation();

  // Paths where Navbar should be hidden
  const hideNavbarOnPaths = ["/sign-up"];

  const shouldShowNavbar = !hideNavbarOnPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        {/* Always accessible home route */}
        <Route path="/" element={<CustomerHome />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/products/:productId' element={<ProductDetail />} />
        {/* Protected routes */}
        <Route element={<UserProtectedRoutes />}>
          {/* Add any additional protected routes here */}
        </Route>

        {/* Public-only routes */}
        <Route element={<UserPublicRoute />}>
          <Route path="/sign-up" element={<CustomerSignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default CustomerRoute;
