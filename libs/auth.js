/**
 * application load
 * 
 * updated by Moreira in 2019-04-11
 * 
 * powered by Moreira in 2019-01-30
 */

const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

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

  static validate(authorization, requiredAuthorization) {
    return new Promise((accept, reject) => {

      const [type, value] = authorization.split(' ');

      if (!type || type !== BEARED || !value) {
        if (requiredAuthorization) reject({ 'code': 401, 'message': 'Unauthorized' });
        else accept({});
      }  

      else jwt.verify(value, Auth.secret, {}, (err, token) => {
        if (err) {
          if (requiredAuthorization) reject({ 'code': 401, 'message': err.message });
          else accept({});
        }
        else accept({ token });
      });

    });
  }

  static create(arg = {}, opts = {}) {
    opts.expiresIn || (opts.expiresIn = arg.Auth.expiresIn);
    arg.stp = 1 * opts.expiresIn;
    arg.cnt = 0;
    return Auth.sign(arg, opts);
  }


  static renew(arg) {
    arg.cnt = arg.cnt + 1;
    arg.exp = parseInt(Date.now() / 1000, 10) + arg.stp;
    return Auth.sign(arg);
  }

};

