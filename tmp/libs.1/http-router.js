/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 * 
 * http://www.typescriptlang.org/play/index.html
 */
 
const
log = (a, ...b) => console.log(a, __filename, ...b), 
warn = (a, ...b) => console.warn(a, __filename, ...b);
log('loading...');

const symb = Symbol();

module.exports = class RouterHttp extends require('./abstract-router') {
  
  constructor(http) {
    super(http);
    this[symb] = { http };
    
    let { service } = this;

    if (!service) {
      const { originalUrl, url } = this;
      this.statusCode(404).json({ 
        'message': `${require('path').join(originalUrl.split(url)[0], url)} - not found!` 
      });
      return;
    }
    
    const Auth = require('./auth');
    service = new service(this);
    
    Auth.validate(this.authorization, service.requiredAuthorization)
      .then(({ token }) => {
        service[`do_${this.method.toLowerCase()}`]()
          .then(({ code, result, headers = []}) => {
            
            if (token) headers.push(Auth.renew(token));
            headers.forEach(arg => this.setHeader(...arg));
            
            if (result) this.statusCode(code || 200).json({ result });
            else this.statusCode(code || 204).send();
          })
          .catch(({ code, error, message }) => {
            warn(33, 'code', code);
            warn(34, 'message', message);
            warn(35, 'error', error);
            this.statusCode(code || 500);
            if (message || error) this.json({ 'message': message || error });
            else this.send();
          });
      });
  }
  
  async getBody() {
    if (undefined === this[symb].body) 
      this[symb].body = await new Promise((accept, reject) => {
        const { request } = this[symb].http;
        request.on('data', chunk => accept(JSON.parse(chunk)));
        request.on('end', () => {});
        request.on('error', () => reject({}));
      });
    return this.hasBody && this[symb].body;
  }

  get hasBody() {
    if (undefined === this[symb].hasBody) 
      this[symb].hasBody = !!Object.keys(this.getBody()).length;
    return this[symb].hasBody;
  }
  
  getQuery() {
    if (undefined === this[symb].query)
      this[symb].query = require('url').parse(this.originalUrl, true).query;  
    return this[symb].query;
  }
    
  get hasBody() {
    if (undefined === this[symb].hasQuery) 
      this[symb].hasQuery = !!Object.keys(this.getQuery()).length;
    return this[symb].hasQuery;
  }

  setHeader(key, value) {
    this[symb].http.response.setHeader(key, value);
    return this;
  }
  
  statusCode(code) {
    this[symb].http.response.statusCode = code;
    return this;
  }
  
  json(data) {
    this.setHeader('content-type', 'application/json');
    this[symb].http.response.end(JSON.stringify(data), 'utf8');
  }
  
  send(arg) {
    this.setHeader('content-type', 'text/plain');
    this[symb].http.response.end(arg, 'utf8');
  }
  
};