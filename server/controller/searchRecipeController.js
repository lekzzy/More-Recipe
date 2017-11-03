import models from '../models';

const Recipe = models;
const User = models;

/**
 * Class Definition for the Search Recipe Object
 *
 * @export
 * @classSearchRecipeController
 */
export default class SearchRecipeController {
  /**
     * Fetch list of recipes ordered (descending) by number of upvotes
     *@static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @returns {object} Class instance
     * @memberof SearchRecipeController
     */
  static sortMostUpvotes(req, res) {
    return Recipe
      .findAll({
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ],
        order: [
          ['upvotes', 'DESC']
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'No Stored Recipes found',
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

  /**
     * SearchController for recipe by Recipe name, Ingredients or Name of User
     *@static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @returns {object} Class instance
     * @memberof SearchRecipeController
     */
  static searchAll(req, res) {
    let results;
    const searchTerm = req.query.search;

    return Recipe
      .findAll({
        where: {
          $or: [
            {
              name: {
                $iLike: `%${searchTerm}%`
              }
            },
            {
              ingredients: {
                $iLike: `%${searchTerm}%`
              }
            }
          ]
        },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        results = foundRecipes.slice(0);
      })
      .then(() => {
        User
          .findAll({
            attributes: ['name'],
            where: {
              $or: [
                {
                  name: {
                    $iLike: `%${searchTerm}%`
                  }
                },
                {
                  username: {
                    $iLike: searchTerm
                  }
                },
                {
                  email: {
                    $iLike: searchTerm
                  }
                },
              ]
            },
            include: [
              { model: models.Recipe }
            ]
          })
          .then(data => res.status(201).json({
            success: true,
            data: results.concat(data)
          }));
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Unable to search recipes'
      }));
  }

  /**
     * Fetch list of recipes based ingredients supplied
     *@static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @returns {object} Class instance
     * @memberof SearchRecipeController
     */
  static searchByIngredients(req, res) {
    const ingredients = req.query.ingredients.split(' ');

    const queryClause = ingredients.map(item => ({
      ingredients: { $iLike: `%${item}%` }
    }));

    return Recipe
      .findAll({
        where: {
          $or: queryClause
        },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        if (!foundRecipes) {
          return res.status(404).json({
            success: true,
            message: 'Nothing found',
          });
        }

        return res.status(201).json({
          success: true,
          data: foundRecipes,
        });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Unable to search recipes'
      }));
  }
}
