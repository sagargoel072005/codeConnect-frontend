import { useState } from "react"
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {

  const [emailId, setEmailId] = useState("sagarji234@example.com");
  const [password, setPassword] = useState("Secure@123");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL+"/login", {
        emailId,
        password,
   },{withCredentials:true});
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err?.response?.data || "something went wrong");
    }
  };

  return (
    <div className="flex justify-center pt-10">
      <div className="card bg-gray-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div className="flex flex-col space-y-4">
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
              onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Login