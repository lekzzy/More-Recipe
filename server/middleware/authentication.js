import jwt from 'jsonwebtoken';


/**
 * Class Definition for the Authentication Object using Jason Web Token
 *
 * @export
 * @class Authentication
 */
export default class Authentication {
  /**
     * Verify JWT token
     *@static
     * @param {object} req - HTTP Request
     * @param {object} res - HTTP Response
     * @param {function} next - HTTP Next()
     * @returns {object} Class instance
     * @memberof Authentication
     */
  static verify(req, res, next) {
    const token = req.body.token
            || req.query.token
            || req.headers['x-access-token'];

    if (token) {
      const secret = process.env.API_KEY || 'for sharing recipe';
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        }
        req.user = decoded;
        next();
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'No token provided.'
      });
    }

    return this;
  }

  /**
   * @static
   * @param {string} user - User Id
   * @returns {string} Encrypted string
   * @memberof Authentication
   */
  static sign(user) {
    const secretKey = process.env.API_KEY || 'for sharing recipe';
    return jwt.sign({
      userId: user.id
    }, secretKey);
  }
}
