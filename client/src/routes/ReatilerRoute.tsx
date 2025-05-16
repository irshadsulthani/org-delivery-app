import { Route, Routes } from "react-router-dom"
import ReatilerSignUp from "../pages/Reatiler/ReatilerSignUp"
import RetailerDashboard from "../pages/Reatiler/ReatilerDashboard"
import ReatilerProtectedRoutes from "../protectedRoutes/reatiler/ReatilerProtectedRoutes"
import ReatilerPublicRoute from "../protectedRoutes/reatiler/ReatilerPublicRoute"
import AddProductPage from "../pages/Reatiler/AddProductPage"
import RegisterRetailer from "../pages/Reatiler/RegisterRetailer"
import RetailerProfileCompletion from "../pages/Reatiler/RetailerRegistrationCompletion"
import RegistrationStatus from "../components/reatilerComponents/RegistrationStatusProps"

function ReatilerRoute() {
  return (
    <div>
      <Routes>
        <Route element={<ReatilerProtectedRoutes />}>
           <Route path="/dashboard" element={<RetailerDashboard />} />
           <Route path="/add-product" element={<AddProductPage />} />
           <Route path="/complete-registration" element={<RetailerProfileCompletion />} />
           <Route path="/registration-status" element={<RegistrationStatus />} />
        </Route>
        <Route element={<ReatilerPublicRoute />}>
          <Route path="/sign-up" element={<ReatilerSignUp />} />
          <Route path="/register-retailer" element={<RegisterRetailer />} />
        </Route>
      </Routes>
    </div>
  )
}

export default ReatilerRoute