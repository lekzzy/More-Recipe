import models from '../models';

const { Upvotes } = models.Upvotes;
const { Downvotes } = models.Downvotes;
const { Recipes } = models.Recipes;

/**
 * Class Definition for the Vote Object
 *
 * @export
 * @class Vote
 */
export default class VoteController {
  /**
   * Upvote a Recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Vote
   */
  upvoteRecipe(req, res) {
    console.log(Upvotes);

    Downvotes
      .findOne({
        attributes: ['id'],
        where: {
          $and: [{ userId: req.body.userId }, { recipeId: req.params.recipeId }]
        }
      })
      .then((voteFound) => {
        if (voteFound) {
          Downvotes
            .destroy({
              where: {
                $and: [{
                  userId: req.body.userId
                },
                { recipeId: req.params.recipeId }]
              }
            })
            .then(() => {
              Recipes
                .findOne({
                  where: {
                    id: req.params.recipeId
                  }
                })
                .then((option) => {
                  option.decrement('downvotes');
                });
            });
        }
      });

    Upvotes
      .findOrCreate({ where: { userId: req.body.userid, recipeId: req.params.recipeId } })
      .spread((createdVote, created) => {
        if (created) {
          Recipes
            .findOne({
              where: {
                id: req.params.recipeId
              }
            })
            .then((option) => {
              option.increment('upvotes');
            });
          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${req.params.recipeId} Upvoted!`
          });
        }

        return res.status(201).json({
          success: false,
          message: `Recipe with id: ${req.params.recipeId} Already Upvoted!`
        });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Error Upvoting Recipe ${error.message}`
        }));

    return this;
  }

  /**
   * Downvote a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Vote
   */
  downvoteRecipe(req, res) {
    const { userId } = req.userId;
    const { recipeId } = req.params.recipeId;

    Upvotes
      .findOne({
        attributes: ['id'],
        where: {
          $and: [{ userId }, { recipeId }]
        }
      })
      .then((voteFound) => {
        if (voteFound) {
          Upvotes
            .destroy({
              where: {
                $and: [{ userId }, { recipeId }]
              }
            })
            .then(() => {
              Recipes
                .findOne({
                  where: {
                    id: recipeId
                  }
                })
                .then((option) => {
                  option.decrement('upvotes');
                });
            });
        }
      });

    Downvotes
      .findOrCreate({ where: { userId, recipeId } })
      .spread((createdVote, created) => {
        if (created) {
          Recipes
            .findOne({
              where: {
                id: recipeId
              }
            })
            .then((option) => {
              option.increment('downvotes');
            });

          return res.status(201).json({
            success: true,
            message: `Recipe with id: ${recipeId} Downvoted!`
          });
        }

        return res.status(201).json({
          success: false,
          message: `Recipe with id: ${recipeId} Already Downvoted!`
        });
      })
      .catch(error =>
        res.status(503).json({
          success: true,
          message: `Error Downvoting Recipe ${error.message}`
        }));

    return this;
  }

  /**
   * Fetch a list of users that upvoted a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {obejct} Class instance
   * @memberof Vote
   */
  getUserUpvotes(req, res) {
    const { recipeId } = req.params.recipeId;

    Upvotes
      .findAll({
        attributes: ['recipeId'],
        where: { recipeId },
        include: [{ model: models.User, attributes: ['name'] }]
      })
      .then((foundVotes) => {
        if (!foundVotes) {
          return res.status(201).json({
            success: true,
            message: 'No User Upvoted this Recipe!'
          });
        }

        return res.status(201).json({
          success: true,
          data: foundVotes
        });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Unable to get user upvotes ${error.message}`
        }));

    return this;
  }

  /**
   * Fetch a list of users that downvoted a recipe
   *
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Vote
   */
  getUserDownvotes(req, res) {
    const { recipeId } = req.params.recipeId;

    Downvotes
      .findAll({
        attributes: ['recipeId'],
        where: { recipeId },
        include: [{ model: models.User, attributes: ['name'] }]
      })
      .then((foundVotes) => {
        if (!foundVotes) {
          return res.status(201).json({
            success: true,
            message: 'No User Downvoted this Recipe!'
          });
        }

        return res.status(201).json({
          success: true,
          data: foundVotes
        });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Unable to get user downvotes ${error.message}`
        }));

    return this;
  }
}
