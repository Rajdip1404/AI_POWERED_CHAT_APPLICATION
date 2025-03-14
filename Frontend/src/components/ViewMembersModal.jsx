import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import axios from "../config/axios"; // Ensure correct axios configuration

const ViewMembersModal = ({ projectId, onClose }) => {
  console.log(projectId)
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch project members when modal opens
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

    if (projectId) fetchMembers();
  }, [projectId]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="max-h-2/3 bg-white p-6 rounded-lg shadow-lg min-w-96 max-w-1/3 overflow-y-auto relative">
        {/* 🔹 Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Project Members</h2>
          <button onClick={onClose} className="p-2 text-gray-600 hover:text-black hover:cursor-pointer hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* 🔹 Member List */}
        {loading ? (
          <p className="text-center text-gray-950 text-xl">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-center">No members found.</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li key={member._id} className="p-2 border rounded shadow-sm hover:bg-slate-300 hover:cursor-pointer">
                <strong className="text-xl">{member.name}</strong> <br />
                <span className="text-gray-700 text-m">{member.email}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewMembersModal;
