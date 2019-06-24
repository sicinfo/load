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

  constructor(options) {
    this[symb] = {
      'dirname': options.dirname,
      'request': options.request,
      'url': options.url,
      'appname': options.appname
    };
  }
  
  get appname() {
    return this[symb].appname;
  }
    
  get request() {
    return this[symb].request;
  }
  
  get headers()  {
    return this.request.headers;
  }
    
  get method() {
    return this.request.method;
  }
  
  get originalUrl() {
    return this.request.originalUrl;
  }
  
  get url() {
    return this[symb].url;
  }
  
  get dirname() {
    return this[symb].dirname;
  }
  
  get dirservices() {
    return 'services';
  }
  
  // nível de serviço
  get service()  {
    
    const url = this.url.split('?')[0];
    if ('/' === url) return;
    
    const filename = require('path').join(
      this.dirname, 
      this.dirservices, 
      `${url.split('/')[1]}-service`
    );
    
    try { return require(filename) }
    catch(err) {}
  }
  
};
