import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "../config/axios"; // Ensure correct axios config

const MemberSidebar = ({ projectId, onClose }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch members when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`/projects/${projectId}/members`);
        
        setMembers(response.data.members);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-start">
      <div className="w-[30%] h-full bg-white p-6 shadow-lg transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Project Members</h3>
          <button
            className="p-2 rounded hover:bg-gray-200 hover:cursor-pointer"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 🔹 Show Loading Indicator */}
        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p>No members found.</p>
        ) : (
          <ul>
            {members.map((member) => (
              <li key={member._id} className="p-2 border-b">
                {member.name} ({member.email})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberSidebar;
