/** *
* application: load
* 
* updated by Moreira in 2019-07-28
* 
* powered by Moreira in 2019-04-10
*/
const log = (a, ...b) => (({log}) => {
  log(a, __filename);
  for (const m of b) log(' -', m);
})(console);
log('loading...');

const 
  Auth = require('./auth'),
  _map = new WeakMap(),
  _set = (a, b, c) => _map.get(a).set(b, c),
  _get = (a, b) => _map.get(a).get(b),
  _has = (a, b) => _map.get(a).has(b);

module.exports = class extends require('./http-abstract') {

  constructor(_router, _resolve, _reject) {
    super(_router);
    
    if (this.requiredAuthorization && !this.isAuthorized) {
      throw { 'code': 401, 'message': `${this.unauthorizedError} (26)` };
    }
    
    _map.set(this, new Map());
    
    _set(this, 'body', new Map()) && this.body &&
    Object.entries(this.body).forEach(([key, val]) => {
      '_' === key[0] && 
      _get(this, 'body').set(key, val) &&
      Reflect.deleteProperty(this.body, key);
    });

    this.doHttp().then(_resolve).catch(_reject);
  }
  
  get _body() {
    return _get(this, 'body');
  }
  
  get expiresIn() {
    return 60 * 60; // 1 hora
  }
  
  get from() {
    return this._body.get('_from');
  }
  
  get key() {
    return this._body.get('_key');
  }

  get requiredAuthorization() {
    return false;
  }
  
  get to() { 
    return this._body.get('_to');
  }

  get unauthorizedError() {
    return this.authorization && this.authorization.error || '';
  }

  createAuth(arg = {}, opts) {
    return Auth.create(arg, Object.assign({ 'expiresIn': this.expiresIn }, opts));
  }
  
  doHttp() {
    return this[`do${(a => `${a[0]}${a.slice(1).toLowerCase()}`)(this.method)}`]()
      .then(({ code, result, headers = [] }) => {
        this.authorization.error || headers.push(Auth.renew(this.authorization));
        return { code, result, headers };
      });
  } 
    
  doGet() {
    return this[`doGetBy${this.id ? 'Id' : this.key ? 'Key': 'Query'}`]();
  }
  
  doGetById() {
    return Promise.reject({'code': 405, 'message': 'Method GetById Not Allowed'});
  }
  
  doGetByKey() {
    return Promise.reject({'code': 405, 'message': 'Method GetByKey Not Allowed'});
  }
  
  doGetByQuery() {
    return Promise.reject({'code': 405, 'message': 'Method GetByQuery Not Allowed'});
  }
  
  doDelete() {
    return Promise.reject({'code': 405, 'message': 'Method Delete Not Allowed'});
  }
  
  doPatch() {
    return Promise.reject({'code': 405, 'message': 'Method Path Not Allowed'});
  }
  
  doPost() {
    return Promise.reject({'code': 405, 'message': 'Method Post Not Allowed'});
  }
  
  doPut() {
    return Promise.reject({'code': 405, 'message': 'Method Put Not Allowed'});
  }

};
