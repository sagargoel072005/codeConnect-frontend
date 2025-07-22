import { useDispatch, useSelector } from 'react-redux';
import { addFeed, removeFeed } from "../utils/feedSlice"; // ✅ CHANGED: Import removeFeed
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from '../utils/constants';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ CHANGED: State to manage animations
  const [animation, setAnimation] = useState({ id: null, type: '' });

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
    // Only fetch feed if it's not already populated
     if (!feed) {
      getFeed();
    }
  }, [feed]); // ✅ CHANGED: Dependency array

  // ✅ CHANGED: Handle actions from the card
  const handleAction = (userId, status) => {
    // Trigger animation
    setAnimation({ id: userId, type: status === 'ignored' ? 'swipe-left' : 'swipe-right' });

    // After animation, dispatch the action
    setTimeout(() => {
      dispatch(removeFeed(userId));
      setAnimation({ id: null, type: '' }); // Reset animation
    }, 300); // Animation duration
  };


  if (!feed) return <div className="text-center mt-20">Loading feed...</div>; // Improved loading state

  const filteredFeed = (feed || []).filter((user) => {
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gray-50 overflow-hidden px-4 py-6">
      {/* ✅ CHANGED: Reduced margin-bottom from mb-6 to mb-4 */}
      <div className="w-full max-w-md mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFeed.length === 0 ? (
        <div className="text-gray-500 text-center mt-20">
          No users found for &quot;{searchTerm}&quot;
        </div>
      ) : (
        // ✅ CHANGED: Main card container
        <div className="relative flex justify-center items-center w-full flex-1 h-[550px]">
          {/* ✅ CHANGED: Reverse map to stack correctly and slice for performance */}
          {filteredFeed.slice(0, 5).reverse().map((user, idx) => {
            const isTopCard = idx === filteredFeed.slice(0, 5).length - 1;
            let cardAnimationClass = '';
            if (isTopCard && animation.id === user._id) {
              cardAnimationClass = animation.type;
            }

            return (
              <div
                key={user._id}
                className={`absolute transition-all duration-300 ease-in-out ${cardAnimationClass}`}
                // ✅ CHANGED: Dynamic styles for stacking effect
                style={{
                     zIndex: idx,
                  transform: isTopCard ? 'none' : `translateY(${idx * -10}px) scale(${1 - (filteredFeed.length - idx) * 0.05})`,
                  opacity: isTopCard ? 1 : (1 - (filteredFeed.length - idx) * 0.1)
                }}
              >
                <UserCard
                  user={user}
                  // ✅ CHANGED: Pass action handler to card
                  onAction={(status) => handleAction(user._id, status)}
                />
              </div>
            );
          })}
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