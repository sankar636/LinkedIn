import { Server } from "socket.io";

let io;

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling'],
        path: '/socket.io'
    });

    io.on('connection', (socket) => {
        console.log(`Client connected ${socket.id}`);
        

        socket.on("disconnect", () =>{
            console.log(`client disConnected: ${socket.id}`);
        })
    });

    
}



export { initializeSocket }