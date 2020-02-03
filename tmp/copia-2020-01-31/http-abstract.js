/** *
 * application: load
 * 
 * powered by Moreira in 2019-07-26
 */
const log = (a, ...b) => (({log}) => {
  log(a, __filename);
  for (const m of b) log(' -', m);
})(console);
log('loading...');

const {_new, _set, _get, _has } = require('./utils').map();

export class {
  
  constructor(args) {
    _new(this);
    _set(this, 'args', args);
  }

  get authorization() {
    return _get(this, 'authorization') || (a => {
      
      if (a) {
        const [b, c] = a.split(' ');
        a = Auth.BEARED === b && c && JSON.parse(atob(c.split('.'))) || {};
      }
      
      else a = {};

      _set(this, 'authorization', a);
      return a;
    )()





    
      
      : (([a, b]) => {
    
        return e;
      })([b, c] = a.split(' '))
    })(_get(this, 'args').request.headers.authorization)
  }
  
  get body() { 
    return _args(this).body;
  }
  
  get hasBody() {
    return !!this.body;
  }

  get hasQuery() {
    return !!this.query;
  }
  
  get hostname() {
    return Reflect.get(_args(this), 'hostname');
  }
  
  get id() {
    return this.url[1];
  }

  get isDeleteMethod() {
    return 'DELETE' === this.method;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
  }
  
  get isGetOrDeleteMethod() {
    return this.isGetMethod || this.isDeleteMethod;
  }
  
  get isPatchMethod() {
    return 'PATCH' === this.method;
  }
  
  get isOptionsMethod() {
    return 'OPTIONS' === this.method;
  }
  
  get isPostMethod() {
    return 'POST' === this.method;
  }
  
  get isPostOrPutOrPatchMethod() {
    return this.isPostMethod || this.isPutMethod || this.isPatchMethod;
  }
  
  get isPutMethod() {
    return 'PUT' === this.method;
  }
  
  get locals() { 
    return _args(this).locals;
  }
  
  get method() {
    return _args(this).method;
  }
  
  get query() { 
    return _args(this).query;
  }

  get rev() {
    return this.url[2];
  }
  
  get serviceName() {
    return this.url[0];
  }
  
  get url() { 
    return _args(this).url;
  }
  
  static errorsMsg(a, ...b) {
    (msg => {
      throw (([code, message]) => ({ code, message }))(msg[a](...b));
    })({
      'FromAndToIsRequired': () => [412, 'from and to attributes is required']
    });
  }
  
};
