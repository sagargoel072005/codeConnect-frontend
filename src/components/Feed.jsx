import { BASE_URL } from "../utils/constants";
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
  },[]);

  if(!feed) return;

  if (feed && feed.length <= 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No New Users Available</h1>
          <p className="text-gray-500">Check back later to discover new users!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="flex flex-wrap justify-center gap-6">
        {feed.map((user, idx) => (
          <div key={idx} className="w-1/3 sm:w-1/4 lg:w-1/4 xl:w-1/4 p-4">
            <UserCard user={user} />
          </div>
        ))}
      </div>
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