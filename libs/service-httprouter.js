/** *
 * application: load
 * 
 * powered by Moreira in 2019-06-07
 */
const 
log = (a, ...b) => console.log(a, __filename, ...b), 
warn = (a, ...b) => console.warn(a, __filename, ...b);
log('loading...');


const symb = Symbol();

module.exports = class ServiceHttpRouter extends require('./service-http') {
  
  // do_()
  
  // constructor(router) {
    
  //   super(router);
  //   console.log(
      
  //     router.dirname, '\n',
  //     router.originalUrl, '\n',
  //     router.url, '\n',
  //     router.appname, '\n',
  //     router.dbconfig, '\n',
      
  //     this.key
      
      
  //     );
      

    
  }

  
};