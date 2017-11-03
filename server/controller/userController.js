import models from '../models';
import Encryption from '../middleware/encryption';
import Authentication from '../middleware/authentication';

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
      .create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber
      })
      .then((user) => {
        const token = Authentication.sign(user);
        return res.status(201).json({
          message: 'Account has been created',
          data: token
        });
      })
      .catch(error => res.status(503).json({
        status: false,
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
    const { userEmail } = req.body.email;

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
            status: false,
            message: 'Email address does not exist!'
          });
        }

        if (Encryption.verifyHash(req.body.password, userFound.password)) {
          Authentication.sign(userFound.id);

          return res.status(201).json({
            status: true,
            data: {
              id: userFound.id
            }
          });
        }
        res.status(401).json({
          status: false,
          message: 'Incorrect Password!'
        });
      });
  }
}
