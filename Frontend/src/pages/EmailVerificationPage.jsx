import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/auth.store";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const { error, isLoading, verifyEmail } = useAuthStore();

  // ✅ Handle Input Change (Handles both typing & pasting)
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only numbers

    const newCode = [...code];

    if (value.length === 6) {
      // If user pastes a full OTP
      newCode.splice(0, 6, ...value.split("").slice(0, 6));
      setCode(newCode);
      inputRef.current[5].focus(); // Move focus to last digit
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRef.current[index + 1]?.focus(); // Move to next input 
      }
    }
  };

  // ✅ Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
    if (!/^[0-9]$/.test(e.key) && e.key !== "Backspace" && e.key !== "Tab") {
      e.preventDefault();
    }
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };

  // ✅ Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit", { cancelable: true }));
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white/25 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden px-7 py-12"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-gray-600 via-blue-600 to-cyan-600 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between px-12 pt-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                value={digit}
                maxLength="1" // ✅ Fixed maxLength
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold text-gray-800 focus:outline-none focus:border-blue-600"
              />
            ))}
          </div>

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

          <motion.button
            className="mt-5 w-full py-3 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white 
                      font-bold rounded-lg shadow-lg hover:from-cyan-600
                      hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2
                       focus:ring-offset-gray-600 transition duration-200 border-none cursor-pointer text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.includes("")} // ✅ Improved validation
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
