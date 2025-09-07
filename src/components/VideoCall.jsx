import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useDispatch, useSelector } from "react-redux";
import { fetchToken } from "../utils/tokenSlice";
import {
  Video,
  PhoneOff,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Users,
  LayoutGrid,
  Square,
} from "lucide-react";

const APP_ID = import.meta.env.VITE_APP_ID;

const VideoCall = () => {
  const [channelName, setChannelName] = useState(() => localStorage.getItem("channel") || "");
  const [joined, setJoined] = useState(() => localStorage.getItem("joined") === "true");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [layout, setLayout] = useState("grid"); // grid | speaker
  const [participants, setParticipants] = useState([]);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.value);

  const clientRef = useRef(null);
  const localTracksRef = useRef({});
  const uidRef = useRef(Math.floor(Math.random() * 100000));

  useEffect(() => {
    if (joined && channelName) {
      dispatch(fetchToken({ channel: channelName, uid: uidRef.current }));
    }
  }, [joined]);

  useEffect(() => {
    if (!token || !joined) return;

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      const remoteId = `remote-${user.uid}`;

      if (mediaType === "video") {
        let remoteContainer = document.getElementById(remoteId);
        if (!remoteContainer) {
          remoteContainer = document.createElement("div");
          remoteContainer.id = remoteId;
          remoteContainer.className =
            "relative bg-black rounded-xl overflow-hidden shadow-lg aspect-video flex items-center justify-center";
          const nameTag = document.createElement("div");
          nameTag.innerText = `User ${user.uid}`;
          nameTag.className =
            "absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded";
          remoteContainer.appendChild(nameTag);

          document.getElementById("remote-playerlist")?.appendChild(remoteContainer);
        }
        user.videoTrack?.play(remoteContainer);
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }

      setParticipants((prev) => [...new Set([...prev, user.uid])]);
    });

    client.on("user-unpublished", (user) => {
      document.getElementById(`remote-${user.uid}`)?.remove();
      setParticipants((prev) => prev.filter((id) => id !== user.uid));
    });

    client.on("user-left", (user) => {
      document.getElementById(`remote-${user.uid}`)?.remove();
      setParticipants((prev) => prev.filter((id) => id !== user.uid));
    });

    const start = async () => {
      try {
        await client.join(APP_ID, channelName, token, uidRef.current);
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = { audioTrack, videoTrack };

        const localDiv = document.getElementById("local-player");
        if (localDiv) {
          videoTrack.play(localDiv);
        }

        await client.publish([audioTrack, videoTrack]);
      } catch (err) {
        console.error("Error starting call:", err);
      }
    };

    start();

    return () => {
      client.removeAllListeners();
    };
  }, [token, joined]);

  const joinChannel = () => {
    if (channelName.trim()) {
      localStorage.setItem("joined", "true");
      localStorage.setItem("channel", channelName);
      setJoined(true);
    }
  };

  const leaveChannel = async () => {
    try {
      const client = clientRef.current;
      const { audioTrack, videoTrack } = localTracksRef.current;

      if (audioTrack) {
        audioTrack.stop();
        audioTrack.close();
      }
      if (videoTrack) {
        videoTrack.stop();
        videoTrack.close();
      }

      await client.leave();
      const remoteContainer = document.getElementById("remote-playerlist");
      if (remoteContainer) remoteContainer.innerHTML = "";

      localStorage.removeItem("joined");
      localStorage.removeItem("channel");
      setJoined(false);
      setChannelName("");
      setParticipants([]);
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  const toggleMic = () => {
    const { audioTrack } = localTracksRef.current;
    if (audioTrack) {
      micOn ? audioTrack.setEnabled(false) : audioTrack.setEnabled(true);
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    const { videoTrack } = localTracksRef.current;
    if (videoTrack) {
      camOn ? videoTrack.setEnabled(false) : videoTrack.setEnabled(true);
      setCamOn(!camOn);
    }
  };

  return (
    <div className="min-h-screen bg-white  text-white flex flex-col items-center justify-center p-4">
      {!joined ? (
        <div className="w-full max-w-md bg-gray-300 p-6 rounded-xl shadow-2xl space-y-4">
          <h2 className="text-2xl font-bold text-center text-black">Join Video Call</h2>
          <input
            type="text"
            placeholder="Enter Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-00 text-black rounded focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={joinChannel}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            <Video className="w-5 h-5" />
            Join Call
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-7xl h-screen flex flex-col">
<div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center bg-gray-900/80 px-3 py-1.5 shadow-md">
  <span className="text-xs sm:text-sm font-semibold">Channel: {channelName}</span>
  <span className="flex items-center gap-1 text-xs sm:text-sm">
    <Users className="w-4 h-4" /> {participants.length + 1}
  </span>
</div>
{/* Video Grid or Speaker View */}
<div
  id="remote-playerlist"
  className={`flex-1 px-4 pb-4 pt-12 gap-4 transition-all ${
    layout === "grid"
      ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr"
      : "flex flex-col items-center justify-center"
  }`}
/>

          {/* Local Video Preview */}
          <div
            id="local-player"
            className={`absolute ${
              layout === "grid" ? "bottom-24 right-4 w-40" : "bottom-24 right-4 w-52"
            } aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-blue-500`}
          >
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
              You
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 p-4 flex justify-center gap-6">
            <button
              onClick={toggleMic}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-red-500" />}
            </button>
            <button
              onClick={toggleCam}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              {camOn ? (
                <Camera className="w-6 h-6" />
              ) : (
                <CameraOff className="w-6 h-6 text-red-500" />
              )}
            </button>
            <button
              onClick={() => setLayout(layout === "grid" ? "speaker" : "grid")}
              className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              {layout === "grid" ? <Square className="w-6 h-6" /> : <LayoutGrid className="w-6 h-6" />}
            </button>
            <button
              onClick={leaveChannel}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
