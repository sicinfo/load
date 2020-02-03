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

const 
  utils = require('./utils'),
  log = utils.log(__filename),
  { _new, _set, _get } = utils.weak();

module.exports = class {
  
//   constructor(options) {
//     new(this);
//     _set(this, 'options', options);

//     // { 
//     //   /**
//     //    * verifica atributos:
//     //    * service, serviceName, key, rev
//     //    */
       
//     //   const 
//     //     { join } = require('path'),
//     //     { dirservices } = this,
//     //     { dirname } = this.locals,
//     //     { url = [] } = options,
//     //     _url = url.splice(0);

//     //   let service = options.service; 

//     //   if (!service) do { 
//     //     // pega o último
//     //     const arg = _url.pop();
//     //     // log(48, arg)         ;
//     //     if (!arg) continue;
        
//     //     if (isNaN(arg)) {

//     //       // log(53, dirname, dirservices, ..._url, `${arg}-service`);          
//     //       try {
//     //         // log(55, join(dirname, dirservices, ..._url, `${arg}-service`));             
//     //         service = require(
//     //           join(dirname, dirservices, ..._url, `${arg}-service`)
//     //         );
//     //         // log(56, service);
//     //         url.unshift(arg);
//     //         break;
//     //       } catch (e) { /* console.warn(63, __filename, `\n -`, e.message) */ }
          
//     //       if (url[0]) try {
//     //         service = require(
//     //           join(dirname, dirservices, ..._url, arg, `${url[0]}-service`)
//     //         );
//     //         break;
//     //       } catch (e) { /* console.warn(64, __filename, '\n -', e.message) */ }
          
//     //     }
        
//     //     url.unshift(arg);
//     //   } while (_url.length);
  
//     //   // log(67, __filename, url)    ;
//     //   // log(68, __filename, options.url)    ;
//     //   // log(69, __filename, this._url)    ;
//     //   // log(70, __filename, service)    ;
  
//     //   _set(this, 'service', service);
//     //   _set(this, 'url', url);
      
//     // }

//     // const reject = err => {
//     //   let { code, message, syscall } = err;
//     //   console.warn('http-router', 'code', code);
//     //   console.warn('http-router', 'message', message);
//     //   console.warn('http-router', 'syscall', syscall);
//     //   console.warn('http-router', err.class);
//     //   undefined === code || null === code || isNaN(code) &&
//     //   ([code, message] = [500, `${code} - ${message}`]);
//     //   this.statusCode(code || 500).sendText(message);
//     // };
      
//     // if (!this.service) reject({
//     //   'code': this.serviceName, 
//     //   'message': `service not found`
//     // });

//     // else {

//     //   const 
//     //     resolve = ({ code, result, headers = [] }) => {
//     //       headers.some(arg => { this.setHeader(...arg) });
//     //       if (result) this.statusCode(code || 200).sendJson({ result });
//     //       else this.statusCode(code || 204).sendText();
//     //     },
//     //     initialize = () => new this.service(this, resolve, reject);
      
//     //   if (this.isPostOrPutOrPatchMethod) {
//     //     this.request.setEncoding('utf8');
//     //     this.request.on('data', chunk => _set(this, 'body', chunk && JSON.parse(chunk)));
//     //     this.request.on('end', initialize);
//     //     this.request.on('error', initialize);
//     //   }
//     //   else initialize();

//     // }
//   }
  
//   get body() {
//     return _get(this, 'body');
//   }
  
  get dirservices() {
    return `services`;
  }
  
//   get hostname() {
//     return this.request.headers.host;
//   }

  get isDeleteMethod() {
    return 'DELETE' === this.method;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
  }
  
  get isGetOrDeleteMethod() {
    return this.isGetMethod || this.isDeleteMethod;
  }
  
  get isOptionsMethod() {
    return 'OPTIONS' === this.method;
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

  get method() {
    return this.request.method;
  }
  
//   get query() {
//     return _get(this, 'query') ||
//       (query => _set(this, 'query', query) && query)
//       (require('url').parse(this.request.url, true).query);
//   }

//   get service() {
//     return _get(this, 'service');
//   }

//   get url() {
//     return _get(this, 'url');
//   }
  
// //*************************************************************
// // sem teste
// //*************************************************************

//   setHeader(key, val) {
//     this.response.setHeader(key, val);
//     return this;
//   }

//   hasHeader(key) {
//     return this.response.hasHeader(key);
//   }
              
//   statusCode(code) {
//     this.response.statusCode = code;
//     return this;
//   }
  
//   sendJson(data = {}) {
//     this.setHeader(
//       'content-type', 
//       'application/json'
//     ).send(JSON.stringify(data));
//   }
  
//   sendText(arg = "") {
//     this.setHeader(
//       'content-type', 
//       'text/plain'
//     ).send(arg);
//   }

//   send(arg) {
//     this.response.end(arg, 'utf8');
//   }

};
