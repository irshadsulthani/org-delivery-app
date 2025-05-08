import { Route, Routes } from "react-router-dom"
import DeliveryBoySignUp from "../pages/DeliveryBoy/DeliveryBoySignUp"
import DeliveryBoyDashboard from "../pages/DeliveryBoy/DeliveryBoyDashboard"
import DeliveryBoyProtectedRoute from "../protectedRoutes/deliveryBoy/DeliveryBoyProtectedRoute"
import DeliveryBoyPublicRoute from "../protectedRoutes/deliveryBoy/DeliveryBoyPublicRoute"
import RegisterForm from "../pages/DeliveryBoy/RegisterDeliveryBoy"

function DeliveryBoyRoute() {
  return (
    <div>
      <Routes>
        <Route element={<DeliveryBoyProtectedRoute />} >
          <Route path='/dashboard' element={<DeliveryBoyDashboard />} />
        </Route>
        <Route element={<DeliveryBoyPublicRoute />}>
          <Route path="/sign-up" element={ <DeliveryBoySignUp /> } />
          <Route path='/register-dev' element={<RegisterForm />} />
        </Route>
      </Routes>
    </div>
  )
}

export default DeliveryBoyRoute