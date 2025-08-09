import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";

export default function GitHubIntegration() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRepos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${BASE_URL}/auth/github/repos`, {
        withCredentials: true,
      });
      setRepos(res.data);
    } catch {
      setError("❌ Failed to load GitHub repositories.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Buttons container with adjusted gap */}
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={`${BASE_URL}/auth/github/login`}
          className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition-transform"
        >
          <FaGithub size={20} />
          Connect GitHub
        </a>

        <button
          onClick={fetchRepos}
          disabled={loading}
          className={`flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition ${
            loading && "opacity-70 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Loading...
            </>
          ) : (
            "Load My Repositories"
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-500 mt-4 text-center font-medium">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-lg p-5 transition transform hover:-translate-y-1"
          >
            <h3 className="text-lg font-semibold mb-2 truncate">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {repo.name}
              </a>
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {repo.description || "No description available"}
            </p>

            <div className="flex items-center gap-4 mt-4 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                <FaStar /> {repo.stargazers_count}
              </span>
              <span className="flex items-center gap-1">
                <FaCodeBranch /> {repo.forks_count}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {repo.language && (
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {repo.language}
                </span>
              )}
              {repo.private ? (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                  Private
                </span>
              ) : (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                  Public
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
