import bcrypt from 'bcrypt';

/**
 * Class Definition for the Encryption Object
 *
 * @export
 * @class Encryption
 */
export default class Encryption {
  /**
     * Generate Hash for password string
     *@static
     * @param {string} password for user password
     * @returns {string} return the already encrypted/hashed password
     * @memberof Encryption
     */
  static generateHash(password) {
    this.salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, this.salt);

    return hashedPassword;
  }
  /** password encrypted with the above method*\


  /** Verify the Decrypted password
   * @static
   * @exports verifyHash
   * @param  {string} password The user supplied Password
   * @param  {string} hashedPassword  The hashed  Password
   * @return {boolean} The status of decryption
   */
  static verifyHash(password, hashedPassword) {
    this.status = bcrypt.compareSync(password, hashedPassword);
    return this.status;
  }
}
