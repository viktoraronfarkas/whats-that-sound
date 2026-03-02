import { createSlice } from "@reduxjs/toolkit";

export const viewSlice = createSlice({
  name: "view",
  initialState: {
    value: "tracking",
  },
  reducers: {
    setToCollection: (state) => {
      state.value = "collection";
    },
    setToTracker: (state) => {
      state.value = "tracking";
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToCollection, setToTracker } = viewSlice.actions;

export default viewSlice.reducer;
