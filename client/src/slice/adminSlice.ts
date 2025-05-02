import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAdminState } from "../interfaces/admin/IAdminState";


const initialState: IAdminState = {
    admin:null
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmin(state, action: PayloadAction<IAdminState['admin']>) {
            state.admin = action.payload
        },
        adminLogout(state) {
            state.admin = null
        }
    }
})

export const { setAdmin, adminLogout } = adminSlice.actions
export default adminSlice.reducer;