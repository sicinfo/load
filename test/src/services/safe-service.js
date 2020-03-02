/**
 * application: load-test
 */
const log = require('sicinfo-load').Utils.log(__filename);

module.exports = class extends require('sicinfo-load').Service {

  doGet() {
    return Promise.resolve({
      result: {}
    });
  }

  get requiredAuthorization() {
    return true;
  }

}

