import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import { motion } from "framer-motion";
import { Plus, Users, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddMembersModal from "../components/AddMembersModal";
import ViewMembersModal from "../components/ViewMembersModal";

const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [viewMemberModalOpen, setViewMemberModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/projects/all-projects");
      setProjects(res.data.allProjectsByUser || []);
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      toast.error("All fields are required");
      return;
    }
    try {
      await axios.post("/projects/create", {
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      toast.success("Project created successfully!");
      setIsModalOpen(false);
      setProjectName("");
      setProjectDescription("");
      fetchProjects();
    } catch (error) {
      toast.error("Error creating project");
    }
  };

  return (
    <div className="min-h-screen py-10 px-14 backdrop-blur-lg bg-white/20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl pb-1 font-bold text-gray-800">My Projects</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-500 via-blue-500 to-cyan-500 text-white font-bold text-xl px-6 py-4 rounded-lg shadow-md hover:scale-105 transition"
        >
          <Plus size={20} /> Create New Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="p-6 bg-white rounded-lg shadow-lg backdrop-blur-md hover:bg-slate-100 hover:shadow-xl hover:cursor-pointer hover:transition duration-200 ease-in-out"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold">{project.name}</h2>
                </div>
                <button
                  onClick={() =>
                    navigate(`/project/${project._id}`, { state: { project } })
                  }
                  className="rounded-lg flex items-center gap-1 text-lg text-gray-600 hover:text-gray-950 hover:cursor-pointer hover:transition duration-200 ease-in-out"
                >
                  Open <ArrowRight size={20} />
                </button>
              </div>
              <p className="text-gray-600 mb-2">{project.description}</p>
              <p className="text-sm text-gray-500">
                Created on: {new Date(project.startDate).toLocaleDateString()}
              </p>
              <p className="flex gap-10 items-center text-md text-gray-700 font-semibold capitalize">
                Status: {project.status}
                <div className="flex items-center gap-3">
                  <Users size={15} /> Collaborators: {project.users.length || 0}
                </div>
              </p>
              <div className="flex mt-4 gap-4">
                <button
                  onClick={() => {
                    setSelectedProject(project._id);
                    setIsAddMembersOpen(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Plus size={18} /> Add Members
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(project._id);
                    setTimeout(() => setViewMemberModalOpen(true), 0); // Fix issue where projectId is not set
                  }}
                  className="bg-gray-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  <Users size={18} /> View Members
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No projects found</p>
        )}
      </div>

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-96"
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
        </div>
      )}

      {/* Add Members Modal */}
      {isAddMembersOpen && selectedProject && (
        <AddMembersModal
          projectId={selectedProject}
          onClose={() => setIsAddMembersOpen(false)}
        />
      )}

      {/* View Members Modal */}
      {viewMemberModalOpen && selectedProject && (
        <ViewMembersModal
          projectId={selectedProject}
          onClose={() => setViewMemberModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyProjectsPage;
