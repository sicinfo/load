/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 */
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const symb = Symbol();
 
module.exports = class Service {
  
  constructor(router) {
    this[symb] = Object.assign(...[
        'protocol',
        'dirname',
        'ip',
        'method',
        'authorization'
      ].map(k => (a => (a[k] = router[k], a))({})));

    [ 
      this[symb].key, 
      this[symb].rev 
    ] = router.url
      .split('?')[0]
      .split('/')
      .slice(2)
      .concat([undefined, undefined]);
  }
  
  get requiredAuthorization() {
    return false;
  }
  
  get protocol() {
    return this[symb].protocol;
  }
  
  get dirname() {
    return this[symb].dirname;
  }
  
  get key() {
    return this[symb].key;
  }

  get rev() {
    return this[symb].rev;
  }
  
  get ip() {
    return this[symb].ip;
  }
  
  get method() {
    return this[symb].method;
  }
  
  get authorization() {
    return this[symb].authorization;
  }
  
  get isAuthorized() {
    return !!this.authorization;
  }
  
  get isGetMethod() {
    return 'GET' === this.method;
  }
  
};
















// /** *
// * application: load
// * 
// * powered by Moreira in 2019-04-10
// */
// const log = (a, ...b) => console.log(a, __filename, ...b);
// log('loading...');

// const symb = Symbol();
 
// module.exports = class Service {
  
//   constructor(options) {
//     this[symb] = {}
    
//     [
//       'protocol', 
//       'dirname'
//     ].forEach(key => { this[symb][key] = options[key] });

//     [ 
//       this[symb].key, 
//       this[symb].rev 
//     ] = options.url.split('?')[0].split('/').slice(2).concat([undefined, undefined]);
//   }
  
//   _do() {}
  
//   get requiredAuthorization() {
//     return false;
//   }
  
//   get protocol() {
//     return this[symb].protocol;
//   }
  
//   get key() {
//     return this[symb].key;
//   }

//   get rev() {
//     return this[symb].rev;
//   }
  
//   get dirname() {
//     return this[symb].dirname;
//   }
// };