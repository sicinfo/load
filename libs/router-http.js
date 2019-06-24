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

module.exports = class RouterHttp extends require('./router') {
  
  constructor(options) {
    super(options);
    
    this[symb] = { 'response': options.response};
    this[symb].query = this.isGetMethod ? require('url').parse(this.originalUrl, true).query : {};
    
    const { request, response } = this;
    
    if (this.isGetMethod) {
      this[symb].query = require('url').parse(this.originalUrl, true).query;
      this.do_(request, response);
    }
    
    else {
      request.on('data', chunk => { 
        this[symb].body = JSON.parse(chunk);
      });
      request.on('end', () => { 
        this.do_(request, response);
      });
    }
    
  }
    
  do_(request, response) {

    const { service, originalUrl, url, authorization } = this;
    
    if (!service) {
      this.statusCode(404).json({ 
        'message': `${require('path').join(originalUrl.split(url)[0], url)} - not found!` 
      });
      return;
    }
    
    const 
      Auth = require('./auth'),
      _service = new service(this);
    
    Auth.validate(authorization, _service.requiredAuthorization)
    .then(({ token }) => {
      _service.do_()
      .then(({ code, result, headers = [] }) => {
        
        if (token) headers.push(Auth.renew(token));
        
        if (headers.length) headers.forEach(
          arg => this.setHeader(arg[0], arg[1])
        );
        
        if (result) this.statusCode(code).json({ result });
        else this.statusCode(code).send();
        
      })
      .catch(({ code = 500, message }) => {
        if ('ERR_HTTP_INVALID_STATUS_CODE') code = 500;
        console.warn(76, code, message);
        this.statusCode(code).json({ message });
      });
      
    })
    .catch(({ code, message }) => { 
      this.statusCode(code).json({ message });
    });
  }
  
  get response() {
    return this[symb].response;
  }
  
  get query() {
    return this[symb].query || {};
  }
    
  get body() {
    return this[symb].body || (this[symb].body = {});
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
