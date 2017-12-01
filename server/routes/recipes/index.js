import express from 'express';
import RecipeController from '../../controller/recipesController';
import ReviewController from '../../controller/reviewController';
import VoteController from '../../controller/voteController';
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
  .get(ReviewController.getReviews)
  .delete(ReviewController.deleteReviews);

/* user.route('/:recipeId/upvotes')
  .post(VoteController.upvoteRecipe)
  .get(VoteController.getUserUpvotes);

user.route('/:recipeId/downvotes')
  .post(VoteController.downvoteRecipe)
  .get(VoteController.getUserDownvotes); */

export default user;
