import express from 'express';

import UserController from '../../controller/userController';
import RecipeController from '../../controller/recipesController';
import Authentication from '../../middleware/authentication';
import FavoriteController from '../../controller/favoriteController';

const user = express.Router();

user.post('/signup', UserController.signUp);
user.post('/signin', UserController.signIn);

user.use('*', Authentication.verify);
user.get('/myRecipes', RecipeController.getUserRecipes);

user
  .route('/:userId/recipes/:recipeId')
  .post(FavoriteController.addToFavorite)
  .delete(FavoriteController.removeFromFavorites);

user.get('/:userId/recipes', FavoriteController.getFavRecipes);

export default user;
