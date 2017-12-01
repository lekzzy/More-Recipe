import models from '../models';

const { Favorites } = models;

/**
 * Class Definition for the Favorite Object
 *
 * @export
 * @class Favorite
 */
export default class FavoriteController {
  /**
   * Add a recipe to user favorite
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  static addToFavorite(req, res) {
    return Favorites
      .findOrCreate({
        where: {
          $and: [
            { userId: req.params.userId },
            { recipeId: req.params.recipeId }
          ]
        }
      })
      .spread((addedRecipe, created) => {
        if (created) {
          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${req.params.recipeId} added to Favorites!`
          });
        }

        return res.status(201).json({
          success: false,
          message: `Recipe with id: ${req.params.recipeId} Already added to Favorite!`
        });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Error Adding Recipe to Favorites ${error.message}`
        }));
  }

  /**
   * Remove a recipe from user favorites
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  static removeFromFavorites(req, res) {
    return Favorites
      .destroy({
        where: {
          $and: [{
            userId: req.params.userId
          }, { recipeId: req.params.recipeId }]
        }
      })
      .then(() => {
        res.status(204)
          .json({
            success: true,
            message: 'Recipe removed from Favorites successfully'
          }).end();
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Error Removing Recipe from Favorites ${error.message}`
        }));
  }

  /**
   * Get a list of user's favorite recipes
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Favorite
   */
  static getFavRecipes(req, res) {
    return Favorites
      .findAll({
        where: {
          userId: req.params.userId
        },
        include: [
          { model: models.Recipes },
          { model: models.Users, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(201).json({
            success: true,
            message: 'No Stored Favorite Recipes found'
          });
        }

        return res.status(201).json({
          success: true,
          foundRecipes
        });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Unable to fetch favorite recipes ${error.message}`
        }));
  }
}
