import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import peer from "../utils/peer";
import { createSocketConnection } from "../utils/socket";

export default function RoomPage() {
  const { roomId } = useParams();

  const socket = useRef(null);
  const myStreamRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const myVideoRef = useRef();
  const remoteVideoRef = useRef();

  // ✅ 1. Setup socket
  useEffect(() => {
    socket.current = createSocketConnection();

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // ✅ 2. Socket event handlers
  const handleNewUserJoined = useCallback(async ({ id }) => {
    console.log("New user joined:", id);
    const offer = await peer.getOffer();
    socket.current.emit("user:call", { to: id, offer });
  }, []);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    console.log("Incoming Call from:", from);
    const ans = await peer.getAnswer(offer);
    socket.current.emit("call:accepted", { to: from, ans });
  }, []);

  const handleCallAccepted = useCallback(async ({ ans }) => {
    console.log("Call accepted with ans:", ans);
    await peer.setRemoteAnswer(ans);
  }, []);

  const handleNegoNeeded = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.current.emit("peer:nego:done", { to: from, ans });
  }, []);

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setRemoteAnswer(ans);
  }, []);

  // ✅ 3. Listen for socket events
  useEffect(() => {
    if (socket.current) {
      socket.current.emit("room:join", { email: "abc@example.com", room: roomId });

      socket.current.on("user:joined", handleNewUserJoined);
      socket.current.on("incomming:call", handleIncomingCall);
      socket.current.on("call:accepted", handleCallAccepted);
      socket.current.on("peer:nego:needed", handleNegoNeeded);
      socket.current.on("peer:nego:final", handleNegoFinal);
    }

    return () => {
      if (socket.current) {
        socket.current.off("user:joined", handleNewUserJoined);
        socket.current.off("incomming:call", handleIncomingCall);
        socket.current.off("call:accepted", handleCallAccepted);
        socket.current.off("peer:nego:needed", handleNegoNeeded);
        socket.current.off("peer:nego:final", handleNegoFinal);
      }
    };
  }, [
    handleNewUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeeded,
    handleNegoFinal,
    roomId,
  ]);

  // ✅ 4. Start local stream safely
  useEffect(() => {
    const startStream = async () => {
      if (myStreamRef.current) return; // Already streaming!

      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        myStreamRef.current = localStream;

        // Attach local stream to local video
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = localStream;
        }

        // Add local tracks to peer connection
        await peer.addTrack(localStream);

        // Listen for remote tracks
        peer.peer.ontrack = (event) => {
          const [remote] = event.streams;
          setRemoteStream(remote);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remote;
          }
        };
      } catch (err) {
        console.error("Failed to get user media:", err);
      }
    };

    startStream();

    // ✅ 5. Cleanup when leaving
    return () => {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => track.stop());
        myStreamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="p-5">
      <h2 className="text-xl mb-2">Video Room: {roomId}</h2>
      <div className="flex gap-4">
        <div>
          <h3 className="text-lg">My Video</h3>
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 bg-black"
          />
        </div>
        <div>
          <h3 className="text-lg">Remote Video</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-64 h-48 bg-black"
          />
        </div>
      </div>
    </div>
  );
}
