import models from '../models';
import Encryption from '../middleware/encryption';
import Auth from '../middleware/authentication';

const { User } = models;


/**
 * Class Definition for the User Object
 *
 * @export
 * @class UserController
 */
export default class UserController {
  /**
     * Sign Up user (Create new user)
     * @static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @returns {object} Class instance
     * @memberof UserController
     */
  static signUp(req, res) {
    return User
      .create(req.body)
      .then(() => {
        const token = Auth.sign(User);
        return res.status(201).json({
          message: 'Account has been created',
          data: token
        });
      })
      .catch(error => res.status(503).json({
        success: false,
        message: `Error Creating user ${error.message}}`,
      }));
  }

  /**
 *
 *
 * @static
 * @param {object} req - HTTP Request
 * @param {object} res - HTTP REsponse
 * @returns {object} Class instance
 * @memberof UserController
 */
  static signIn(req, res) {
    const userEmail = req.body.email;
    return User
      .findOne({
        attributes: ['id'],
        where: {
          email: {
            $iLike: userEmail
          }
        }
      })
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            success: false,
            message: 'Email address does not exist!'
          });
        }

        if (Encryption.verifyHash(req.body.password, userFound.password)) {
          Auth.sign(userFound.id);

          return res.status(201).json({
            success: true,
            data: {
              id: userFound.id,
            }
          });
        }
        res.status(401).json({
          success: false,
          message: 'Incorrect Password!'
        });
      });
  }
}
