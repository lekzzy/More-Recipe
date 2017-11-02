import express from 'express';
import RecipeController from '../../controller/recipesController';
import ReviewController from '../../controller/reviewController';

const user = express.Router();
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
