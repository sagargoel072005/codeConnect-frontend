import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const messagesEndRef = useRef(null);

  // Fetch chat messages from your backend
  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text, createdAt, fileUrl } = msg;
        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          createdAt,
          fileUrl,
        };
      });

      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  // Real-time socket connection
  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.on("messageReceived", ({ firstName, lastName, text, fileUrl }) => {
      const timestamp = new Date().toISOString();
      setMessages((messages) => [
        ...messages,
        { firstName, lastName, text, createdAt: timestamp, fileUrl },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserId]);

  // Send text message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const socket = createSocketConnection();
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
    setShowEmojiPicker(false);
  };


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-3xl mx-auto border border-gray-200 rounded-md my-6 flex flex-col h-[80vh] bg-white text-gray-800 shadow-lg">
      {/* Header */}
      <header className="p-4 border-b border-gray-200 text-lg font-bold text-blue-600">
        💬 CodeConnect Chat
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.map((msg, index) => {
          const isSender = user.firstName === msg.firstName;

          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[70%] px-4 py-2 rounded-2xl shadow ${
                  isSender
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
                }`}
              >
                {!isSender && (
                  <p className="text-xs font-semibold mb-1 text-gray-600">
                    {msg.firstName} {msg.lastName}
                  </p>
                )}
                {msg.text && <p>{msg.text}</p>}
                <span className="text-[10px] opacity-70 block mt-1 text-right">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 flex items-center gap-3 bg-white relative">
        {/* Emoji toggle */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-600 hover:text-blue-600"
        >
          <FaSmile size={22} />
        </button>

             {/* Text input */}
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
          className="flex-1 rounded-full bg-gray-100 border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-50">
            <EmojiPicker
              onEmojiClick={(emoji) =>
                setNewMessage((prev) => prev + emoji.emoji)
              }
              theme="light"
              height={350}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
