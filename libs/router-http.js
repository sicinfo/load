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
  
  constructor(arg) {
    super(arg);
    this[symb] = { arg };
  
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
  
  get dbconfig() {
    return this[symb].arg.dbconfig;
  }
  
  setHeader(key, value) {
    this[symb].arg.response.setHeader(key, value);
    return this;
  }
  
  statusCode(code) {
    this[symb].arg.response.statusCode = code;
    return this;
  }
  
  json(data) {
    this.setHeader('content-type', 'application/json');
    this[symb].arg.response.end(JSON.stringify(data), 'utf8');
  }
  
  send(arg) {
    this.setHeader('content-type', 'text/plain');
    this[symb].arg.response.end(arg, 'utf8');
  }
  
};