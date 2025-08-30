import React, { createContext, useEffect, useContext, useState } from "react";
import { io } from "socket.io-client";

import { AuthDataContext } from "./AuthContext";

export const SocketContext = createContext();



const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { serverUrl } = useContext(AuthDataContext);
    useEffect(() => {
        if(!serverUrl) return;
        const socket = io("http://localhost:4000", {
            withCredentials:  true,
            transports: ['websocket', 'polling'],
            path: '/socket.io'
        })
        setSocket(socket);

        socket.on('connect', () => {
            console.log(`Server connected on ID ${socket.id}`);
            socket.emit('join',{
                                
            })
        })
        return () => {
            socket.disconnect();
        }
       
    }, [serverUrl])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}


export default SocketProvider