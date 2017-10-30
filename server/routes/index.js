import Recipe from '../controller/recipes';

export default (app) => {
 
  app.post('/api/recipes/:recipeId', Recipe.addRecipe);
  app.put('/api/recipes/:recipeId', Recipe.modifyRecipe);
  app.delete('/api/recipes/:recipeId', Recipe.deleteRecipe);
  app.get('/api/recipes', Recipe.getAllRecipes);
  app.post('/api/recipes/:recipeId/reviews', Recipe.postReview);
  app.get('/api/recipes?sort=upvotes&order=desc', Recipe.getSortedRecipe);
};
