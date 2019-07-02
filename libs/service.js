/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 */
const log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const symb = Symbol();
 
module.exports = class Service {
  
  constructor(arg) {
    this[symb] = { arg };
  }
  
  get requiredAuthorization() {
    return false;
  }
  
  get protocol() {
    return this[symb].arg.protocol;
  }
  
  get dirname() {
    return this[symb].arg.dirname;
  }
  
  get key() {
    return this[symb].arg.url.split('?')[0].split('/')[2];
  }

  get rev() {
    return this[symb].arg.url.split('?')[0].split('/')[3];
  }
  
  get ip() {
    return this[symb].arg.ip;
  }
  
  get method() {
    return this[symb].arg.method;
  }
  
  get authorization() {
    return this[symb].arg.authorization;
  }
  
  get isAuthorized() {
    return !!this.authorization;
  }
  
  get isGetMethod() {
    return this[symb].arg.isGetMethod;
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