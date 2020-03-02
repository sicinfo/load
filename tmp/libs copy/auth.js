/**
 * application load
 * 
 * updated by Moreira in 2019-04-11
 * 
 * updated by moreira in 2019-11-01
 * powered by Moreira in 2019-01-30
 */

require('./utils').log(__filename);

const jwt = require('jsonwebtoken');

const 
  secret = `${process.env.username}${process.env.HOSTNAME}`,
  BEARED = module.exports.BEARED = 'Beared',
  AUTHORIZATION = module.exports.AUTHORIZATION = 'authorization',
  expiresIn = 60 * 60; // 1 hora

module.exports = class Auth {
  
  static sign(arg = {}, opts = {}) {
    return [AUTHORIZATION, `${BEARED} ${jwt.sign(arg, secret, opts)}`];
  }
  
  static verify({ authorization }) {
    
    const [type, credentials] =  (authorization || ' ').split(' ');
    
    return new Promise((resolve, reject) => {
      
      if (!type || type !== BEARED || !credentials) reject({ 
        'code': 401, 
        'message': 'jwt invalid' 
      });
      
      else jwt.verify(credentials, secret, {}, (err, token) => {
        if (err) reject(Object.assign(err, { 'code': 401 }));
        else resolve({ token });
      });

    })
  }

  static validate(authorization, requiredAuthorization) {
    return new Promise((resolve, reject) => {

      const [type, credentials] =  (authorization || ' ').split(' ');

      if (!type || type !== BEARED || !value) {
        if (requiredAuthorization) reject({ 'code': 401, 'message': 'Unauthorized' });
        else resolve({});
      }  

      else jwt.verify(value, secret, {}, (err, token) => {

        if (err)

          requiredAuthorization ?
            reject(Object.assign(err, { 'code': 401 })) :
            resolve({});

        else resolve({ token });

      });

    });
  }

  static create(arg = {}, opts = {}) {
    
    Reflect.has(opts, 'expiresIn') ||
    Reflect.set(opts, 'expiresIn', Auth.expiresIn);

    Reflect.has(arg, 'stp') ||
    Reflect.set(arg, 'stp', 1 * opts.expiresIn);

    Reflect.has(arg, 'cnt') ||
    Reflect.set(arg, 'cnt', 0);
    
    return Auth.sign(arg, opts);
  }

  static renew(arg) {

    Reflect.set(arg, 'exp', parseInt(Date.now() / 1000, 10) + arg.stp);
    Reflect.set(arg, 'cnt', arg.cnt + 1);
    
    return Auth.sign(arg);
  }

};

