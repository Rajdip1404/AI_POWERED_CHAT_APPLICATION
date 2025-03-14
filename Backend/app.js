import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Update this with your frontend URL
    credentials: true, // Allow cookies and authentication headers
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/auth/users', userRoute);
app.use('/projects', projectRoute);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

export default app;