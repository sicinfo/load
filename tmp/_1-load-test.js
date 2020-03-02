/**
 * application: myutils
 * 
 * powered by
 * 
 * require
 * npm install mocha
 */
'use strict';
const { log } = console;

process.env.NODE_ENV = 'dev';

const 
  { expect } = require('chai'), 
  { assign, keys } = Object,
  { join } = require('path'),
  http = require('http'),
  server = require('../src/index'),
  env = process.env,
  PORT = 8082,
  HOST = '0.0.0.0',
  APPSDIR = 'dist';
  

env.cwd = __dirname;

(function() {

  describe('Tests to suite load', () => {

    describe('General API', () => {

      env.CONFIG = JSON.stringify({
        'port': PORT,
        'host': HOST,
        'appsDir': 'dist'
      });
      
      const
        arg0 = {'method': 'GET'},
        arg1 = { 'protocol': 'HTTP' },
        arg2 = () => {},
        load = server(env);
          
      // load.headersTimeout = 4000;
      // load.listen();
      // load.close(() => { console.log('sistema fechado.') });
      
      it(`should be defined appsDir`, () => {
        expect(load.appsDir, 'tem que ser uma string').to.be.a('string');
      });

      it(`should be defined appsDir - ${join(__dirname, APPSDIR)}`, () => {
        expect(load.appsDir).to.equal(join(__dirname, APPSDIR));
      });

      it('should be defined route function', () => {
        expect(load.route).to.be.a('function');
      });
      
      it('should be defined route error messages', () => {
        expect(load.route(arg0, assign({ 'originalUrl': '/WS/test/test' }, arg1), arg2).message).to.equal('package.json');
        expect(load.route( arg0, assign({ 'originalUrl': '/TEST/test1/test1' }, arg1), arg2).message).to.equal('main: <executable.js>');
      });
      
      it('should be defined router class', () => {
        
        const 
          routeName = '/TEST/test',
          url = '/test',
          arg1a = assign({ 'originalUrl': `${routeName}${url}` }, arg1),
          result = load.route( arg0, arg1a, (router, options) => {
            expect(router, 'class router').to.be.a('function');
            expect(options, 'options').to.be.a('object');
            expect(options.protocol, 'protocol').to.equal(arg1.protocol);
            expect(options.originalUrl, 'originalUrl').to.equal(arg1a.originalUrl);
            expect(options.url, 'url').to.equal(url);
            expect(options.dirname, 'dirname').to.equal(join(__dirname, APPSDIR, routeName.split('/').slice(1).join('-')));
          });

        expect(result, '_routers').to.be.a('object');
        expect(keys(result)[0], '_routers - key 0').to.equal(arg1.protocol);
        expect(routeName in result[arg1.protocol], '_routers - should be define routeName').to.be.true;
        expect(result[arg1.protocol][routeName], '_routers - routeName').to.be.an('array');
        expect(result[arg1.protocol][routeName][0], '_routers - routeName - class').to.be.a('function');
        expect(result[arg1.protocol][routeName][1], '_routers - routeName - options').to.be.a('object');
      });
        
      it(`should be defined port - ${PORT}`, () => {
        expect(load.port).to.be.a('number');
        expect(load.port).to.equal(PORT);
      });
      
      it(`should be defined host - ${HOST}`, () => {
        expect(load.host).to.be.a('string');
        expect(load.host).to.equal(HOST);
      });
      
    });

  });

})();
