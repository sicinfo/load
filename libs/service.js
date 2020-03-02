/**
  * application: load
  *
  * updated by Moreira in 2019-07-28
  *
  * powered by Moreira in 2019-04-10 *
 */
const 
  Utils = require('./utils'),
  log = Utils.log(__filename);

 /**
  * @typedef {{ error?:any, iss?:string }} IsAuthorization
  * @typedef {{ props:any, authorization:IsAuthorization }} IsThis
  */

const 
  Router = require('./router'),
  Auth = require('./auth'),
  $ = Symbol();

const parseNull = a => 'string' === typeof(a) && !a.length ? null : a;

/** @exports Service */
module.exports = class {

  constructor(props = new Router()) {
    this[$] = { props, token: {} };

    if (!props.method) return;

    this.validate.then(
      /** @param {*} token */
      token => {
        this[$].token = token;
        return this.doHttp();
      }
    ).then(arg => {
      props.resolve(arg);
    }).catch(err => {

      log(59, ...Object.entries(err));
      log(60, err.stack);

      log(61, this.router.method, this.authorization, this.isAuthorized);

      props.reject(err);
    });

  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doHttp(opts) {
    return new Promise((resolve, reject) => {
      
      const { method } = this.router;
      if (!method) return reject({ code: 405 });

      this[`do${method[0]}${method.slice(1).toLowerCase()}`](opts).then(
        /** @param {*} arg */
        (arg = {}) => {
          const headers = arg.headers || (arg.headers = new Map());
          if (this.isAuthorized) {
            headers.set(Auth.AUTHORIZATION, Auth.renew(this.authorization));
          }
          resolve(arg);
        }
      ).catch(reject);
    });
  }

//     return this.router.method ?

//       this[`do${this.router.method[0]}${this.router.method.slice(1).toLowerCase()}`]()
//         .then( /** @param {*} arg */ (arg = {}) => {

// log(51, ...Object.entries(this.authorization), arg.headers && arg.headers.get(Auth.AUTHORIZATION));

//           if (!(arg.headers && arg.headers.get(Auth.AUTHORIZATION)) && this.authorization.iss) {
//             if (undefined === arg.headers) arg.headers = new Map();
//             arg.headers.set(...Auth.renew(this.authorization));
//           }

// log(73, ...arg.headers.entries());

//           return arg;
//         }
//       ) :

//       Promise.reject({ code: 405 });

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doDelete(opts) {
    return Promise.reject({'code': 405, 'message': 'Method Delete Not Allowed'});
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doGet(opts) {
    return this[`doGetBy${this.id ? 'Id' : this.key ? 'Key': 'Query'}`](opts);
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doGetById(opts) {
    return Promise.reject({'code': 405, 'message': 'Method GetById Not Allowed'});
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doGetByKey(opts) {
    return Promise.reject({'code': 405, 'message': 'Method GetByKey Not Allowed'});
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doGetByQuery(opts) {
    return Promise.reject({'code': 405, 'message': 'Method GetByQuery Not Allowed'});
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doOptions(opts) {
    return Promise.reject({'code': 405, 'message': 'Method Options Not Allowed'});

    // // log(152, this.requiredAuthorization, ...Object.entries(this.router.headers));

    // const headers = new Map(
    //   this.router.headers.origin &&
    //   this.router.headers[AccessControlRequestHeaders] === WithCredentials &&
    //   this.router.headers[AccessControlRequestMethod] &&
    //   [
    //     // [AccessControlMaxAge, '3600'],

    //     [AccessControlMaxAge, '30'],
    //     [AccessControlAllowCredentials, true],

    //     // [AccessControlAllowHeaders, `${ContentType}, ${Auth.AUTHORIZATION}`],
    //     // ['Access-Control-Allow-Headers', 'content-type, authorization'],
    //     // ['Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT'],

    //     // [AccessControlAllowHeaders, Auth.AUTHORIZATION ],

    //     // [AccessControlAllowHeaders, `${ContentType}, ${Auth.AUTHORIZATION}, withcredentials`],
    //     [AccessControlAllowHeaders, WithCredentials],
    //     // [AccessControlExposeHeaders, `${ContentType}, ${Auth.AUTHORIZATION}`],

    //     [AccessControlAllowMethods, this.router.headers[AccessControlRequestMethod]],

    //     [AccessControlAllowOrigin, this.router.headers.origin]

    //   ] || []);

    // return Promise.resolve({ headers });
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doPatch(opts) {
    return Promise.reject({'code': 405, 'message': 'Method Patch Not Allowed'});
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doPost(opts) {
    return Promise.reject({code: 405, 'message': 'Method Post Not Allowed'});
  }

  /**
   * @param {*} [opts]
   * @return {promise}
   */
  doPut(opts) {
    return Promise.reject({'code': 405, 'message': 'Method Put Not Allowed'});
  }

  get router() {
    return this[$].props;
  }

  get id() {
    return this.router.url[1];
  }

  get key() {
    return this.router[this.router.isPatchOrPostOrPutMethod ? 'body' : 'query']._key;
  }

  get from() {
    return this.router[this.router.isPatchOrPostOrPutMethod ? 'body' : 'query']._from;
  }

  get to() {
    return this.router[this.router.isPatchOrPostOrPutMethod ? 'body' : 'query']._to;
  }

  get body() {
    return this[$].body || (() => (
      this[$].body = Object.entries(this.router.body || {})
        .reduce((a, [k, v]) => '_' !== k[0] && !Reflect.set(a, k, parseNull(v)) || a, {})
    ))();
  }

  get query() {
    return this[$].query || (() => (
      this[$].query = Object.entries(this.router.query || {})
        .reduce((a, [k, v]) => '_' !== k[0] && !Reflect.set(a, k, v) || a, {})
    ))();
  }

  get validate() {
    return this.router.isOptionsMethod ?
      Promise.resolve({}) :
      Auth.validate(
        this.router.headers.authorization || '',
        this.requiredAuthorization
      );
  }

  get authorization() {
    return this[$].token;
  }

  /** @return {boolean} */
  get requiredAuthorization() {
    return false;
  }

  /** @return {boolean} */
  get isAuthorized() {
    const { iss, iat, exp } = this.authorization;
    return !!(iss && iat && exp);
  }

  /** @return {number} */
  get expiresIn() {
    return 60 * 60; // 1 hora
  }

  /** @param {*} arg @param {*} opts @return {[string, string]} */
  createAuth(arg = {}, opts = {}) {
    if (!opts.expiresIn) opts.expiresIn = this.expiresIn;
    return [Auth.AUTHORIZATION, Auth.create(arg, opts)];
  }

}