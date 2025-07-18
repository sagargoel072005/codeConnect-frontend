import { useEffect, useState, useRef, useCallback } from "react";
import PeerService from "../utils/Peer";
import { useSocket } from "../context/SocketContext";

const RoomPage = () => {
  const { socket } = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [peerService, setPeerService] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // ✅ Attach local stream to video element
  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream]);

  // ✅ Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // ✅ Get user media on component mount
  useEffect(() => {
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
  } catch (error) {
    console.error("Error accessing media devices:", error);
    alert("Camera or mic already in use by another app or tab.");
  }
};

    startCamera();
  }, []);

  // ✅ Handle when another user joins
const handleUserJoined = useCallback(
  ({ email, id }) => {
    console.log(`User joined: ${email} , ${id}`);
    setRemoteSocketId(id);
  },
  []
);


  // ✅ Handle outgoing call
  const handleCallUser = useCallback(async () => {
    if (!peerService || !remoteSocketId) return;
    console.log("📞 Calling user now...");
    const offer = await peerService.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [peerService, remoteSocketId, socket]);

  // ✅ Handle incoming call
const handleIncommingCall = useCallback(
  async ({ from, offer }) => {
    console.log("📞 Incoming call from:", from);

    if (peerService) return; // Don’t recreate

    const peer = new PeerService(socket, from);
    peer.setOnTrackCallback((event) => {
      console.log("📥 Track received (incoming)");
      setRemoteStream(event.streams[0]);
    });
    myStream.getTracks().forEach((track) => peer.peer.addTrack(track, myStream));

    await peer.setRemoteDescription(offer); // ← KEY FIX
    const ans = await peer.getAnswer(); // ← Already includes setLocalDescription
    setPeerService(peer);

    socket.emit("call:accepted", { to: from, ans });
  },
  [socket, myStream, peerService]
);


  // ✅ Handle call accepted
  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      console.log("Call accepted");
      await peerService?.setRemoteDescription(ans);
    },
    [peerService]
  );

  // ✅ Handle ICE candidates
const handleIceCandidate = useCallback(
  async ({ from, candidate }) => {
    console.log("📡 ICE Candidate received");
    if (peerService) {
      await peerService.addIceCandidate(candidate);
    }
  },
  [peerService]
);

  // ✅ Handle disconnection
  const handleUserDisconnected = useCallback(({ id }) => {
    console.log(`❌ User disconnected: ${id}`);
    setRemoteSocketId(null);
    setRemoteStream(null);
    setPeerService(null);
  }, []);

  // ✅ Register socket listeners
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user:disconnected", handleUserDisconnected);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("user:disconnected", handleUserDisconnected);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleIceCandidate,
    handleUserDisconnected,
  ]);

useEffect(() => {
  if (remoteSocketId && !peerService && myStream) {
    console.log("📞 I'm the second user, initiating call...");
    const peer = new PeerService(socket, remoteSocketId);
    peer.setOnTrackCallback((event) => {
      console.log("📥 Track received (auto-call)");
      setRemoteStream(event.streams[0]);
    });
    myStream.getTracks().forEach((track) => peer.peer.addTrack(track, myStream));
    setPeerService(peer);

    const startCall = async () => {
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
    };

    startCall();
  }
}, [remoteSocketId, peerService, myStream, socket]);

useEffect(() => {
  const roomId = window.location.pathname.split("/").pop();
  socket.emit("room:join", { room: roomId, email: "user@example.com" } );
}, [socket]);


useEffect(() => {
  socket.on("room:users", (users) => {
    console.log("Other users in room:", users);
    if (users.length > 0) {
      setRemoteSocketId(users[0]); // Or loop to handle multiple
    }
  });

  return () => socket.off("room:users");
}, [socket]);

return (
  <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-start">
    <h2 className="text-3xl font-semibold mb-4 text-center text-blue-600">📹 Video Call Room</h2>

    <div className="mb-6 text-center">
      {remoteSocketId ? (
        <span className="text-green-600 font-medium">✅ Connected to peer</span>
      ) : (
        <span className="text-yellow-500 font-medium">🕓 Waiting for other user...</span>
      )}
    </div>

    <div className="flex flex-wrap justify-center gap-8 mb-6">
      <div className="flex flex-col items-center">
        <video
          ref={myVideoRef}
          autoPlay
          muted
          playsInline
          className="w-80 h-60 bg-black rounded-lg shadow-md"
        />
        <p className="mt-2 font-semibold">You</p>
      </div>

      {remoteStream && (
        <div className="flex flex-col items-center">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-80 h-60 bg-black rounded-lg shadow-md"
          />
          <p className="mt-2 font-semibold">Peer</p>
        </div>
      )}
    </div>

    {remoteSocketId && (
      <button
        onClick={handleCallUser}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-lg font-medium transition"
      >
        📞 Call
      </button>
    )}
  </div>
);

};

export default RoomPage;




/**import React, { useEffect, useRef, useState, useCallback } from "react";
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
 */