/**
 * Class Definition for the Authentication Object using Jason Web Token
 *
 * @export
 * @class Authentication
 */
export default class AdminAuthentication {
    /**
       * Verify JWT token
       *@static
       * @param {object} req - HTTP Request
       * @param {object} res - HTTP Response
       * @param {function} next - HTTP Next()
       * @returns {object} Class instance
       * @memberof AdminAuthentication
       */
    static isAdmin(req, res, next) {
        if(req.decoded.id === 1)