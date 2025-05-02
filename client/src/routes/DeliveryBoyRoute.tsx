import { Route, Routes } from "react-router-dom"
import DeliveryBoySignUp from "../pages/DeliveryBoy/DeliveryBoySignUp"
import DeliveryBoyDashboard from "../pages/DeliveryBoy/DeliveryBoyDashboard"

function DeliveryBoyRoute() {
  return (
    <div>
      <Routes>
        <Route path="/sign-up" element={ <DeliveryBoySignUp /> } />
        <Route path='/dashboard' element={<DeliveryBoyDashboard />} />
      </Routes>
    </div>
  )
}

export default DeliveryBoyRoute