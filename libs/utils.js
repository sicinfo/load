/***
 * @module Utils
 *
 * powered by Moreira in 2020-01-31
 */

module.exports = (root => {

  /** @param {string} a */
  const atob = a => Buffer.from(a, 'base64').toString();

  /**
   * @param {*} a
 */
  const log = a => {

    /**
     * @param {*} b
     * @param {Array} c
     */
    const log = (b, ...c) => {

      let _a = 'log';
      if (1 == c.length && 'function' === typeof (c[0])) try {
        c = [c[0]()];
      } catch (err) {
        [_a, c] = ['warn', Object.entries(err)];
      }

      console[_a]([a].concat(c).map((c, i) => `${i ? '-' : b} ${c}`).join('\n'));
    };

    log('loading...');
    return log;

  }

  return { atob, log };
})(this);

// const weak = (m = new WeakMap()) => ({
//   _new: (a) => m.set(a, new Map()),
//   _set: (a, b, c) => m.get(a).set(b, c),
//   _get: (a, b) => m.get(a).get(b),
//   _has: (a, b) => m.get(a).has(b),
//   _del: (a, b) => m.get(a).delete(b)
// })

// /**
//  * @param {string} a
//  * @return {string}
//  */
// const atob = a => Buffer.from(a, 'base64').toString()


// module.exports = { log, weak, atob };
// module.exports = {};
