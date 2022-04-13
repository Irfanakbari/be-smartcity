import http from 'http';
import app from './router/routes.js';


const server = http.createServer(app);


server.listen(3000, () => {
    console.log('Server is running on port 3000');
});