import React, { useState } from "react";
import { X, PlusIcon, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import axios from "../config/axios";

const AddMembersModal = ({ projectId, onClose }) => {
  console.log(projectId)
  const [email, setEmail] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Add User (Email -> Selected List)
  const handleSelectUser = () => {
    if (email.trim() && !selectedUsers.includes(email)) {
      setSelectedUsers([...selectedUsers, email]);
      setEmail("");
    }
  };

  // 🔹 Remove User from Selected List
  const handleRemoveUser = (userEmail) => {
    setSelectedUsers(selectedUsers.filter((user) => user !== userEmail));
  };

  // 🔹 Convert Emails to User IDs & Call API
  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return alert("No users selected!");
    setLoading(true);

    try {
      // Fetch User IDs from Emails
      const { data } = await axios.post("/auth/users/get-ids", {
        emails: selectedUsers,
      });
      const userIds = data.userIds;

      if (!userIds || userIds.length === 0) {
        alert("No valid users found!");
        return;
      }

      // Send User IDs to Backend
      await axios.put("/projects/add-users", {
        projectId,
        users: userIds,
      });

      alert("Users added successfully!");
      onClose(); // Close modal after success
    } catch (error) {
      console.error(
        "Error adding users:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Failed to add users.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Members</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Email Input & Add Button */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            placeholder="Enter user email"
            className="flex-grow p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSelectUser}
          >
            <PlusIcon size={24} />
          </button>
        </div>

        {/* Selected Users */}
        <div className="space-y-2">
          {selectedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-green-500 text-white transition-all hover:bg-red-500"
            >
              <span>{user}</span>
              <button onClick={() => handleRemoveUser(user)}>
                <XCircle size={20} className="hover:text-gray-200" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Collaborators Button */}
        <button
          className="w-full mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          onClick={handleAddMembers}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add as Collaborators"}
        </button>
      </motion.div>
    </div>
  );
};

export default AddMembersModal;
