import { useState } from "react";

const AuthForm = ({ type, onSubmit, footer, children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    
      <div className="p-6 max-w-md w-full bg-gray-900 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          {type === "login" ? "Login" : "Register"}
        </h2>
        <form onSubmit={(e) => onSubmit(e, email, password)}>
          <div className="mb-5">
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-white rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-5">
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-white rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 text-sm font-medium text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            {type === "login" ? "Login" : "Register"}
          </button>
        </form>
      </div>
    
  );
};

export default AuthForm;
