import { Router } from "express";
import { body } from "express-validator";
import {
  createProjectController,
  getAllProjectsController,
  addUserToProjectController,
  getProjectByIdController,
  getProjectMembers
} from "../controllers/project.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authenticateUser,
  body("name").isString().withMessage("Name must be a string"),
  body("description").isString().withMessage("Description must be a string"),
  createProjectController
);

router.get("/all-projects", authenticateUser, getAllProjectsController);

router.put(
  "/add-users",
  authenticateUser,


  body("projectId").isString().withMessage("Project ID must be a string"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("At least one user ID must be provided")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("All user IDs must be strings"),

  addUserToProjectController
);

router.get('/get-project/:projectId', authenticateUser, getProjectByIdController);
router.get("/:projectId/members", authenticateUser, getProjectMembers);


export default router;
