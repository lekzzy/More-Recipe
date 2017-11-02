import http from 'http';
import app from '../api/app';
import models from '../models'; // The express app in the api folder created


const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);

const server = http.createServer(app);
models.sequelize.sync().then(() => {
  server.listen(port);
});
