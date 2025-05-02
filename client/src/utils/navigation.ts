import { store } from "../app/store";
import { adminLogout } from "../slice/adminSlice";
import { logoutDeliveryboy } from "../slice/deliveryBoySlice";
import { userLogout } from "../slice/userSlice";

export const navigateToRoleLogin = () => {
  const state = store.getState();

  const adminRole = state?.admin?.admin?.role;
  const deliveryBoyRole = state?.deliveryBoy?.deliveryBoy?.role;
  const userRole = state?.auth?.user?.role;

  // Determine which role is active (based on your login system)
  const role = adminRole || deliveryBoyRole || userRole;

  console.log("Detected role:", role);

  switch (role) {
    case "admin":
        store.dispatch(adminLogout());
      window.location.href = "/admin/login";
      break;
    case "deliveryBoy":
        store.dispatch(logoutDeliveryboy())
      window.location.href = "/delivery/sign-up";
      break;
    case "user":
        store.dispatch(userLogout());
      window.location.href = "/sign-up";
      break;
    default:
      window.location.href = "";
      break;
  }
};
