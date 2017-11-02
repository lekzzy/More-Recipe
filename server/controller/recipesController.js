import models from '../models';
import Search from './searchRecipeController';

const { Recipe } = models;

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
    return Recipe
      .create(req.body)
      .then(() => res.status(201).json({
        success: true,
      }))
      .catch(() => res.status(503).json({
        success: false,
        message: 'Error Creating Recipe'
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
    const { userId } = req.userId;
    const { recipeId } = req.params.recipeId || 0;
    const { recipeName } = req.body.recipeName;
    const { ingredients } = req.body.ingredients;
    const { procedure } = req.body.procedure;

    return Recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        if (+recipeFound.userId !== +userId) {
          return res.status(403).json({
            success: false,
            message: 'You cannot modify this recipe'
          });
        }

        Recipe.update({
          recipeName,
          ingredients,
          procedure
        }, {
          where: {
            id: recipeId
          },
          returning: true
        })
          .then(result => res.status(201).json({
            success: true,
            data: result[1]
          }));
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Error Modifying Recipe'
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
    const { recipeId } = req.params.recipeId;
    const { userId } = req.userId;

    return Recipe
      .findById(recipeId)
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        if (+recipeFound.userId !== +userId) {
          return res.status(403).json({
            success: false,
            message: 'You cannot delete this recipe'
          });
        }

        Recipe.destroy({
          where: {
            id: recipeId
          },
        })
          .then(() => res.status(204).end());
      })
      .catch(() => res.status(503).json({
        success: true,
        message: 'Error Deleting Recipe'
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
    const { recipeId } = req.params.recipeId;
    return Recipe
      .findOne({
        where: { id: recipeId },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((recipeFound) => {
        if (!recipeFound) {
          return res.status(404).json({
            success: false,
            message: `No matching recipe with id: ${recipeId}`
          });
        }

        return recipeFound.increment('viewCount');
      })
      .then(recipeFound => recipeFound.reload())
      .then(recipeLoaded => res.status(201).json({
        success: true,
        data: recipeLoaded
      }))
      .catch(() => res.status(503).json({
        success: false,
        message: 'Unable to fetch recipes'
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
    const { userId } = req.userId;

    return Recipe
      .findAll({
        where: { userId }
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No User Stored Recipes found',
          });
        }

        return res.status(201).json({
          success: true,
          data: foundRecipes
        });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Unable to get user recipes'
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
    const newSearch = new Search.default();

    if (req.query.sort === 'upvotes' && req.query.order === 'descending') {
      newSearch.sortMostUpvotes(req, res);
    } else if (req.query.ingredients) {
      newSearch.searchByIngredients(req, res);
    } else if (req.query.search) {
      newSearch.searchAll(req, res);
    } else {
      return Recipe
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

