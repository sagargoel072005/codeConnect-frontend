// src/context/SocketContext.js
import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";

export const SocketContext = createContext(null);
const socket = location.hostname === "localhost" ? io("http://localhost:7777") : io("/", { path: "/api/socket.io" }); 

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
