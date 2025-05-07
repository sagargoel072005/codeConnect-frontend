import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Heart, X, UserCircle } from 'lucide-react';
import { addRequest, removeRequest } from "../utils/requestSlice";

const Request = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const request = axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, {
        withCredentials: true,}
      );
    dispatch(removeRequest());
    } catch (err) {
      console.error(err);
    }
  } 

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      })
      console.log("Received requests:", res?.data?.data);
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return;

  if (requests.length === 0) return <h1 className="m-8 p-8 flex justify-center">No Request found</h1>

  return (
    <div className="my-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Requests Received</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, about } = request.fromUserId;
          console.log("Full request object:", request);
          return (
            <div
              key={_id}
              className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-6 text-center"
            >
              <img
                alt="photo"
                src={photoUrl}
                className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border"
              />
              <h2 className="text-xl font-semibold mb-2">{firstName} {lastName}</h2>
              <p className="text-gray-600 text-sm">{about}</p>
              <div className="flex justify-between p-6">
                <button className="btn btn-outline btn-error flex items-center gap-1" 
                onClick={() => reviewRequest("rejected", request._id)}>
                  <X size={16} /> Ignore
                </button>
                <button className="btn btn-primary flex items-center gap-1"
                onClick={() => reviewRequest("accepted", request._id)} >
                 
                  <Heart size={16} /> Interested
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Request;
