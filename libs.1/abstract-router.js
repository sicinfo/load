/** **
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 * 
 * http://www.typescriptlang.org/play/index.html
 */
 
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const symb = Symbol();

module.exports =  class  {

  constructor(http) {
    this[symb] = { http };
  }
  
  get headers()  {
    return this[symb].http.request.headers;
  }
  
  get hostname() {
    return this.headers.host;
  }
  
  get ip() {
    return this.headers['x-real-ip'];
  }
  
  get authorization() {
    return this.headers.authorization || '';
  }

  get method() {
    return this[symb].http.request.method;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
  }
  
  get originalUrl() {
    return this[symb].http.request.url;
  }
  
  get url() {
    return this[symb].http.url;
  }
  
  get dirservices() {
    return 'services';
  }
  
  get serviceName() {
    return (url => '/' !== url && url.split('/')[1])(this.url.split('?')[0]);
  }
  
  // nível de serviço
  get service()  {
    const { serviceName } = this;
    if (serviceName) try { 
      const { dirname, dirservices } = this;
      return require(require('path').join(dirname, dirservices, `${serviceName}-service`)); 
    }
    catch(err) {}
  }
  
  get cache() {
    return this[symb].http.cache;
  }
    
  get dbconfig() {
    return this.cache.dbconfig;
  }

  get appname() {
    return this.cache.appname;
  }
    
  get dirname() {
    return this.cache.dirname;
  }
  
};
