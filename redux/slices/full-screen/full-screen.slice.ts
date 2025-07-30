import { createSlice } from "@reduxjs/toolkit";

interface FullScreenInitialState {
  isFullscreen: boolean;
}

const initialState: FullScreenInitialState = {
  isFullscreen: false,
};

const fullScreenSlice = createSlice({
  name: "full-screen",
  initialState,
  reducers: {
    setIsFullscreen: (state, action: { payload: boolean }) => {
      state.isFullscreen = action.payload;
    },
  },
});

const fullScreenReducer = fullScreenSlice.reducer;

export default fullScreenReducer;

export const { setIsFullscreen } = fullScreenSlice.actions;
