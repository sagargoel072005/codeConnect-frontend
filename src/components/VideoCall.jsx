import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useDispatch, useSelector } from "react-redux";
import { fetchToken } from "../utils/tokenSlice";
import { Video, PhoneOff } from "lucide-react";

const APP_ID = import.meta.env.VITE_APP_ID;

const VideoCall = () => {
  const [channelName, setChannelName] = useState(() => localStorage.getItem("channel") || "");
  const [joined, setJoined] = useState(() => localStorage.getItem("joined") === "true");
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
        if (!remoteContainer && typeof window !== "undefined") {
          remoteContainer = document.createElement("div");
          remoteContainer.id = remoteId;
          remoteContainer.className =
            "w-full sm:w-[300px] h-[200px] bg-gray-900 rounded-lg shadow";
          document.getElementById("remote-playerlist")?.appendChild(remoteContainer);
        }
        user.videoTrack?.play(remoteContainer);
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    client.on("user-unpublished", (user) => {
      document.getElementById(`remote-${user.uid}`)?.remove();
    });

    client.on("user-left", (user) => {
      document.getElementById(`remote-${user.uid}`)?.remove();
    });

    const start = async () => {
      try {
        await client.join(APP_ID, channelName, token, uidRef.current);
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracksRef.current = { audioTrack, videoTrack };

        // DOM safe check before playing local video
        if (typeof window !== "undefined") {
          const localDiv = document.getElementById("local-player");
          if (localDiv) {
            videoTrack.play(localDiv);
          }
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
      if (typeof window !== "undefined") {
        const remoteContainer = document.getElementById("remote-playerlist");
        if (remoteContainer) remoteContainer.innerHTML = "";
      }

      localStorage.removeItem("joined");
      localStorage.removeItem("channel");
      setJoined(false);
      setChannelName("");
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-blue-800 flex flex-col items-center justify-center p-4">
      {!joined ? (
        <div className="w-full max-w-md bg-blue-50 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-2xl font-bold text-center">Join Video Call</h2>
          <input
            type="text"
            placeholder="Enter Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full px-4 py-2 border border-blue-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
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
        <div className="w-full max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-semibold mb-2 sm:mb-0">Channel: {channelName}</h2>
            <button
              onClick={leaveChannel}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
            >
              <PhoneOff className="w-5 h-5" />
              Leave
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
            <div
              id="local-player"
              className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow"
            ></div>
            <div
              id="remote-playerlist"
              className="flex flex-wrap justify-center gap-4"
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
