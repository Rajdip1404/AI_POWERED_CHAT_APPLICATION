import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Folder, ChevronDown, LogOut, X } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useUserContext } from "../context/user.context";
import toast from "react-hot-toast";
import axios from "../config/axios";

const HomePage = () => {
  const { user, setUser } = useUserContext();
  const { isAuthenticated, checkAuth, logout, isCheckingAuth } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  useEffect(() => {
    checkAuth(setUser);
  }, [checkAuth, setUser]);

  const handleLogout = async () => {
    await logout(setUser);
    setDropdownOpen(false);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!projectName || !projectDescription) {
      toast.error("All fields are required");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Ensure the user is authenticated
      if (!token) {
        toast.error("You are not authenticated!");
        return;
      }

      const response = await axios.post(
        "/projects/create",
        {
          name: projectName,
          description: projectDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Send token for authentication
        }
      );

      toast.success(response.data.message || "Project created successfully!");

      // Reset state
      setIsModalOpen(false);
      setProjectName("");
      setProjectDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen backdrop-blur-lg flex flex-col">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-8 px-15 bg-transparent fixed top-0 left-0 right-0 backdrop-blur-md">
        <Link
          to="/"
          className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition"
        >
          RealChat
        </Link>

        <div className="relative">
          {isCheckingAuth ? (
            <span className="text-gray-600">Checking auth...</span>
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-5 py-2 bg-white/50 text-black font-bold rounded-lg shadow-lg hover:scale-105 active:scale-95 transition"
              >
                {user.email} <ChevronDown size={18} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-lg">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 active:scale-95 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 bg-white/50 text-black font-bold rounded-lg shadow-lg hover:scale-105 active:scale-95 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 mt-2 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-8xl px-10 font-bold bg-gradient-to-r from-gray-600 via-blue-600 to-cyan-600 text-transparent bg-clip-text mb-10"
        >
          Connect in Real Time - powered by AI
        </motion.h1>

        <div className="flex gap-6 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg shadow-lg hover:scale-105 active:scale-95 transition"
            onClick={() => {
              if (!isAuthenticated) {
                toast.error("You must be logged in to create a project");
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            <Plus size={20} /> Create New Project
          </motion.button>
          {isAuthenticated && (
            <Link
              to="/my-projects"
              className="flex items-center gap-2 px-6 py-3 bg-white/50 text-black font-bold text-lg rounded-lg shadow-lg hover:scale-105 active:scale-95 transition"
            >
              <Folder size={20} /> My Projects
            </Link>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Project</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Project Name"
                className="w-full p-2 border rounded mb-4"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <textarea
                placeholder="Project Description"
                className="w-full p-2 border rounded mb-4"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              ></textarea>
              <button
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                onClick={handleCreateProject}
              >
                Create Project
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
