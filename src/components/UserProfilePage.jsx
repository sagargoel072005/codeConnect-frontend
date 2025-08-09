import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { ArrowLeft } from "lucide-react";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const getMediaUrl = (mediaUrl) => {
    if (!mediaUrl) return "";
    if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
      return mediaUrl;
    }
    return `${BASE_URL}${mediaUrl}`;
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500 text-lg font-semibold">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="text-center mt-20 text-red-500 text-lg font-semibold">
        User not found
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <img
          src={
            user.photoUrl ||
            `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random&size=128`
          }
          alt={`${user.firstName} ${user.lastName}`}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
        />
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-blue-600 font-medium mb-3">
            @{user.firstName.toLowerCase() + user.lastName.toLowerCase()}
          </p>
          <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto sm:mx-0">
            {user.about || "This user hasn't added a bio yet."}
          </p>
        </div>
      </div>

      {/* Posts Section */}
      <section className="mt-12">
        <h2 className="text-3xl font-semibold mb-8 border-b border-gray-300 pb-3">
          Posts
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-20 text-lg font-medium">
            No posts yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col"
              >
                {post.mediaUrl && (
                  <img
                    src={getMediaUrl(post.mediaUrl)}
                    alt="Post media"
                    className="rounded-t-lg object-cover w-full h-48"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  {post.caption && (
                    <p className="text-gray-800 text-base mb-2 flex-grow whitespace-pre-wrap">
                      {post.caption}
                    </p>
                  )}
                  <time className="text-gray-400 text-sm mt-auto">
                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link
        to="/connections"
        className="inline-flex items-center mt-14 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Connections
      </Link>
    </div>
  );
};

export default UserProfilePage;
