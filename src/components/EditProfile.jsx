import { useState } from 'react';
import Ucard from './Ucard';
import axios from 'axios';
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const EditProfile = ({ user }) => {
  const [emailId, setEmailId] = useState(user.emailId || "");
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [gender, setGender] = useState(user.gender || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [age, setAge] = useState(user.age || 16);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
 const navigate = useNavigate();

  const saveProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(
        BASE_URL + "/profile/edit", {
        emailId,
        firstName,
        lastName,
        photoUrl,
        about,
        gender,
        skills,
        age: Number(age),
      }, {
        withCredentials: true
      }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      const i = setTimeout(() => {
          setShowToast(false);
        navigate('/premium'); 
 }, 2000);
    
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <div className="flex justify-center pt-10 gap-x-10">
      <div className="card bg-gray-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Edit Profile</h2>
          <div className="flex flex-col space-y-4">
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                value={firstName}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                type="text"
                value={lastName}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Photo URL</span>
              </div>
              <input
                type="text"
                value={photoUrl}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Age</span>
              </div>
              <input
                type="number"
                value={age}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setAge(Number(e.target.value))}
              />
              {age < 16 && (
                <p className="text-red-500 text-sm mt-1">Age below 16 is not allowed</p>
              )}
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <select
                value={gender}
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">male</option>
                <option value="female">female</option>
                <option value="others">others</option>
              </select>
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <input
                type="text"
                value={about}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Skills</span>
              </div>
              <input
                type="text"
                value={skills}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setSkills(e.target.value)}
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email ID</span>
              </div>
              <input
                type="email"
                value={emailId}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </label>
          </div>
          <p className='text-red-500'>{error}</p>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" disabled={loading} onClick={saveProfile}>  {loading ? "Saving..." : "Save Profile"}</button>
          </div>
        </div>
      </div>

      <Ucard
        user={{
          emailId,
          firstName,
          lastName,
          photoUrl,
          about,
          gender,
          skills,
          age,
        }}
      />
    </div>
    {showToast && (
      <div className="toast toast-top toast-center">
  <div className="alert alert-success">
    <span>Profile updated successfully. Redirecting...</span>
  </div>
</div>
    )}
</>
  );
};

export default EditProfile;
