import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const getFeed = async () => {
    try {
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response?.data?.data || []));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  // ✅ Safe filter: fallback to empty array
  const filteredFeed = (feed || []).filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="relative flex flex-col items-center justify-start min-h-screen bg-gray-100 overflow-hidden px-4 pt-8">
      {/* ✅ Search bar */}
      <div className="w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFeed.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">
          No users found for &quot;{searchTerm}&quot;
        </div>
      ) : (
        <div className="relative flex justify-center items-center w-full flex-1">
          {filteredFeed.map((user, idx) => (
            <div
              key={idx}
              className="absolute w-[300px] sm:w-[350px] md:w-[400px] h-[400px] sm:h-[450px] md:h-[500px]"
              style={{ zIndex: filteredFeed.length - idx }}
            >
              <UserCard user={user} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;

/*  
  return (
 
    <div className="flex flex-col items-center gap-4 my-10">
      <UserCard user={feed[0]} />
    </div>
  ); */

  /**
   * import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";
import axios from "axios";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const response = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(response?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No New Users Available</h1>
          <p className="text-gray-500">Refresh the page or check back later to discover new users!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-100 overflow-hidden">
      {feed.map((user, idx) => (
        <div
          key={idx}
          className="absolute w-[300px] sm:w-[350px] md:w-[400px] h-[400px] sm:h-[450px] md:h-[500px]"
          style={{
            zIndex: feed.length - idx,  // higher zIndex on top
          }}
        >
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};

export default Feed;

   */