/**
 * application: myutils
 * 
 * powered by
 * 
 * require
 * npm install mocha
 */
'use strict';

process.env.NODE_ENV = 'dev';

const 
  { expect } = require('chai'),
  http = require('http'),
  server = require('../src/index'),
  env = process.env;

env.cwd = __dirname;

(function () {
  
  describe('make route test suite', () => {

    describe('General API', () => {
      
      env.CONFIG = JSON.stringify({
        'port': 3006, 'host': 'localhost', 'appsDir': 'dist'
      });

      const load = server(env);
      
      it('should be defined route', () => {
        expect(load.route).to.be.a('function');
      });

      it('should be defined port', () => {
        expect(load.port).to.be.a('number');
      });

      it('should be defined host', () => {
        expect(load.host).to.be.a('string');
      });
    
      it('should be defined appsDir', () => {
        expect(load.appsDir).to.be.a('string');
      });
    
      it('should be port 3006', () => {
        expect(load.port).to.equal(3006);
      });

      it('should be host localhost', () => {
        expect(load.host).to.equal('localhost');
      });

      it('should be defined appsDir', () => {
        expect(load.appsDir).to.be.a('string');
      });
    });

    describe(`Test appsDir`, () => {
      
      env.CONFIG = JSON.stringify({
        'port': 3007, 'host': 'localhost', 'appsDir': 'dist'
      });
      
      let 
        appsDir = `${process.env.cwd}/dist`,
        load = server(env);
      
      it(`should be appsDir ${appsDir}`, () => {
        expect(load.appsDir).to.equal(appsDir);
      });
      
      env.CONFIG = JSON.stringify({
        'port': 3008, 'host': 'localhost', 'appsDir': '~dist'
      });
      
      appsDir = `${process.env.HOME}/dist`,
      load = server(env);
      
      it(`should be appsDir ${appsDir}`, () => {
        expect(load.appsDir).to.equal(appsDir);
      });
      
      env.CONFIG = JSON.stringify({
        'port': 3009, 'host': 'localhost', 'appsDir': '/dist'
      });
      
      appsDir = `/dist`,
      load = server(env);
      
      it(`should be appsDir ${appsDir}`, () => {
        expect(load.appsDir).to.equal(appsDir);
      });
      
    });
    
    describe(`Test Router`, () => {
      
      env.CONFIG = JSON.stringify({
        'port': 3005, 'host': '0.0.0.0', 'appsDir': 'dist'
      });
      
      let load = server(env);
      load.listen();
      
      it(`should be receiver error: package.json - not found`, () => {
        http.request('http://localhost:3005/TEST', response => {
          response.setEncoding('utf8');
          response.on('data', chunk => {
            expect(chunk).to.equal(`{"message":"package.json - not found!"}`);
          });
        }).end();
      });

      it(`should be receiver error: main.js - not found`, () => {
        http.request('http://localhost:3005/TEST/test1', response => {
          response.setEncoding('utf8');
          response.on('data', chunk => {
            expect(chunk).to.equal('{"message":"main: <executable.js> - not found!"}');
          });
        }).end();
      });

      it(`should be receiver result: /TEST/test`, () => {
        http.request('http://localhost:3005/TEST/test', response => {
          response.setEncoding('utf8');
          response.on('data', chunk => {
            expect(chunk).to.equal('{"result":"/TEST/test"}');
          });
        }).end();
      });

    });

  });
  
})();
