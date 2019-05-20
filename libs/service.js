/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 */
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const 
  symb = Symbol();
 
module.exports = class Service {
  
  constructor(router) {
    this[symb] = { router };
  }
  
  _do() {}
  
  get requiredAuthorization() {
    return false;
  }
  
  get protocol() {
    return this[symb].router.protocol;
  }

};