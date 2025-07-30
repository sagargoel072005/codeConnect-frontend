import { createSlice } from "@reduxjs/toolkit";

const agoraSlice = createSlice({
  name: "agora",
  initialState: {
    remoteUsers: {},
  },
  reducers: {
    addRemoteUser: (state, action) => {
  const { uid } = action.payload;
  state.remoteUsers[uid] = { uid }; // or more fields if needed
},
    removeRemoteUser: (state, action) => {
      delete state.remoteUsers[action.payload];
    },
  },
});

export const { addRemoteUser, removeRemoteUser } = agoraSlice.actions;
export default agoraSlice.reducer;
