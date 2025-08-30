import http from 'http'
import{ app }  from './app.js'
import { initializeSocket } from './socket.js';



const port = process.env.PORT || 4000;
console.log(port);
const server = http.createServer(app);

initializeSocket(server);

server.listen(port, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
        return;
    }
    console.log(`Server is running on port ${port}`);
});


