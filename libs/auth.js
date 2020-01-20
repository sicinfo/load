/**
 * application load
 * 
 * updated by Moreira in 2019-04-11
 * 
 * updated by moreira in 2019-11-01
 * powered by Moreira in 2019-01-30
 */

console.log('loading...', __filename);

const
  jwt = require('jsonwebtoken'),
  BEARED = 'Beared';
  
module.exports = class Auth {
  
  static get AUTHORIZATION() {
    return 'authorization';
  }
  
  static get secret() {
    return process.env.username;
  }
  
  static get expiresIn() {
    return 60 * 60; // 1 hora
  }

  static sign(arg = {}, opts = {}) {
    return [Auth.AUTHORIZATION, `${BEARED} ${jwt.sign(arg, Auth.secret, opts)}`];
  }
  
  static verify({ authorization }) {
    return ((type, credentials) => new Promise((resolve, reject) => {
      
      !type || type !== BEARED || !credentials ?
      reject({ 'code': 401, 'message': 'jwt invalid' }) :
      jwt.verify(credentials, Auth.secret, {}, (err, token) => {
        err ? reject(Object.assign(err, { 'code': 401 })) : resolve({ token });
      });
      
    }))(...(authorization || '').split(' '));
  }

  static validate(authorization, requiredAuthorization) {
    return new Promise((resolve, reject) => {

      const [type, value] = authorization.split(' ');

      if (!type || type !== BEARED || !value) {
        if (requiredAuthorization) reject({ 'code': 401, 'message': 'Unauthorized' });
        else resolve({});
      }  

      else jwt.verify(value, Auth.secret, {}, (err, token) => {
        if (err) requiredAuthorization ? reject(Object.assign(err, { 'code': 401 })) : resolve({});
        else resolve({ token });
      });

    });
  }

  static create(arg, opts) {
    return (opts => Auth.sign(Object.assign({
      'stp': 1 * opts.expiresIn,
      'cnt': 0
    }, arg), opts))(Object.assign({
      'expiresIn': Auth.expiresIn
    }, opts));
  }

  static renew(arg) {
    return Auth.sign(Object.assign(arg, {
      'exp': parseInt(Date.now() / 1000, 10) + arg.stp,
      'cnt': arg.cnt + 1
    }));
  }

};

