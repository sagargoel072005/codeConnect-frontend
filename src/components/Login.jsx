import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { motion } from "framer-motion";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      }, { withCredentials: true });
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(BASE_URL + "/signup", {
        emailId,
        password,
        firstName,
        lastName,
      }, { withCredentials: true });
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-[95%] md:w-[400px] bg-white p-6 shadow-2xl rounded-2xl"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          {isLoginForm ? "Welcome Back!" : "Create an Account"}
        </h2>

        <div className="space-y-4">
          {!isLoginForm && (
            <>
              <div className="relative">
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="First Name"
                  className="input input-bordered w-full pl-10"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="relative">
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input input-bordered w-full pl-10"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full pl-10"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          <div className="relative">
            <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            className="btn btn-primary w-full mt-2 hover:scale-105 transition-transform duration-200"
            onClick={isLoginForm ? handleLogin : handleSignup}
          >
            {isLoginForm ? "Login" : "Signup"}
          </button>

          <p
            className="text-center mt-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition duration-150 ease-in-out"
            onClick={() => setIsLoginForm((val) => !val)}
          >
            {isLoginForm
              ? "Don't have an account? Sign up here."
              : "Already have an account? Log in here."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
