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
    if (feed && feed.length > 0) return;
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
  return (
    <div className="flex flex-col items-center gap-4 my-10">
      {feed && feed.map((user, idx) => (
        <UserCard key={idx} user={user} />
      ))}
    </div>
  );
  
};

export default Feed;