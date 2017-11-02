import * as http from 'http';
import app from '../api/app'; // The express app in the api folder created


const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
