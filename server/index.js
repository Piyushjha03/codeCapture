import httpserver from 'http';
import axios from 'axios'
import app from './app.js';
const server= httpserver.createServer(app);

  
server.listen(8000, () => {
    console.log('Server is running on port 8000');
})