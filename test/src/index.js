/**
 * application: load
 * module: test/index.js
 */
const log = require('sicinfo-load').Utils.log(__filename);

module.exports = class extends require('sicinfo-load').Router {};