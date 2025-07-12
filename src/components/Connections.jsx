import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'
import { Link } from 'react-router-dom'

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();
    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(res?.data?.data));
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if (connections.length === 0) return <h1>No Connection found</h1>

    return (
        <div className="my-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Connections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, about } = connection;
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
               <Link to={"/chat/"+ _id}> <button className='btn btn-primary'> Chat </button> </Link>
              </div>
            );
          })}
        </div>
      </div>
      
    )
}

export default Connections;