import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
};

export const sidebarSlice = createSlice({
  name: "sidebarSlice",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    resetSidebarState: () => {
      return initialState;
    },
  },
});

export const { toggleSidebar, resetSidebarState } = sidebarSlice.actions;

export default sidebarSlice.reducer;
