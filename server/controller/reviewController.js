import models from '../models';

const { Reviews } = models;
/**
 * Class Definition for the Review Object
 *
 * @export
 * @class ReviewController
 */
export default class ReviewController {
  /**
   * Post a review on a recipe
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof Review
   */
  static postReview(req, res) {
    return Reviews.create({
      review: req.body.review,
      recipeId: req.params.recipeId,
      userId: req.body.userId
    })
      .then((createdReview) => {
        res
          .status(201)
          .json({
            success: true,
            message: `Review for recipe Id: ${req
              .params
              .recipeId} created successfully`,
            review: createdReview
          });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Error Posting Review ${error.message}`
        }));
  }

  /**
   * Get a list of reviews on a recipe
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof ReviewContoller
   */
  static getReviews(req, res) {
    return Reviews.findAll({
      where: { recipeId: req.params.recipeId },
      include: [
        {
          model: models.Users,
          attributes: ['name', 'updatedAt']
        }
      ]
    })
      .then((contentReviews) => {
        res
          .status(201)
          .json({
            success: true,
            data: contentReviews
          });
      })
      .catch(error =>
        res.status(503).json({
          success: false,
          message: `Error Fetching Reviews ${error.message}`
        }));
  }

  /**
   * Get a list of reviews on a recipe
   *@static
   * @param {object} req - HTTP Request
   * @param {object} res - HTTP Response
   * @returns {object} Class instance
   * @memberof ReviewContoller
   */
  static deleteReviews(req, res) {
    return Reviews
      .findById(req.params.recipeId)
      .then((reviewFound) => {
        if (!reviewFound) {
          return res
            .status(404)
            .json({
              success: false,
              message: `No matching recipe with id: ${req.params.recipeId}`
            });
        }

        if (+reviewFound.userId !== +req.body.userId) {
          return res
            .status(403)
            .json({
              success: false,
              message: 'You cannot delete this review'
            });
        }

        Reviews.destroy({
          where: {
            $and: [
              { recipeId: req.params.recipeId },
              { id: req.body.id }
            ]
          }
        }).then(() =>
          res.status(205).json({
            success: true,
            message: `review with review id: ${req.body.id} deleted successfully`
          }));
        // .end());
      })
      .catch(error =>
        res.status(503).json({
          success: true,
          message: `Error Deleting Recipe ${error.message}`
        }));
  }
}

