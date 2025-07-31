import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import tokenReducer from "./tokenSlice";
import agoraReducer from "./agoraSlice";

const appStore = configureStore({
    reducer: {
        user: userReducer,
        feed: feedReducer,
        connections: connectionReducer,
        request: requestReducer,
        token: tokenReducer,
        agora: agoraReducer,
    },
});

export default appStore;