// EditProfile.jsx
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import AcademicAndCertificationsForm from "./AcademicAndCertificationsForm";

const EditProfile = ({ user }) => {
  // Basic info states
  const [emailId, setEmailId] = useState(user.emailId || "");
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [about, setAbout] = useState(user.about || "");
  const [gender, setGender] = useState(user.gender || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [age, setAge] = useState(user.age || 16);
  const [githubId, setGithubId] = useState(user.githubId || "");
  const [linkedIn, setLinkedIn] = useState(user.linkedIn || "");
  const [leetcodeId, setLeetcodeId] = useState(user.leetcodeId || "");

  // Academic + Certifications + Projects state - initialize empty or from user prop if available
  const [academicQualifications, setAcademicQualifications] = useState(
    user.academicQualifications || {
      tenth: { school: "", board: "", percentage: "" },
      twelfth: { school: "", board: "", percentage: "" },
      ug: { degree: "", branch: "", sgpa: "" },
      pg: { degree: "", branch: "", sgpa: "" },
    }
  );
  const [certifications, setCertifications] = useState(
    user.certifications && user.certifications.length > 0 ? user.certifications : [""]
  );
  const [projects, setProjects] = useState(
    user.projects && user.projects.length > 0 ? user.projects : [""]
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Unified saveProfile to send all data together
  const saveProfile = async () => {
    if (age < 16) {
      setError("Minimum age is 16");
      return;
    }
    try {
      setLoading(true);
      setError("");

      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          emailId,
          firstName,
          lastName,
          photoUrl,
          about,
          gender,
          skills,
          age: Number(age),
          githubId,
          linkedIn,
          leetcodeId,
          academicQualifications,
          certifications,
          projects,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/premium");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center pt-10 gap-x-12 max-w-[90vw] mx-auto">
        {/* Left: Basic Info */}
        <div
          className="card bg-gray-100 shadow-lg rounded-lg w-96 p-6 hide-scrollbar"
          style={{ height: "600px", overflowY: "auto" }}
        >
          <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-800 drop-shadow-md">
            Your Personal Details
          </h2>
          <div className="space-y-6">
            {/* First + Last Name */}
            <div className="flex gap-4">
              <label className="flex flex-col w-1/2">
                <span className="text-sm font-medium mb-1 text-gray-700">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
                />
              </label>
              <label className="flex flex-col w-1/2">
                <span className="text-sm font-medium mb-1 text-gray-700">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
                />
              </label>
            </div>

            {/* Photo URL + Age */}
            <div className="flex gap-4">
              <label className="flex flex-col w-3/4">
                <span className="text-sm font-medium mb-1 text-gray-700">Photo URL</span>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
                />
              </label>
              <label className="flex flex-col w-1/4">
                <span className="text-sm font-medium mb-1 text-gray-700">Age</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className={`input input-bordered w-full px-4 py-2 rounded-md border ${
                    age < 16 ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 ${
                    age < 16 ? "focus:ring-red-500" : "focus:ring-indigo-600"
                  } placeholder-gray-400 transition`}
                  min={16}
                  max={120}
                />
                {age < 16 && (
                  <p className="text-xs text-red-600 mt-1">Minimum age is 16</p>
                )}
              </label>
            </div>

            {/* Gender Select */}
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-gray-700">Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </label>

            {/* About */}
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-gray-700">About</span>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Write a short bio..."
                rows={3}
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none placeholder-gray-400 transition"
              />
            </label>

            {/* Skills */}
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-gray-700">Skills</span>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. JavaScript, React, Node.js"
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
              />
            </label>

            {/* Email */}
            <label className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-gray-700">Email ID</span>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="you@example.com"
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition"
              />
            </label>

            {/* Social Inputs */}
            <input
              type="text"
              placeholder="GitHub ID"
              value={githubId}
              onChange={(e) => setGithubId(e.target.value)}
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition mt-2"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition mt-2"
            />
            <input
              type="text"
              placeholder="Leetcode ID"
              value={leetcodeId}
              onChange={(e) => setLeetcodeId(e.target.value)}
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder-gray-400 transition mt-2"
            />
          </div>
        </div>

        {/* Right: Academic + Certifications + Projects */}
        <AcademicAndCertificationsForm
          academicQualifications={academicQualifications}
          setAcademicQualifications={setAcademicQualifications}
          certifications={certifications}
          setCertifications={setCertifications}
          projects={projects}
          setProjects={setProjects}
          containerStyle={{
            height: "600px",
            overflowY: "auto",
            width: "28rem",
          }}
        />
      </div>

      {/* Error and Save button */}
      <div className="max-w-3xl mx-auto mt-8 flex items-center justify-between px-6">
        {error && (
          <p className="text-red-600 font-semibold select-none">{error}</p>
        )}
        <button
          onClick={saveProfile}
          disabled={loading}
          className={`btn btn-primary px-8 py-3 font-bold rounded-md text-white transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-indigo-700 text-white px-6 py-3 rounded-md shadow-lg select-none animate-fade-in">
          Profile updated successfully!
        </div>
      )}
    </>
  );
};

export default EditProfile;
