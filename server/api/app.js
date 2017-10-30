import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';


import routes from '../routes/index';

const app = express();
// Set up the express app
// Log requests to the console.


app.use(logger('dev'));


// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

module.exports = app;
