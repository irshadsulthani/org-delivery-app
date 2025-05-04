import { Route, Routes } from "react-router-dom"
import ReatilerSignUp from "../pages/Reatiler/ReatilerSignUp"
import RetailerDashboard from "../pages/Reatiler/ReatilerDashboard"

function ReatilerRoute() {
  return (
    <div>
      <Routes>
        <Route path="/sign-up" element={<ReatilerSignUp />} />
        <Route path="/dashboard" element={<RetailerDashboard />} />
      </Routes>
    </div>
  )
}

export default ReatilerRoute