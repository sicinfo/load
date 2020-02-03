/** *
* application: load
* 
* updated by Moreira in 2019-07-28
* 
* powered by Moreira in 2019-04-10
*/
const log = (a, ...b) => {
  const { log } = console;
  log(a, __filename);
  for (const c of b) log(' -', c);
}
log('loading...');

const 
  Auth = require('./auth'),
  { map, atob } = require('./utils'),
  { _new, _set, _get } = map();

module.exports = class extends require('./http-abstract') {

  constructor(args, resolve, reject) {
    super(args); _new(this);
    _set(
      this, 
      'authorization', 
      ((a = args.request.headers.authorization) => 
        a && (([a, b] = a.split(' ')) => 
          Auth.BEARED === a && b && JSON.parse(atob(b.split('.')))
        )()
      )() || {}
    );

    // reject if not authorized
    (this.requiredAuthorization && !this.isAuthorized) &&
      ((a = reject({ 'code': 401, 'message': `${this.unauthorizedError} (26)` })) => log(36, a) || a)() ||

      this.hasbody &&
      _set(this, 'body', new Map()) &&
      Object.entries(this.body).some(([key, val]) => {
        '_' === key[0] &&
          _get(this, 'body').set(key, val) &&
          Reflect.deleteProperty(this.body, key);
      }) ||
      this.doHttp().then(resolve).catch(reject);
    
  }
  
  get authorization() {
    return _get(this, 'authorization');
  }
  
  get expiresIn() {
    return 60 * 60; // 1 hora
  }
  
  get from() {
    return _get(this, 'body').get('_from');
  }
  
  get key() {
    return _get(this, 'body').get('_key');
  }

  get requiredAuthorization() {
    return false;
  }
  
  get to() { 
    return _get(this, 'body').get('_to');
  }

  get unauthorizedError() {
    return this.authorization && this.authorization.error || '';
  }

  createAuth(arg = {}, opts) {
    return Auth.create(arg, Object.assign({ 'expiresIn': this.expiresIn }, opts));
  }
  
  doHttp() {
    const action = `do${this.method[0]}${this.method.slice(1).toLowerCase()}`;

    return new Promise((resolve, reject) => {
      
      if (Reflect.has(this, action))

        this[action]().then(({ code, result, headers = [] }) => {
          !this.authorization ||
            Reflect.has(this.authorization, 'error') ||
            headers.push(Auth.renew(this.authorization));

          resolve({ code, result, headers });
        }).catch(reject);

      else

        reject({
          'code': 405,
          'message': `Method ${action.slict(2)} Not Allowed`
        });
    
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
  
  doOptions() {
    return Promise.resolve({ 'headers': [
      ['Access-Control-Max-Age', 6 ],
      // ['Access-Control-Allow-Credentials', true],
      // ['Access-Control-Allow-Headers', 'origin, x-requested-with, content-type, authorization, accept'],
      ['Access-Control-Allow-Headers', ['content-type', 'authorization']],
      ['Access-Control-Allow-Methods', 'GET'],
      ['Access-Control-Expose-Headers', 'authorization'],
      ['Access-Control-Allow-Origin', 'http://caierp.sicinfo.kinghost.net']
    ]});
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

  get isAuthorized() {
    return this.authorization && !Reflect.has(this.authorization, 'error');
  }

};
