/**
 * aplication: load
 * module: test/src/config-service
 * 
 * powered by moreira 2020-02-12
 */

const 
  { AccessControlRequestMethod, Utils, Service } = require('sicinfo-load'),
  log = Utils.log(__filename);

module.exports = class extends Service {

  doOptions() {

log(16, this.router.headers && this.router.headers[AccessControlRequestMethod])    

    return 'POST' === this.router.headers[AccessControlRequestMethod] ?
    Promise.reject({code:401}) : super.doOptions();
  }

  doDelete() {
    return Promise.resolve({ 
      result: { method: 'doDelete', id: this.id } 
    });
  }
  
  doGetByQuery() {
log(29)    ;
    return Promise.resolve({ 
      result: [{ method: 'doGetByQuery' }] 
    });
  }

  doGetById() {
    return Promise.resolve({ 
      result: { method: 'doGetById', id: this.id } 
    });
  }

  doGetByKey() {
    this.router.query.method = 'doGetByKey';
    return Promise.resolve({
      result: this.router.query 
    });
  }

  doPatch() {
    this.router.body.method = 'doPatch';
    this.router.body.id = this.id;
    return Promise.resolve({ result: this.router.body });
  }

  doPost() {
    this.router.body.method = 'doPost';
    return Promise.resolve({ result: this.router.body });
  }

  doPut() {
    this.router.body.method = 'doPut';
    this.router.body.id = this.id;
    return Promise.resolve({ result: this.router.body });
  }

}
