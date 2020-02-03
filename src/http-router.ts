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

import { log } from './utils'
log(__filename)

const _sym: symbol = Symbol()

export interface IHttpRouter {
  readonly method: string
  send(a:any): void
}

interface IContructor {
  response: any
  request: any
  locals: any
  url: []
  service?: any
}

export default class HttpRouter implements IHttpRouter {
  
  constructor(args: IContructor) {
    this[_sym] = args;
    let { service, locals = {}, url = [] } = args;
    
    if (!service) { 
      /**
       * verifica atributos:
       * service, serviceName, key, rev
       */
       
      const 
        { join } = require('path'),
        { dirservices } = this,
        { dirname } = locals,
        _url = url.splice(0);
        
      do { 
        // pega o último
        const 
          arg = _url.pop(),
          dir = [dirname, dirservices, ..._url]

        // _log(41, arg);
        if (!arg) continue;
        
        if (isNaN(arg)) {

          // _log(42, dir, `${arg}-service`);          
          try {
            const _file = join(...dir, `${arg}-service`);

            // _log(43, _file);             
            service = require(_file)

            // _log(44, service);
            url.unshift(arg);
            break;
          } catch (e) {
            //  _log(45, e.message) 
          }

          // _log(46, url[0]);
          if (url[0]) try {
            const _file = join(...dir, `${arg}-service`, `${url[0]}-service` );

            // _log(47, _file);
            service = require(_file)

            // _log(48, service);
            break;
          } catch (e) {
            //  _log(49, e.message);
          }
          
        }
        
        url.unshift(arg);
      } while (_url.length);
  
      // _log(70, url, _url, service)    ;
      
    }
    
    this[_sym].service = service;
    this[_sym].url = url;

    const reject = (err: any) => {
      let { code, message, syscall } = err;
      console.warn('http-router', 'code', code);
      console.warn('http-router', 'message', message);
      console.warn('http-router', 'syscall', syscall);
      console.warn('http-router', err.class);
      undefined === code || null === code || isNaN(code) &&
      ([code, message] = [500, `${code} - ${message}`]);
      this.statusCode(code || 500).sendText(message);
    };
      
    if (!this.service) reject({
      // 'code': this.serviceName, 
      'message': `service not found`
    });

    else {

      const 
        resolve = ({ code, result, headers = [] }: any) => {
          headers.some(([key, val]: string[]) => { this.setHeader(key, val) });
          if (result) this.statusCode(code || 200).sendJson({ result });
          else this.statusCode(code || 204).sendText();
        },

        initialize = () => new this.service(this, resolve, reject);
      
      if (this.isPostOrPutOrPatchMethod) {
        this.request.setEncoding('utf8');
        this.request.on('data', chunk => { if (chunk) this[_sym].body = JSON.parse(chunk) });
        this.request.on('end', initialize);
        this.request.on('error', initialize);
      }
      else initialize();
    }

  }
  
  get body() {
    return this[_sym].body
  }
  
  get dirservices(): string {
    return `services`;
  }

  get headers() {
    return this.request.headers;
  }
  
  get hostname(): string {
    return this.headers.host;
  }

  get isDeleteMethod(): boolean {
    return 'DELETE' === this.method;
  }
  
  get isGetMethod(): boolean {
    return 'GET' === this.method;
  }
  
  get isGetOrDeleteMethod(): boolean {
    return this.isGetMethod || this.isDeleteMethod;
  }
  
  get isOptionsMethod(): boolean {
    return 'OPTIONS' === this.method;
  }
  
  get isPatchMethod(): boolean {
    return 'PATCH' === this.method;
  }
  
  get isPostMethod(): boolean {
    return 'POST' === this.method;
  }
  
  get isPostOrPutOrPatchMethod(): boolean {
    return this.isPostMethod || this.isPutMethod || this.isPatchMethod;
  }
  
  get isPutMethod(): boolean {
    return 'PUT' === this.method;
  }

  get method(): string {
    return this.request.method;
  }
  
  get query() {
    return (
      Reflect.has(this[_sym], 'query') ||
      Reflect.set(this[_sym], 'query',
        require('url').parse(this.request.url, true).query
      )
    ) && Reflect.get(this[_sym], 'query')
  }

  get request() {
    return this[_sym].request;
  }

  get response() {
    return this[_sym].response;
  }

  get service() {
    return this[_sym].service;
  }

  get url(): [] {
    return this[_sym].url;
  }
  
  setHeader(key: string, val: string)  {
    this.response.setHeader(key, val);
    return this;
  }

  hasHeader(key: string): boolean {
    return this.response.hasHeader(key);
  }
              
  statusCode(code: number) {
    this.response.statusCode = code;
    return this;
  }
  
  sendJson(data = {}) {
    this.setHeader(
      'content-type', 
      'application/json'
    ).send(JSON.stringify(data));
  }
  
  sendText(arg: string = '') {
    this.setHeader(
      'content-type', 
      'text/plain'
    ).send(arg)
  }

  send(arg: any): void {
    this.response.end(arg, 'utf8');
  }

};

module.exports = HttpRouter;
