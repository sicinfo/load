/**
 * application: load
 *
 * updated by Moreira in 2019-07-26
 *
 * powered by Moreira in 2019-04-10
 *
 * http://www.typescriptlang.org/play/index.html
 *
 * https://jsdoc.app/tags-type.html
 */
const log = require('sicinfo-load').Utils.log(__filename);

const 
  URL = require('url'),
  { join } = require('path'),
  {
    ContentTypeTextPlain,
    ContentTypeApplicationJson
  } = require('sicinfo-load'),
  $ = Symbol();

/** @exports Router */
module.exports = class {

  constructor(props = {}) {
    this[$] = { props };

    if (!(props.req && props.res)) return;

    const createService = () => { new this.service(this) };

    this.isPatchOrPostOrPutMethod ?

      props.req.setEncoding('utf8')
        .on('data',
          /** @param {string} chunk */
          chunk => { this[$].body = chunk ? JSON.parse(chunk) : {} }
        )
        .on('end', createService)
        .on('error', createService) :
      
      createService();
  }

  reject(err = {}) {
    let { headers = new Map(), message } = err;

    if (message) headers.set(...ContentTypeTextPlain);
    else {
      message = JSON.stringify({ message: err });
      headers.set(...ContentTypeApplicationJson);
    }

    const { res } = this[$].props;
    for (const [k, v] of headers) res.setHeader(k, v);
    res.statusCode = isNaN(err.code) ? 502 : 1 * err.code;
    res.end(message);
  }

  resolve(arg = {}) {

    const { res } = this[$].props;
    if (!res) return;

    const { headers = new Map(), result, code } = arg;

    for (const [k, v] of headers) res.setHeader(k, v);

    if (undefined === result) {
      res.statusCode = isNaN(code) ? 204 : code;
      res.end();
    }

    else {
      res.statusCode = isNaN(code) ? 200 : code;
      res.setHeader(...ContentTypeApplicationJson);
      res.end(JSON.stringify({ result }));
    }

  }

  get appDescription() {
    return this[$].props.description;
  }

  get appName() {
    return this[$].props.appName;
  }

  get appVersion() {
    return this[$].props.version;
  }

  get body() {
    return this[$].body || (
      this[$].body = {}
    );
  }

  get dirName() {
    return this[$].props.dirName;
  }

  get dirServices() {
    return this[$].dirServices || (
      this[$].dirServices = this[$].props.dirServices || 'services'
    )
  }

  get envName() {
    return this[$].props.envName;
  }

  get headers() {
    return this[$].req_headers || (
      this[$].req_headers = this[$].props.req && this[$].props.req.headers || {}
    );
  }

  get isOptionsMethod() {
    return 'OPTIONS' === this.method;
  }

  get isDeleteMethod() {
    return 'DELETE' === this.method;
  }

  get isGetMethod() {
    return 'GET' === this.method;
  }

  get isPatchMethod() {
    return 'PATCH' === this.method;
  }

  get isPostMethod() {
    return 'POST' === this.method;
  }

  get isPutMethod() {
    return 'PUT' === this.method;
  }

  get isPatchOrPostOrPutMethod() {
    return this.isPatchMethod || this.isPostMethod || this.isPutMethod;
  }

  get method() {
    return this[$].method || (
      this[$].method = this[$].props.req && this[$].props.req.method
    );
  }

  get query() {
    return this[$].query || (({ url } = this[$].props.req || {}) =>
      this[$].query = url ? Object.assign({}, URL.parse(url, true).query) : {}
    )();
  }

  get service() {
    return this[$].service || (
      this[$].service = this[$].props.service || (() => {

        const url = this.url, _url = url.splice(0);
        let service, name;

        do {
          const _name = _url.pop();
          if (!_name) continue;

          const dirServices = join(this.dirName, this.dirServices, ..._url);

          if (isNaN(_name)) try {

            service = require(join(dirServices, `${_name}-service`));
            name = _name

          } catch (err) {

            if (url[0]) try {

              service = require(join(dirServices, `${_name}-service`, `${url[0]}-service`));
              name = url[0];

            } catch (err) {

              'MODULE_NOT_FOUND' === err.code ||
              log(231, err.stack);

            }

            else {

              'MODULE_NOT_FOUND' === err.code ||
              log(224, err.stack);

            }

          }

          url.unshift(_name);
        } while (_url.length && !service);

        // log(229, !!service, ..._url, '*', ...url, '*');

        return service || require('./service');
      })()
    );
  }

  get url() {
    return this[$].url || (
      this[$].url = this[$].props.url || []
    );
  }

}