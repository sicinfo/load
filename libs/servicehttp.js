/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 */
const 
log = (a, ...b) => console.log(a, __filename, ...b), 
warn = (a, ...b) => console.warn(a, __filename, ...b);
log('loading...');


const symb = Symbol();

module.exports = class ServiceHttp extends require('./service') {
  
  constructor(router) {
    super(router);
    this[symb] = { router };
  }
  
  do_() {
    
    return new Promise((accept, reject) => {
        this[`do_${this.method.toLowerCase()}`](accept, reject);
      })
      .then(({ error, code, result, headers }) => {

        if (error) return { code, error };

        // const { _key, _rev } = arg;
        // if (_key && _rev) result = (obj => (obj[`${_key}/${_rev}`] = {}, obj))({});
        if (result) result = { result, 'code': code || 200 };
        else result = { 'code': 204 };
        
        if (headers) Object.assign(result, { headers });

        return result;
      })
      .catch(err => {

        warn(33, 'code', err.code);
        warn(34, 'message', err.message);
        warn(35, 'error', err.error);

        return err;
      });
        
  }
    
  do_get(...args) {
    if (this.key) this.do_getByKey(...args);
    else this.do_getByQuery(...args);
  }
  
  do_getByKey(accept, reject) {
    accept({});
  }
  
  do_getByQuery(accept, reject) {
    accept({});
  }
  
  do_delete(accept, reject) {
    accept({});
  }
  
  do_patch(accept, reject) {
    accept({});
  }
  
  do_post(accept, reject) {
    accept({});
  }
  
  do_put(accept, reject) {
    accept({});
  }

  get key() {
    return this[symb].router.key;
  }
    
  get rev() {
    return this[symb].router.rev;
  }
  
  get query() {
    return this[symb].router.query;
  }
  
  get body() {
    return this[symb].router.body;
  }

  get ip() {
    return this[symb].router.ip;
  }
  
  get method() {
    return this[symb].router.method;
  }
  
  get authorization() {
    return this[symb].router.authorization;
  }
  
  get isAuthorized() {
    return !!this.authorization;
  }
  
};