import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./constants";

export const fetchToken = createAsyncThunk(
  "token/fetchToken",
  async ({ channel, uid }) => {
    const response = await axios.get(
      `${BASE_URL}/token/${channel}/${uid}`
    );
    return response.data.rtcToken;
  }
);

const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.value = action.payload;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tokenSlice.reducer;