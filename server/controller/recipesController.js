import models from '../models';
import SearchRecipeController from './searchRecipeController';

const { Recipes } = models;
const Search = SearchRecipeController;

/**
 * Class Definition for the Recipe Object
 *
 * @export
 * @class RecipeContoller
 */
export default class RecipeController {
  /**
   * Create a new recipe record
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} - Class instance
   * @memberof Recipe
   */
  static createRecipe(req, res) {
    return Recipes
      .create({
        name: req.body.name,
        ingredients: req.body.ingredients,
        procedure: req.body.procedure,
        userId: req.body.userId
      })
      .then((createdRecipe) => {
        res.status(201).json({
          success: true,
          message: 'New Recipe created',
          recipe: createdRecipe
        });
      })
      .catch(error => res.status(503).json({
        status: false,
        message: `Error Creating Recipe ${error.message}`,
      }));
  }

  /**
   * Modify recipe record
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
  * */
  static modifyRecipe(req, res) {
    const recipeId = req.params.recipeId || 0;
    return Recipes
      .findById(recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        if (+recipeFound.userId !== +req.body.userId) {
          return res.status(403).json({
            success: false,
            message: 'You cannot modify this recipe'
          });
        }

        Recipes.update({
          name: req.body.name,
          ingredients: req.body.ingredients,
          procedure: req.body.procedure
        }, {
          where: {
            id: recipeId
          },
          returning: true
        })
          .then(result => res.status(201).json({
            success: true,
            message: `recipe with id: ${recipeId} updated successfully`,
            data: result[1]
          }));
      })
      .catch(error => res.status(503).json({
        success: false,
        message: `Error Modifying Recipe ${error.message}`
      }));
  }

  /**
   * Delete Recipe record
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  static deleteRecipe(req, res) {
    return Recipes.findById(req.params.recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          return res
            .status(404)
            .json({
              success: false,
              message: `No matching recipe with id: ${req.params.recipeId}`
            });
        }

        if (+recipeFound.userId !== +req.body.userId) {
          return res
            .status(403)
            .json({
              success: false,
              message: 'You cannot delete this recipe'
            });
        }

        Recipes.destroy({
          where: {
            id: req.params.recipeId
          }
        }).then(() => res.status(205)
          .json({
            success: true,
            message: `recipe with recipe id: ${req.params.recipeId} deleted successfully`
          }));
        // .end());
      })
      .catch(error =>
        res.status(503).json({
          success: true,
          message: `Error Deleting Recipe ${error.message}`
        }));
  }

  /**
   * Fetch a recipe record
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  static getRecipe(req, res) {
    return Recipes
      .findOne({
        where: { id: req.params.recipeId },
        include: [
          { model: models.Users, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${req.params.recipeId}`
          });
        }

        return recipeFound.increment('viewCount');
      })
      .then(recipeFound => recipeFound.reload())
      .then(recipeLoaded => res.status(201).json({
        success: true,
        data: recipeLoaded
      }))
      .catch(error => res.status(503).json({
        success: false,
        message: `Unable to fetch recipes ${error.message}`
      }));
  }

  /**
   * Fetch a list user owned recipes
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  static getUserRecipes(req, res) {
    return Recipes
      .findAll({
        where: { id: req.userId },
        include: [
          { model: models.Users, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res
            .status(404)
            .json({
              success: true,
              message: 'No User Stored Recipes found'
            });
        }
        res.status(201).json({
          success: true,
          message: 'User Recipe found',
          recipes: foundRecipes
        });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Unable to get user recipes${error.message}`
        }));
  }

  /**
   * Fetch all recipes in the database
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Recipe
   */
  static getAllRecipes(req, res) {
    if (req.query.sort === 'upvotes' && req.query.order === 'descending') {
      Search.sortMostUpvotes(req, res);
    } else if (req.query.ingredients) {
      Search.searchByIngredients(req, res);
    } else if (req.query.search) {
      Search.searchAll(req, res);
    } else {
      return Recipes
        .findAll({
          include: [
            { model: models.User, attributes: ['name', 'updatedAt'] }
          ]
        })
        .then((foundRecipes) => {
          if (!foundRecipes) {
            return res.status(404).json({
              success: true,
              message: 'No Stored Recipes found'
            });
          }

          return res.status(201).json({
            success: true,
            data: foundRecipes
          });
        })
        .catch(() => res.status(503).json({
          success: false,
          message: 'Unable to fetch recipes'
        }));
    }
  }
}

