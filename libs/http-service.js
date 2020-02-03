"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const _log = utils_1.log(__filename);
const _sym = Symbol();
class HttpService {
    constructor(router) {
        this.router = router;
    }
    doHttp() {
        const action = `do${this.method[0]}${this.method.slice(1).toLowerCase()}`;
        return new Promise((resolve, reject) => {
        });
    }
    doDelete() {
        return new Promise((resolve, reject) => { });
    }
    doGet() {
        return new Promise((resolve, reject) => { });
    }
    get method() {
        return this.router.method;
    }
}
exports.default = HttpService;
module.exports = HttpService;
