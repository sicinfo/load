"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weak = (m = new WeakMap()) => ({
    _new: a => m.set(a, new Map()),
    _set: (a, b, c) => m.get(a).set(b, c),
    _get: (a, b) => m.get(a).get(b),
    _has: (a, b) => m.get(a).has(b),
    _del: (a, b) => m.get(a).delete(b)
});
exports.atob = (a) => Buffer.from(a, 'base64').toString();
exports.log = (a) => {
    const log = (b, ...c) => console.log([a].concat(c).map((c, i) => `${i ? '-' : b} ${c}`).join('\n'));
    log('loading...');
    return log;
};
