// src/components/VideoLogin.jsx
import React, { useState, useCallback, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
const VideoLogin = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;

    console.log("👉 Initial socket state:", socket.connected);

    socket.on("connect", () => {
      console.log("✅ Socket connected!", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("room:join", ({ room }) => {
      navigate(`/room/${room}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room:join");
    };
  }, [socket, navigate]);

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !room) {
        alert("Please fill in both email and room number.");
        return;
      }
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  return (
    <div>
      <h1>Video</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email Id</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room No</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default VideoLogin;
