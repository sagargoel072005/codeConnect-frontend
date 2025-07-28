import { useState } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {

  const [emailId, setEmailId] = useState("sagarji234@example.com");
  const [password, setPassword] = useState("Secure@123");
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
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "something went wrong");
    }
  };

  const handleSignup = async () => {
    try{
      const res = await axios.post(BASE_URL + "/signup", {
        emailId,
        password,
        firstName, 
        lastName,
      }, { withCredentials: true });
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    }
      catch(err){
        setError(err?.response?.data || "something went wrong");
      }
  }

  return (
    <div className="flex justify-center pt-10">
      <div className="card bg-gray-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Signup"}
          </h2>
          <div className="flex flex-col space-y-4">

            {!isLoginForm && <>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>First Name</span>
                </div>
                <input type='text'
                  value={firstName}
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setFirstName(e.target.value)} />
              </label>

              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Last Name</span>
                </div>
                <input type='text'
                  value={lastName}
                  className='input input-bordered w-full max-w-xs'
                  onChange={(e) => setLastName(e.target.value)} />
              </label>
            </>
            }


            <label className='form-control w-full max-w-xs '>
              <div className='label'>
                <span className='label-text'>Email ID</span>
              </div>
              <input type='email'
                value={emailId}
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>

            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Password</span>
              </div>
              <input type='password'
                value={password}
                className='input input-bordered w-full max-w-xs'
                onChange={(e) => setPassword(e.target.value)} />
            </label>

          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignup}> {isLoginForm ? "Login" : "Signup"}</button>
          </div>

          <p
  className=" m-auto mt-1 text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition duration-200 ease-in-out hover:scale-105"
  onClick={() => setIsLoginForm(value => !value)}
>
  {isLoginForm
    ? "Don't have an account? Sign up here."
    : "Already have an account? Log in here."}
</p>

        </div>
      </div>
    </div>

  )
}

export default Login;