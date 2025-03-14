import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const createProject = async ({ name, description, userId }) => {
  if (!name) throw new Error("Project name is required");
  if (!description) throw new Error("Project description is required");
  if (!userId) throw new Error("User is required");

  const project = await Project.create({ name, description, users: [userId] });
  return project;
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) throw new Error("User is required");

  const allUserProjects = await Project.find({ users: userId });
  return allUserProjects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid Project ID");

  if (!userId) throw new Error("UserId is required");
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid User ID");

  if (!users || !Array.isArray(users) || users.length === 0) {
    throw new Error("At least one user is required as an array");
  }

  // 🔹 Convert user IDs to valid ObjectIds
  const validUserIds = await User.find({ _id: { $in: users } }).select("_id");
  if (validUserIds.length === 0) {
    throw new Error("No valid users found");
  }

  // 🔹 Find the project & ensure the requester is a member
  const project = await Project.findOne({ _id: projectId, users: userId });

  if (!project) {
    throw new Error("Project not found or user doesn't belong to this project");
  }

  // 🔹 Ensure `project.users` exists
  const existingUsers = project.users
    ? project.users.map((id) => id.toString())
    : [];

  // 🔹 Remove duplicates & update the project
  const uniqueUsers = [
    ...new Set([
      ...existingUsers,
      ...validUserIds.map((user) => user._id.toString()),
    ]),
  ].map((id) => new mongoose.Types.ObjectId(id));

  // 🔹 If no new users are added, return without saving
  if (uniqueUsers.length === existingUsers.length) {
    return project; // No changes needed
  }

  // 🔹 Update project with unique users
  project.users = uniqueUsers;
  await project.save();

  return project;
};


export const getProjectById = async ({ projectId }) => {
  if (!projectId) throw new Error("Project ID is required");
  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid Project ID");

  const project = await Project.findById(projectId).populate("users");

  if (!project) throw new Error("Project not found");

  return project;
}
