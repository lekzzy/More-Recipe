import models from '../models';
import Encryption from '../middleware/encryption';
import Authentication from '../middleware/authentication';

const { Users } = models;


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
    const hashedPassword = Encryption.generateHash(req.body.password);
    return Users
      .create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber
      })
      .then((users) => {
        const token = Authentication.sign(users);
        return res.status(201).json({
          success: true,
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
    return Users
      .findOne({
        attributes: ['id', 'username', 'email', 'password'],
        where: {
          $or: [
            {
              username: {
                $iLike: req.body.username
              }
            },
            {
              email: {
                $iLike: req.body.email
              }
            }
          ]
        }
      })
      .then((userFound) => {
        if (!userFound) {
          return res
            .status(404)
            .json({
              success: false,
              message: 'Username or email does not exist!'
            });
        }
        if (Encryption.verifyHash(req.body.password, userFound.password)) {
          const token = Authentication.sign({
            id: userFound.id
          });

          const loggedUser = {
            userId: userFound.id,
            token
          };

          return res
            .status(201)
            .json({
              success: true,
              message: 'User Signed in and token generated!',
              Users: loggedUser
            });
        }
        res.status(401).json({
          success: false,
          message: 'Incorrect Password!'
        });
      })
      .catch(() => res.status(500).json({
        success: false,
        message: 'Error Signing In User'
      }));
  }
}
