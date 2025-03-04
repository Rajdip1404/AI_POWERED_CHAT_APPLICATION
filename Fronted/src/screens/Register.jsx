import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

const Register = () => {
  const handleRegister = (e, email, password) => {
    e.preventDefault();
    console.log("Registering with:", email, password);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-950 p-4">
        <AuthForm type="register" onSubmit={handleRegister} />
        <p className="text-white text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-500">
            Login here
            </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
