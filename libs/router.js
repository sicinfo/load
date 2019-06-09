/** **
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 * 
 * http://www.typescriptlang.org/play/index.html
 */
 
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const
  symb = Symbol(),
  path = require('path');

module.exports =  class  {

  constructor(options) {
    this[symb] = {
      'dirname': options.dirname,
      'originalUrl': options.originalUrl,
      'url': options.url,
      'appname': options.appname,
      'dbconfig': options.dbconfig
    };
  }
  
  get dialect() {
    return;
  }
    
  get appname() {
    return this[symb].appname;
  }
    
  get originalUrl() {
    return this[symb].originalUrl;
  }
  
  get url() {
    return this[symb].url;
  }
  
  get dirname() {
    return this[symb].dirname;
  }
  
  get dbconfig() {
    if (!this.dialect) return {};
    if (!this[symb].dbconfig[this.dialect]) return {};
    if (!this[symb].dbconfig[this.dialect][this.appname]) return {};
    return Object.assign({'database': this.appname}, this[symb].dbconfig[this.dialect][this.appname]);
  }
  
  get dirservices() {
    return 'services';
  }
  
  // segundo nível
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
