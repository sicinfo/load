/** *
 * application: load
 * 
 * powered by Moreira in 2019-05-05
 * 
 * http://www.typescriptlang.org/play/index.html
 */
 
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const 
  symb = Symbol();

module.exports = class extends require('./router-http') {
  
  constructor(request, response, options) {
    super(request, response, options);
    
    this[symb] = { request };
    
  }
  
  static do_(request, response) {
    
    const { service, originalUrl, url } = this;
    
    if (!service) {
      this.statusCode(404).json({ 
        'message': `${join(originalUrl.split(url)[0], url)} - not found!` 
      });
      return;
    }
    
    const _service = new service({
        originalUrl,
        url,
        'method': this.method,
        'authorization': this.authorization
      });
      
    Auth.validate(this.authorization, _service.requiredAuthorization)
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
        console.warn(code, message);
        return { code, message };
      });
      
    })
    .catch(({ code, message }) => { 
      this.statusCode(code).json({ message });
    });
  }
  
  get key() {
    return this[symb].key;
  }
    
  get rev() {
    return this[symb].rev;
  }
    
  get query() {
    return this[symb].query || {};
  }
    
  get body() {
    return this[symb].body || (this[symb].body = {});
  }
  
  get method() {
    return this[symb].request.method;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
  }
  
  get headers()  {
    return this[symb].request.headers;
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

  has(arg) {
    return arg in this[symb] || super.has(arg);
  }

};
