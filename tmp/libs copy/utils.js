/**
 * module: Load
 * 
 * powered by Moreira in 2020-01-31
 */

module.exports = {
  
  weak: (m = new WeakMap()) => ({
    _new: a => m.set(a, new Map()),
    _set: (a, b, c) => m.get(a).set(b, c),
    _get: (a, b) => m.get(a).get(b),
    _has: (a, b) => m.get(a).has(b),
    _del: (a, b) => m.get(a).delete(b)
  }),

  atob: a => Buffer.from(a, 'base64').toString(),

  log: a => {
    const log = (b, ...c) => console.log(
      [a].concat(c).map((c, i) => `${i ? '-' : b} ${c}`).join('\n')
    );
    return log('loading...') || log;
  }
  
}