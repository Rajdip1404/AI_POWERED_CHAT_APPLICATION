import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/user.context";
import { useLocation } from "react-router-dom";
import { Users, Send, PlusIcon } from "lucide-react";
import { Resizable } from "re-resizable";
import AddMembersModal from "../components/AddMembersModal";
import MemberSidebar from "../components/MemberSidebar";
import {
  initializeSocket,
  sendMessage,
  receiveMessage,
  disconnectSocket,
} from "../config/socket.js";

const Project = () => {
  const location = useLocation();
  const projectId = location.state?.project?._id;
  const projectName = location.state?.project?.name || "Project";

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { user } = useUserContext();

  useEffect(() => {
    if (!projectId) return;

    const socket = initializeSocket(projectId);

    receiveMessage("project-message", (data) => {
      console.log("New message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("project-message");
      disconnectSocket(); // Ensure disconnection on unmount
    };
  }, [projectId]);

  const send = () => {
    if (!message.trim()) return;

    sendMessage("project-message", {
      message,
      sender: user?._id || "Anonymous",
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      { message, sender: "You" },
    ]);
    setMessage("");
  };

  return (
    <main className="h-screen w-screen flex bg-gradient-to-r from-blue-200 to-cyan-200">
      <Resizable
        defaultSize={{ width: "40%", height: "100%" }}
        minWidth="20%"
        maxWidth="50%"
        className="h-full bg-white/45 backdrop-blur-md shadow-lg relative pb-3"
      >
        <header className="flex justify-between items-center py-4 px-6 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md">
          <h2 className="font-semibold text-lg">{projectName}</h2>
          <div className="flex gap-4">
            <button
              className="p-2 rounded hover:bg-black/25 hover:cursor-pointer"
              onClick={() => setIsAddMembersOpen(true)}
            >
              <PlusIcon className="w-6 h-6" />
            </button>
            <button
              className="p-2 rounded hover:bg-black/25 hover:cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Users className="w-6 h-6" />
            </button>
          </div>
        </header>

        <div className="flex flex-col flex-grow p-4 overflow-y-auto h-[calc(100%-120px)]">
          {messages.map((msg, index) => (
            <div key={index} className="flex flex-col self-end max-w-[80%]">
              <small className="opacity-65 pb-0.5 pl-1 text-s text-gray-900">
                {msg.sender || "User"}
              </small>
              <div className="p-2 bg-blue-400 text-white rounded-lg break-words overflow-hidden">
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 pb-6 flex items-center bg-gray-100 shadow-md">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={send}
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </Resizable>

      {isSidebarOpen && (
        <MemberSidebar
          projectId={projectId}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}

      {isAddMembersOpen && (
        <AddMembersModal
          projectId={projectId}
          onClose={() => setIsAddMembersOpen(false)}
        />
      )}
    </main>
  );
};

export default Project;
