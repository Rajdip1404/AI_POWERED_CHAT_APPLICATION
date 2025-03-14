import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Lock, Mail, User, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/auth.store.js";
import toast from "react-hot-toast";
import { useUserContext } from "../context/user.context.jsx";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const {setUser} = useUserContext();

  // 🔹 Clear error when user starts typing
  useEffect(() => {
    if (name || email || password) {
      clearError();
    }
  }, [name, email, password, clearError]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("All fields are required!"); // ✅ Show toast instead of formError
      return;
    }

    try {
      clearError(); // 🔹 Reset error before submitting
      await signup(email, password, name, setUser);
      navigate("/verify-email"); // ✅ Redirect after successful signup
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white/35 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden px-7 py-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-600 via-blue-600 to-cyan-600 text-transparent bg-clip-text">
          Create Account
        </h2>
        <div className="p-4">
          <form onSubmit={handleSignUp}>
            <Input
              icon={User}
              type="text"
              placeholder="Fullname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <PasswordStrengthMeter password={password} />

            <motion.button
              className="mt-5 w-full py-3 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-cyan-600
						hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
						 focus:ring-offset-gray-600 transition duration-200 border-none cursor-pointer text-xl disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>
          </form>
        </div>

        <div className="bg-black/50 h-[2px] mt-3 px-3 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-500 py-3">
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
