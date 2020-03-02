/**
 * application load
 *
 * updated by Moreira in 2019-04-11
 *
 * updated by moreira in 2019-11-01
 * powered by Moreira in 2019-01-30
 */
const log = require('./utils').log(__filename);
const jwt = require('jsonwebtoken');
const BEARED = 'Beared';
const AUTHORIZATION = 'authorization';
const expiresIn = 60 * 60; // 1 hora

const secret = `${process.env.username}${process.env.HOSTNAME}`

/**
 * @typedef {string} IsAuthorization
 * @typedef {{ stp?:number, cnt?:number, exp?:number }} IsSignArgs
 * @typedef {{ expiresIn?:number }} IsSignOpts
 *
 * @param {IsSignArgs} arg
 * @param {IsSignOpts} opts
 * @returns {[string, string]}
 */

/**
 * @param {*} arg
 * @param {*} opts
 * @return {string}
*/
const _sign = (arg, opts = {}) => `${BEARED} ${jwt.sign(arg, secret, opts)}`;

module.exports = class {

  static get BEARED() { return BEARED }
  static get AUTHORIZATION() { return AUTHORIZATION }

  /**
   * resolve -> token
   * reject -> { error }
   * @param {{ authorization:IsAuthorization }} arg
   */
  static verify(arg) {

    const [type, value] =  arg.authorization.split(' ');

    return new Promise((resolve, reject) => {

      if (!type || type !== BEARED || !value) reject({
        code: 401, message: 'jwt invalid'
      });

      else jwt.verify(value, secret, {}, (err, token) => {
        if (err) reject(Object.assign({ code: 401 }, err));
        else resolve(token);
      });

    })
  }

  /**
   * resolve -> token || {}
   * reject -> err
   * @param {string} authorization
   * @param {boolean} requiredAuthorization
   */
  static validate(authorization, requiredAuthorization) {

    const [type, value] = (authorization || ' ').split(' ');

    return new Promise((resolve, reject) => {

      if (!type || type !== BEARED || !value) {
        requiredAuthorization ?
          reject({ code: 401, message: 'Unauthorized' }) :
          resolve({});
      }

      else jwt.verify(value, secret, {}, (err, token) => {

        err ?
          requiredAuthorization ?
            reject(Object.assign({ code: 401 }, err)) :
            resolve({}) :
          resolve(token);

      });

    });
  }

  /**
   * @param {IsSignArgs} arg
   * @param {IsSignOpts} opts
   */

  static create(arg = {}, opts = {}) {

    if (undefined === opts.expiresIn) opts.expiresIn = expiresIn;
    if (undefined === arg.stp) arg.stp = 1 * (opts.expiresIn || 0);
    if (undefined === arg.cnt) arg.cnt = 0;

    return _sign(arg, opts);
  }

  /**
   * @param {IsSignArgs} arg
   */
  static renew(arg = {}) {

    arg.exp = Math.floor(Date.now() / 1000) + arg.stp
    arg.cnt += 1

    return _sign(arg);
  }

};

