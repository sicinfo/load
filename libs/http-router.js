"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
utils_1.log(__filename);
const _sym = Symbol();
class HttpRouter {
    constructor(args) {
        this[_sym] = args;
        let { service, locals = {}, url = [] } = args;
        if (!service) {
            const { join } = require('path'), { dirservices } = this, { dirname } = locals, _url = url.splice(0);
            do {
                const arg = _url.pop(), dir = [dirname, dirservices, ..._url];
                if (!arg)
                    continue;
                if (isNaN(arg)) {
                    try {
                        const _file = join(...dir, `${arg}-service`);
                        service = require(_file);
                        url.unshift(arg);
                        break;
                    }
                    catch (e) {
                    }
                    if (url[0])
                        try {
                            const _file = join(...dir, `${arg}-service`, `${url[0]}-service`);
                            service = require(_file);
                            break;
                        }
                        catch (e) {
                        }
                }
                url.unshift(arg);
            } while (_url.length);
        }
        this[_sym].service = service;
        this[_sym].url = url;
        const reject = (err) => {
            let { code, message, syscall } = err;
            console.warn('http-router', 'code', code);
            console.warn('http-router', 'message', message);
            console.warn('http-router', 'syscall', syscall);
            console.warn('http-router', err.class);
            undefined === code || null === code || isNaN(code) &&
                ([code, message] = [500, `${code} - ${message}`]);
            this.statusCode(code || 500).sendText(message);
        };
        if (!this.service)
            reject({
                'message': `service not found`
            });
        else {
            const resolve = ({ code, result, headers = [] }) => {
                headers.some(([key, val]) => { this.setHeader(key, val); });
                if (result)
                    this.statusCode(code || 200).sendJson({ result });
                else
                    this.statusCode(code || 204).sendText();
            }, initialize = () => new this.service(this, resolve, reject);
            if (this.isPostOrPutOrPatchMethod) {
                this.request.setEncoding('utf8');
                this.request.on('data', chunk => { if (chunk)
                    this[_sym].body = JSON.parse(chunk); });
                this.request.on('end', initialize);
                this.request.on('error', initialize);
            }
            else
                initialize();
        }
    }
    get body() {
        return this[_sym].body;
    }
    get dirservices() {
        return `services`;
    }
    get headers() {
        return this.request.headers;
    }
    get hostname() {
        return this.headers.host;
    }
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
    get query() {
        return (Reflect.has(this[_sym], 'query') ||
            Reflect.set(this[_sym], 'query', require('url').parse(this.request.url, true).query)) && Reflect.get(this[_sym], 'query');
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
    get url() {
        return this[_sym].url;
    }
    setHeader(key, val) {
        this.response.setHeader(key, val);
        return this;
    }
    hasHeader(key) {
        return this.response.hasHeader(key);
    }
    statusCode(code) {
        this.response.statusCode = code;
        return this;
    }
    sendJson(data = {}) {
        this.setHeader('content-type', 'application/json').send(JSON.stringify(data));
    }
    sendText(arg = '') {
        this.setHeader('content-type', 'text/plain').send(arg);
    }
    send(arg) {
        this.response.end(arg, 'utf8');
    }
}
exports.default = HttpRouter;
;
module.exports = HttpRouter;
