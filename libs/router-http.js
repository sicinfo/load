/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 * 
 * http://www.typescriptlang.org/play/index.html
 */
 
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const symb = Symbol();

module.exports = class RouterHttp {
  
  constructor(arg) {
    
    this[symb] = Object.assign(...[
      'request', 
      'response', 
      'dbconfig', 
      'dirname', 
      'appname', 
      'url'
    ].map(k => (a => (a[k] = arg[k], a))({})));
    
    const _init = _this => {
      const { service, originalUrl, url, authorization } = _this;
      
      if (!service) {
        _this.statusCode(404).json({ 
          'message': `${require('path').join(originalUrl.split(url)[0], url)} - not found!` 
        });
        return;
      }
      
      const Auth = require('./auth');
      new service(_this, (service, { requiredAuthorization }) => {
        
        Auth.validate(authorization, requiredAuthorization)
          .then(({ token }) => {
            service.then(({ code, result, headers = [] }) => {
              if (token) headers.push(Auth.renew(token));
              if (headers.length) headers.forEach(
                arg => _this.setHeader(arg[0], arg[1])
              );
              if (result) _this.statusCode(code).json({ result });
              else _this.statusCode(code).send();
            })
            .catch(({ code = 500, message }) => {
              if ('ERR_HTTP_INVALID_STATUS_CODE') code = 500;
              console.warn(76, code, message);
              _this.statusCode(code).json({ message });
            });
          })
          .catch(({ code, message }) => { 
            _this.statusCode(code).json({ message });
          });
      });
    };
  
    if (this.isGetMethod) {
      this[symb].query = require('url').parse(this.originalUrl, true).query;
      _init(this);
    }
    
    else {
      arg.request.on('data', chunk => { 
        this[symb].body = JSON.parse(chunk);
      });
      arg.request.on('end', () => { 
        _init(this);
      });
    }
  }

  get hasQuery() {
    return !!Object.keys(this.query || {}).length;
  }
    
  get query() {
    return this[symb].query;
  }
    
  get hasBody() {
    return !!Object.keys(this.body || {}).length;
  }
    
  get body() {
    return this[symb].body;
  }
  
  get method() {
    return this[symb].request.method;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
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
  
  get appname() {
    return this[symb].appname;
  }
    
  get headers()  {
    return this[symb].request.headers;
  }
    
  get originalUrl() {
    return this[symb].request.url;
  }
  
  get url() {
    return this[symb].url;
  }
  
  get dbconfig() {
    return this[symb].dbconfig;
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
  
  setHeader(key, value) {
    this[symb].response.setHeader(key, value);
    return this;
  }
  
  statusCode(code) {
    this[symb].response.statusCode = code;
    return this;
  }
  
  json(data) {
    this.setHeader('content-type', 'application/json');
    this[symb].response.end(JSON.stringify(data), 'utf8');
  }
  
  send(arg) {
    this.setHeader('content-type', 'text/plain');
    this[symb].response.end(arg, 'utf8');
  }
  
};






































// /** *
// * application: load
// * 
// * powered by Moreira in 2019-04-10
// * 
// * http://www.typescriptlang.org/play/index.html
// */
 
// const log = (a, ...b) => console.log(a, __filename, ...b);
// log('loading...');

// const symb = Symbol();

// module.exports = class RouterHttp extends require('./router') {
  
//   constructor(options) {
//     super(options);
    
//     this[symb] = { 'response': options.response};
//     this[symb].query = this.isGetMethod ? require('url').parse(this.originalUrl, true).query : {};
    
//     const { request, response } = this;
    
//     if (this.isGetMethod) {
//       this[symb].query = require('url').parse(this.originalUrl, true).query;
//       this.do_(request, response);
//     }
    
//     else {
//       request.on('data', chunk => { 
//         this[symb].body = JSON.parse(chunk);
//       });
//       request.on('end', () => { 
//         this.do_(request, response);
//       });
//     }
    
//   }
    
//   do_(request, response) {

//     const { service, originalUrl, url, authorization } = this;
    
//     if (!service) {
//       this.statusCode(404).json({ 
//         'message': `${require('path').join(originalUrl.split(url)[0], url)} - not found!` 
//       });
//       return;
//     }
    
//     const 
//       Auth = require('./auth'),
//       _service = new service(this);
    
//     Auth.validate(authorization, _service.requiredAuthorization)
//     .then(({ token }) => {
//       _service.do_()
//       .then(({ code, result, headers = [] }) => {
        
//         if (token) headers.push(Auth.renew(token));
        
//         if (headers.length) headers.forEach(
//           arg => this.setHeader(arg[0], arg[1])
//         );
        
//         if (result) this.statusCode(code).json({ result });
//         else this.statusCode(code).send();
        
//       })
//       .catch(({ code = 500, message }) => {
//         if ('ERR_HTTP_INVALID_STATUS_CODE') code = 500;
//         console.warn(76, code, message);
//         this.statusCode(code).json({ message });
//       });
      
//     })
//     .catch(({ code, message }) => { 
//       this.statusCode(code).json({ message });
//     });
//   }
  
//   get response() {
//     return this[symb].response;
//   }
  
//   get query() {
//     return this[symb].query || {};
//   }
    
//   get body() {
//     return this[symb].body || (this[symb].body = {});
//   }
  
//   get isGetMethod() {
//     return 'GET' === this.method;
//   }
  
//   get hostname() {
//     return this.headers.host;
//   }
  
//   get ip() {
//     return this.headers['x-real-ip'];
//   }
  
//   get authorization() {
//     return this.headers.authorization || '';
//   }
  
//   setHeader(key, value) {
//     this.response.setHeader(key, value);
//     return this;
//   }
  
//   statusCode(code) {
//     this.response.statusCode = code;
//     return this;
//   }
  
//   json(data) {
//     this.setHeader('content-type', 'application/json');
//     this.response.end(JSON.stringify(data), 'utf8');
//   }
  
//   send(arg) {
//     this.setHeader('content-type', 'text/plain');
//     this.response.end(arg, 'utf8');
//   }
  
// };
