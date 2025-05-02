import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  IUserState } from '../interfaces/customer/IUserState';

const initialState: IUserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUserState['user']>) {
      state.user = action.payload;
    },
    userLogout(state) {
      state.user = null;
    },
  },
});

export const { setUser, userLogout } = userSlice.actions;
export default userSlice.reducer;
