import express from 'express';

import UserController from '../../controller/userController';

import Auth from '../../middleware/authentication';

const user = express.Router();

user.route('/signup')
  .post(UserController.signUp);

user.route('/signin')
  .post(UserController.signIn);

user.use('/signin', Auth.verify);

export default user;
