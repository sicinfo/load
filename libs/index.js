/**
 * @module sicinfo-load
 * https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
 */

if ('test' !== process.env.NODE_ENV) require('./load');

module.exports = (root => {

  const $ = class {

    static get Auth() { return require('./auth') }
    static get Router() { return require('./router') }
    static get Service() { return require('./service') }
    static get Utils() { return require('./utils') }

    static get AccessControlAllowCredentials()    { return 'access-control-allow-credentials' }
    static get AccessControlRequestCredentials()  { return 'access-control-request-credentials' }

    static get AccessControlRequestMethod()       { return 'access-control-request-method' }
    static get AccessControlAllowMethods()        { return 'access-control-allow-methods' }

    static get AccessControlRequestHeaders()      { return 'access-control-request-headers' }
    static get AccessControlAllowHeaders()        { return 'Access-Control-Allow-Headers' }
    static get AccessControlAllowOrigin()         { return 'access-control-allow-origin' }
    static get AccessControlExposeHeaders()       { return 'access-control-expose-headers' }

    static get AccessControlMaxAge()              { return 'access-control-max-age' }

    /** @param {*} arg @return boolean */
    static isWithCredentials(arg) { return arg[$.AccessControlRequestHeaders] === $.WithCredentials }
    static get WithCredentials() { return 'withcredentials'}

    static get ContentType() { return 'content-type' }
    static get ContentTypeApplicationJson() { return [this.ContentType, 'application/json; charset=utf-8'] }
    static get ContentTypeTextPlain() { return [this.ContentType, 'text/plain; charset=utf-8'] }

  }

  return $;
})(this);
