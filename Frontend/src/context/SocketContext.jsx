import React, { createContext, useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";


export const SocketContext = createContext();



const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    useEffect(() => {
        const newSocket = io(
            "https://linkedin-q5gk.onrender.com" ,
            // "http://localhost:4000", 
        {
            withCredentials:  true,
            transports: ['websocket', 'polling'],
            path: '/socket.io'
        })
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log(`Server connected on ID ${newSocket.id}`);
            newSocket.emit('join',{
                                
            })
        })
        return () => {
            newSocket.disconnect();
        }
       
    }, [])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}


export default SocketProvider