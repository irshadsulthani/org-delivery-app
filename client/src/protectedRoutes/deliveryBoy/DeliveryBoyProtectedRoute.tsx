import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate, Outlet } from "react-router-dom"


function DeliveryBoyProtectedRoute() {
    const deliverBoyState = useSelector((state:RootState) => state.deliveryBoy.deliveryBoy )

    return deliverBoyState ? <Outlet /> : <Navigate to='/delivery/sign-up' />
}

export default DeliveryBoyProtectedRoute