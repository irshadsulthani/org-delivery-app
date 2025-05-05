import { Route, Routes } from "react-router-dom"
import ReatilerSignUp from "../pages/Reatiler/ReatilerSignUp"
import RetailerDashboard from "../pages/Reatiler/ReatilerDashboard"
import ReatilerProtectedRoutes from "../protectedRoutes/reatiler/ReatilerProtectedRoutes"
import ReatilerPublicRoute from "../protectedRoutes/reatiler/ReatilerPublicRoute"

function ReatilerRoute() {
  return (
    <div>
      <Routes>
        <Route element={<ReatilerProtectedRoutes />}>
           <Route path="/dashboard" element={<RetailerDashboard />} />
        </Route>
        <Route element={<ReatilerPublicRoute />}>
          <Route path="/sign-up" element={<ReatilerSignUp />} />
        </Route>
      </Routes>
    </div>
  )
}

export default ReatilerRoute