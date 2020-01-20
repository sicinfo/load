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

const 
  _Args = new WeakMap(),
  _args = a => _Args.get(a, 'args');
  
module.exports =  class  {
  
  constructor(args) {
    _Args.set(this, args);
  }
  
  get authorization() {
    return _args(this).authorization;
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
    return _args(this).hostname;
  }
  
  get id() {
    return this.url[1];
  }

  get isAuthorized() {
    return this.authorization && !('error' in this.authorization);
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
