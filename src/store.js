import { configureStore, createSlice } from "@reduxjs/toolkit";

// Slice placeholder para o store não ficar vazio
const shellSlice = createSlice({
  name: "shell",
  initialState: {},
  reducers: {},
});

const store = configureStore({
  reducer: {
    shell: shellSlice.reducer,
  },
  devTools: true,
});

export default store;
