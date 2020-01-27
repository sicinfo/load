/**
 * application: load
 * 
 * updated by Moreira in 2019-07-26
 * 
 * powered by Moreira in 2019-04-10
 * 
 * http://www.typescriptlang.org/play/index.html
 */


/**
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 * 
 * http://www.typescriptlang.org/play/index.html
 */
const log = (a, ...b) => (({log}) => {
  log(a, __filename);
  for (const m of b) log(' -', m);
})(console);
log('loading...');

const 
  _map = new WeakMap(),
  _set = (a, b, c) => _map.get(a).set(b, c),
  _get = (a, b) => _map.get(a).get(b);

module.exports = class extends require('./http-abstract') {
  
  constructor(options) {
    super();
    
    _map.set(this, new Map());

    { /**
       * verifica atributos:
       * service, serviceName, key, rev
       */
       
      const 
        { join } = require('path'),
        { dirservices } = this,
        { dirname } = this.locals,
        { url } = options,
        _url = url.splice(0);
      
      let service; 
        
      do { 
        // pega o último
        const arg = _url.pop();
  // console.log(48, __filename, arg)        ;
        if (arg === '') continue;
        
        if (isNaN(arg)) {
  // console.log(53, __filename, dirname, dirservices, ..._url, `${arg}-service`);          
          try {
  // console.log(55, __filename, join(dirname, dirservices, ..._url, `${arg}-service`));            
            service = require(join(dirname, dirservices, ..._url, `${arg}-service`));
            url.unshift(arg);
            break;
          } catch (e) { /* console.warn(63, __filename, e.message) */ }
          
          if (url[0]) try {
            service = require(join(dirname, dirservices, ..._url, arg, `${url[0]}-service`));
            break;
          } catch (e) { /* console.warn(68, __filename, e.message) */ }
          
        }
        
        url.unshift(arg);
      } while (_url.length);
  
  // console.log(67, __filename, url)    ;
  // console.log(68, __filename, options.url)    ;
  // console.log(69, __filename, this._url)    ;
  // console.log(70, __filename, service)    ;
  
      _set(this, 'service', service);
      _set(this, 'url', url);
      
    }
      
    (initialize => this.isGetOrDeleteMethod ? initialize() : (
      this.request.setEncoding('utf8'),
      this.request.on('data', chunk => _set(this, 'body', chunk && JSON.parse(chunk))),
      this.request.on('end', initialize),
      this.request.on('error', initialize)
    ))(() => new Promise((resolve, reject) => {
      this.service ?
      new this.service(this, resolve, reject) :
      reject({'code': this.serviceName, 'message': `service not found`});
    }).then(({ code, result, headers = [] }) => {
      headers.forEach(arg => this.setHeader(...arg));
      if (result) this.statusCode(code || 200).json({ result });
      else this.statusCode(code || 204).send();
    }).catch(err => {
      let { code, message, syscall } = err;
      console.warn('http-router', 'code', code);
      console.warn('http-router', 'message', message);
      console.warn('http-router', 'syscall', syscall);
      console.warn('http-router', err.class);
      undefined === code || null === code || isNaN(code) &&
      ([code, message] = [500, `${code} - ${message}`]);
      this.statusCode(code || 500).send(message);
    }));

  }
  
  get method() {
    return this.request.method;
  }
  
  get dirservices() {
    return `services`;
  }
  
  get service() {
    return _get(this, 'service');
  }

  get url() {
    return _get(this, 'url');
  }

  get query() {
    return _get(this, 'query') ||
      (query => _set(this, 'query', query) && query)
      (require('url').parse(this.request.url, true).query);
  }

  get body() {
    return _get(this, 'body');
  }
  
  get hostname() {
    return this.request.headers.host;
  }
  
//*************************************************************
// sem teste
//*************************************************************

  setHeader(key, value) {
    this.response.setHeader(key, value);
    return this;
  }
      
  statusCode(code) {
    this.response.statusCode = code;
    return this;
  }
  
  json(data) {
    this.setHeader('content-type', 'application/json');
    this.response.end(JSON.stringify(data), 'utf8');
  }
  
  send(arg) {
    this.setHeader('content-type', 'text/plain');
    this.response.end(arg, 'utf8');
  }

};
