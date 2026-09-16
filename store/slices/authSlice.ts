import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Warehouse = {
  _id: string;
  name: string;
  email?: string;
  contactNumber?: string;
  location?: { lat: number; lng: number };
  address?: {
    formatted?: string;
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
    area?: string;
    country?: string;
    landmark?: string;
    location?: { lat: number; lng: number };
  };
  isActive?: boolean;
};

type AuthState = {
  warehouse: Warehouse | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  warehouse: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setWarehouse(state, action: PayloadAction<Warehouse>) {
      state.warehouse = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.warehouse = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setWarehouse, logout } = authSlice.actions;
export default authSlice.reducer;
