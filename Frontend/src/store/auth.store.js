import { create } from "zustand";
import axios from "axios";
import { useUserContext } from "../context/user.context";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/auth/users";
axios.defaults.withCredentials = true; 

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, name, setUser) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/register`, {
        email,
        password,
        name,
      });

      // ✅ Store token & update global user state
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user); // ✅ Update user context

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success("Account created successfully! Please verify your email."); // ✅ Toast for success
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage); // ✅ Toast for error
      throw error;
    }
  },

  clearError: () => set({ error: null }), // 🔹 Function to reset error state

  login: async (email, password, setUser) => {
    // ✅ Accept setUser as a parameter
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login Response:", response.data); // ✅ Debug response
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user); // ✅ Update context

      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      console.log("Login Error:", error.response?.data); // ✅ Debug error
      set({
        isLoading: false,
        error: error.response?.data?.message || "Something went wrong",
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null }); // ✅ Set loading to true BEFORE request

    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code,
      });

      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null, // ✅ Ensure error is cleared on success
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Something went wrong",
      });
      throw error; // ✅ Ensure the error is thrown for proper handling
    }
  },

  checkAuth: async (setUser) => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      setUser(response.data.user);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.log("User not authenticated", error);
      localStorage.removeItem("token"); // ✅ Remove token if invalid
      setUser(null);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },

  logout: async (setUser) => {
    try {
      await axios.post(`${API_URL}/logout`); // ✅ Optional: Call backend logout endpoint

      localStorage.removeItem("token"); // ✅ Remove stored token
      setUser(null); // ✅ Clear user from context

      set({
        user: null,
        isAuthenticated: false,
      });

      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Try again.");
    }
  },
}));


