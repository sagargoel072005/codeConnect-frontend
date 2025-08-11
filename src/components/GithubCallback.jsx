import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function GithubCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      axios.get(`/api/auth/github/callback?code=${code}`, { withCredentials: true })
        .then(() => {
          navigate("/profile?github=connected");
        })
        .catch(() => {
          navigate("/error");
        });
    }
  }, [navigate]);

  return <p>Connecting GitHub...</p>;
}
