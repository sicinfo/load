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

  constructor(arg) {
    this[symb] = { arg };
  }
  
  get appname() {
    return this[symb].arg.appname;
  }
    
  get headers()  {
    return this[symb].arg.request.headers;
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
    return this[symb].arg.request.method;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
  }
  
  get originalUrl() {
    return this[symb].arg.request.url;
  }
  
  get url() {
    return this[symb].arg.url;
  }
  
  get dirname() {
    return this[symb].arg.dirname;
  }
  
  get dirservices() {
    return 'services';
  }
  
  get serviceName() {
    return (url => '/' !== url && url.split('/')[1])(this.url.split('?')[0]);
  }
  
  // nível de serviço
  get service()  {

    const { serviceName, dirname, dirservices } = this;
    if (!serviceName) return;
    
    try { return require(require('path').join(dirname, dirservices, `${this.serviceName}-service`)) }
    catch(err) {}
  }
  
};
