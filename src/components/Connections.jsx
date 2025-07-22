import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';
import { MessageSquare, Video, Users, Compass } from 'lucide-react';

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
    };

    useEffect(() => {
        fetchConnections();
    }, []);

    // Loading state or initial render
    if (!connections) return null; // Or a loading spinner

    // --- "No Connections" Card (White & Blue Theme) ---
    if (connections.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
                <div className="text-center bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full">
                    <Users size={60} className="mx-auto text-blue-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">No Connections Yet</h1>
                    <p className="text-gray-500 mb-6">
                        It looks a bit empty here. Start exploring to find and connect with other developers!
                    </p>
                    <Link to="/">
                        <button className='flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300'>
                            <Compass size={20} />
                            Find Developers
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // --- Connections Grid (White & Blue Theme) ---
    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">Your Connections</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {connections.map((connection) => {
                    const { _id, firstName, lastName, photoUrl, about } = connection;
                    return (
                        <div
                            key={_id}
                            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col text-center border border-gray-200"
                        >
                            <img
                                alt={`${firstName} ${lastName}`}
                                src={photoUrl || 'https://via.placeholder.com/300?text=No+Image'}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-xl font-semibold text-gray-800 mb-1">{firstName} {lastName}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                                    {about || 'No bio available.'}
                                </p>
                                <div className="flex justify-center gap-3 mt-auto">
                                    {/* Secondary Button */}
                                    <Link to={"/chat/" + _id} className="flex-1">
                                        <button className='w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-lg transition duration-200'>
                                            <MessageSquare size={16} /> Chat
                                        </button>
                                    </Link>
                                    {/* Primary Button */}
                                    <Link to={"/video-login/"} className="flex-1">
                                        <button className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-200'>
                                            <Video size={16} /> Video
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Connections;