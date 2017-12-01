import models from '../models';

const { Recipes } = models;
const { Users } = models;

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
    return Recipes
      .findAll({
        include: [
          { model: models.Users, attributes: ['name', 'updatedAt'] }
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
      .catch(error => res.status(503).json({
        success: false,
        message: `Unable to fetch recipes: ${error.message}`
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

    return Recipes
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
          { model: models.Users, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((foundRecipes) => {
        results = foundRecipes.slice(0);
      })
      .then(() => {
        Users
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
              { model: models.Recipes }
            ]
          })
          .then(data => res.status(201).json({
            success: true,
            data: results.concat(data)
          }));
      })
      .catch(error => res.status(503).json({
        success: false,
        message: `Unable to search recipes: ${error.message}`
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

    return Recipes
      .findAll({
        where: {
          $or: queryClause
        },
        include: [
          { model: models.Users, attributes: ['name', 'createdAt'] }
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
      .catch(error => res.status(503).json({
        success: false,
        message: `Unable to search recipes: ${error.message}`
      }));
  }
}
