import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import routes from '../routes/';

const app = express();
// Set up the express app
// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', routes);
app.get('/', (req, res) => {
  res.status(201).json({
    title: 'More-Recipes',
    message: 'Please navigate this API via \'/api/v1/\' url prefix'
  });
});


module.exports = app;
