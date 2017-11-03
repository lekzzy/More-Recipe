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
    return Reviews
      .create(req.body)
      .then((createdReview) => {
        res.status(201).json({
          success: true,
          createdReview
        });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Error Posting Review'
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
    const { recipeId } = req.params.recipeId;

    return Reviews
      .findAll({
        where: { recipeId },
        include: [
          { model: models.User, attributes: ['name', 'updatedAt'] }
        ]
      })
      .then((contentReviews) => {
        res.status(201).json({
          success: true,
          data: contentReviews
        });
      })
      .catch(() => res.status(503).json({
        success: false,
        message: 'Error Fetching Reviews'
      }));
  }
}

