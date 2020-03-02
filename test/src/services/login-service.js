/**
 * application: load-test
 */
const 
  { 
    Utils, 
    Service, 
    Auth, 
    AccessControlAllowHeaders,
    AccessControlAllowMethods,
    AccessControlAllowOrigin,
    AccessControlExposeHeaders,
    AccessControlRequestMethod,
    AccessControlMaxAge, 
    ContentType 
  } = require('sicinfo-load'),
  log = Utils.log(__filename),
  AccessControlExposeHeadersOptions = [AccessControlExposeHeaders, `${ContentType}, ${Auth.AUTHORIZATION}`];

module.exports = class extends Service {

  doGet() {
    return Promise.resolve({ 
      headers: new Map([this.createAuth({iss:'login'})]),
      result: {} 
    });
  }

  doOptions() {

    const headers = new Map(
      this.router.headers.origin &&
      this.router.headers[AccessControlRequestMethod] && [
        [AccessControlMaxAge, '30'],
        [AccessControlAllowHeaders, `${ContentType}, ${Auth.AUTHORIZATION}`],
        // [AccessControlExposeHeaders, `${ContentType}, ${Auth.AUTHORIZATION}`],
        // [AccessControlAllowMethods, 'OPTIONS, GET, POST, PATCH, DELETE, PUT'],
        [AccessControlAllowMethods, this.router.headers[AccessControlRequestMethod]],
        [AccessControlAllowOrigin, this.router.headers.origin]
      ] || []);

    return Promise.resolve({ headers });
  }

}

