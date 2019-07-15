/** *
 * application: load
 * 
 * powered by Moreira in 2019-04-10
 */
const 
log = (a, ...b) => console.log(a, __filename, ...b);
log('loading...');

const symb = Symbol();

module.exports = class HttpService extends require('./abstract-service') {
  
  constructor(router) {
    super(router);
    this[symb] = { router };
  }
    
  do_get() {
    return this[`do_getBy${this.key ? 'Key': 'Query'}`]();
  }
  
  do_getByKey() {
    return new Promise((accept, reject) => accept({}));
  }
  
  do_getByQuery() {
    return new Promise((accept, reject) => accept({}));
  }
  
  do_delete() {
    return new Promise((accept, reject) => accept({}));
  }
  
  do_patch() {
    return new Promise((accept, reject) => accept({}));
  }
  
  do_post() {
    return new Promise((accept, reject) => accept({}));
  }
  
  do_put() {
    return new Promise((accept, reject) => accept({}));
  }

  get hasQuery() {
    return this[symb].router.hasQuery;
  }
  
  get query() {
    return this[symb].router.query;
  }
  
  get hasBody() {
    return this[symb].router.hasBody;
  }

  get body() {
    return this[symb].router.body;
  }

  
};



































// /** *
// * application: load
// * 
// * powered by Moreira in 2019-04-10
// */
// const 
// log = (a, ...b) => console.log(a, __filename, ...b), 
// warn = (a, ...b) => console.warn(a, __filename, ...b);
// log('loading...');


// const symb = Symbol();

// module.exports = class ServiceHttp extends require('./service') {
  
//   constructor(options) {
//     super(options);
    
//     this[symb] = ((...args) => {
//       const _options = {};
//       args.forEach(key => { _options[key] = options[key] });
//       return _options;
//     })('query', 'body', 'ip', 'method', 'authorization');
//   }
  
//   do_() {
    
//     return new Promise((accept, reject) => {
//         this[`do_${this.method.toLowerCase()}`](accept, reject);
//       })
//       .then(({ error, code, result, headers }) => {

//         if (error) return { code, error };

//         // const { _key, _rev } = arg;
//         // if (_key && _rev) result = (obj => (obj[`${_key}/${_rev}`] = {}, obj))({});
//         if (result) result = { result, 'code': code || 200 };
//         else result = { 'code': 204 };
        
//         if (headers) Object.assign(result, { headers });

//         return result;
//       })
//       .catch(err => {

//         warn(33, 'code', err.code);
//         warn(34, 'message', err.message);
//         warn(35, 'error', err.error);

//         return err;
//       });
        
//   }
    
//   do_get(...args) {
//     if (this.key) this.do_getByKey(...args);
//     else this.do_getByQuery(...args);
//   }
  
//   do_getByKey(accept, reject) {
//     accept({});
//   }
  
//   do_getByQuery(accept, reject) {
//     accept({});
//   }
  
//   do_delete(accept, reject) {
//     accept({});
//   }
  
//   do_patch(accept, reject) {
//     accept({});
//   }
  
//   do_post(accept, reject) {
//     accept({});
//   }
  
//   do_put(accept, reject) {
//     accept({});
//   }

//   get query() {
//     return this[symb].query;
//   }
  
//   get body() {
//     return this[symb].body;
//   }

//   get ip() {
//     return this[symb].ip;
//   }
  
//   get method() {
//     return this[symb].method;
//   }
  
//   get authorization() {
//     return this[symb].authorization;
//   }
  
//   get isAuthorized() {
//     return !!this.authorization;
//   }
  
// };