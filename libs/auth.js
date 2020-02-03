"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const jsonwebtoken_1 = require("jsonwebtoken");
utils_1.log(__filename);
const secret = `${process.env.username}${process.env.HOSTNAME}`;
exports.BEARED = 'Beared';
exports.AUTHORIZATION = 'authorization';
exports.expiresIn = 60 * 60;
class Auth {
    static sign(arg = {}, opts = {}) {
        return [exports.AUTHORIZATION, `${exports.BEARED} ${jsonwebtoken_1.default.sign(arg, secret, opts)}`];
    }
    static verify({ authorization }) {
        const [type, value] = (authorization || ' ').split(' ');
        return new Promise((resolve, reject) => {
            if (!type || type !== exports.BEARED || !value)
                reject({
                    'code': 401,
                    'message': 'jwt invalid'
                });
            else
                jsonwebtoken_1.default.verify(value, secret, {}, (err, token) => {
                    if (err)
                        reject(Object.assign(err, { 'code': 401 }));
                    else
                        resolve({ token });
                });
        });
    }
    static validate(authorization, requiredAuthorization) {
        return new Promise((resolve, reject) => {
            const [type, value] = (authorization || ' ').split(' ');
            if (!type || type !== exports.BEARED || !value) {
                if (requiredAuthorization)
                    reject({ 'code': 401, 'message': 'Unauthorized' });
                else
                    resolve({});
            }
            else
                jsonwebtoken_1.default.verify(value, secret, {}, (err, token) => {
                    if (err)
                        requiredAuthorization ?
                            reject(Object.assign(err, { 'code': 401 })) :
                            resolve({});
                    else
                        resolve({ token });
                });
        });
    }
    static create(arg = {}, opts = {}) {
        Reflect.has(opts, 'expiresIn') ||
            Reflect.set(opts, 'expiresIn', exports.expiresIn);
        Reflect.has(arg, 'stp') ||
            Reflect.set(arg, 'stp', 1 * opts.expiresIn);
        Reflect.has(arg, 'cnt') ||
            Reflect.set(arg, 'cnt', 0);
        return Auth.sign(arg, opts);
    }
    static renew(arg) {
        Reflect.set(arg, 'exp', Math.floor(Date.now() / 1000) + arg.stp);
        Reflect.set(arg, 'cnt', arg.cnt + 1);
        return Auth.sign(arg);
    }
}
exports.default = Auth;
;
