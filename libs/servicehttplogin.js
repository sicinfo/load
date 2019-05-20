/** ****
 * application: load
 * 
 * powered by Moreira in 2019-05-05
 */
const 
log = (a, ...b) => console.log(a, __filename, ...b), 
warn = (a, ...b) => console.warn(a, __filename, ...b);
log('loading...');


const 
  // symb = Symbol(),
  AUTHORIZATION = 'authorization';

module.exports = class ServiceHttpLogin extends require('./servicehttp') {
  
  get user() {
    return this.isAuthorized && Buffer.from(
      Buffer.from(
        this.authorization.split(' ')[1], 'base64'
      ).toString().split('.')[0], 'base64'
    ).toString();
  }

  get pass() {
    return this.isAuthorized && Buffer.from(
      Buffer.from(
        this.authorization.split(' ')[1], 'base64'
      ).toString().split('.')[1], 'base64'
    ).toString();
  }
  
  get expiresIn() {
    return 60 * 60; // 1 hora
  }
  
  createAuth(arg = {}, opts = {}) {
    'expiresIn' in opts || (opts.expiresIn = this.expiresIn);
      'user' in arg || (arg.user = this.user);
    return require('./auth').create(arg, opts);
  }

};