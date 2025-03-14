import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import {
  addUsersToProject,
  createProject,
  getAllProjectsByUserId,
  getProjectById,
} from "../services/project.service.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, description } = req.body;
    const loggedInUser = await User.findOne({ email: req.user.email });
    const userId = loggedInUser._id;
    const project = await createProject({ name, description, userId });
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProjectsController = async (req, res) => {
  try {
    const loggedInUser = await User.findOne({
      email: req.user.email,
    });
    const allProjectsByUser = await getAllProjectsByUserId({
      userId: loggedInUser._id,
    });
    res.json({
      message: "All projects retrieved successfully",
      allProjectsByUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


export const addUserToProjectController = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body; // `users` should be an array of user IDs

    if (!projectId || !users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // 🔹 Find the logged-in user
    const loggedInUser = await User.findOne({ email: req.user.email });
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 Call the service function
    const project = await addUsersToProject({
      projectId,
      users,
      userId: loggedInUser._id, // Pass the logged-in user's ID for authorization
    });

    res
      .status(200)
      .json({ message: "Users added to project successfully", project });
  } catch (error) {
    console.error("Error adding users to project:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await getProjectById({ projectId });
    return res.status(200).json({ message: "Project retrieved successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid Project ID" });
    }

    // 🔹 Fetch project & populate users field
    const project = await Project.findById(projectId).populate(
      "users",
      "name email"
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ members: project.users });
  } catch (error) {
    console.error("Error fetching project members:", error);
    res.status(500).json({ message: error.message });
  }
};

