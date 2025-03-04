import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

const Login = () => {
  const handleLogin = (e, email, password) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 p-4">
        <AuthForm type="login" onSubmit={handleLogin} />
        <p className="text-white text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-500">
            Create one
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
