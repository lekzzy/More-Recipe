import express from 'express';
import RecipeController from '../../controller/recipesController';
import ReviewController from '../../controller/reviewController';
import Authentication from '../../middleware/authentication';

const user = express.Router();

user.use('*', Authentication.verify);

user.route('/')
  .post(RecipeController.createRecipe)
  .get(RecipeController.getAllRecipes);

user.route('/:recipeId')
  .get(RecipeController.getRecipe)
  .put(RecipeController.modifyRecipe)
  .delete(RecipeController.deleteRecipe);

user.route('/:recipeId/reviews')
  .post(ReviewController.postReview)
  .get(ReviewController.getReviews);

export default user;
