import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'

const Connections = () => {
    const connections= useSelector((store)=>store.connections);
    const dispatch = useDispatch();
    const fetchConnections = async () => {
        try {
            const res = axios.get(BASE_URL + "/user/connections", {
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

if(connections.length === 0) return <h1>No Connection found</h1>

    return (
        <div className='flex justify-center my-10'>
            <h1 className='text-bold text-2xl'>Connections</h1>
            {connections.map}
        </div>
    )
}

export default Connections;