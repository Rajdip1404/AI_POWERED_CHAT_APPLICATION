import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";
import { useUserContext } from "../context/user.context";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error} = useAuthStore();
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, setUser);
      toast.success("Logged in successfully!");
      // Redirect to home page after successful login
      navigate("/");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white/35 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden px-10 py-8"
      >
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-gray-600 via-blue-600 to-cyan-600 text-transparent bg-clip-text p-2">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
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

          <motion.button
            className="mt-3 w-full py-3 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white 
                                    font-bold rounded-lg shadow-lg hover:from-cyan-600
                                    hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
                                     focus:ring-offset-gray-600 transition duration-200 border-none cursor-pointer text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
                          <Loader className=" animate-spin mx-auto" size={24} />
                        ) : (
                          "Login"
                        )}
          </motion.button>
          <div className="w-full h-[2px] bg-black/30 mt-5"></div>
          <div className="flex flex-col gap-2 items-center mt-5">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to={"/register"} className="text-blue-500 hover:underline">
                Create an Account
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Forgot your password?{" "}
              <Link
                to={"/forgot-password"}
                className="text-blue-500 hover:underline"
              >
                Click here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
