import express from 'express';

import UserController from '../../controller/userController';

// import Auth from '../../middleware/authentication';

const user = express.Router();

user.post('/signup', UserController.signUp);
user.post('/signin', UserController.signIn);

// user.use('/signin', Auth.verify);

export default user;
