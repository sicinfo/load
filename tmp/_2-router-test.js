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
  { log } = console,
  { expect } = require('chai'), 
  { assign, keys } = Object,
  { join } = require('path'),
  http = require('http'),
  server = require('../libs/index'),
  env = process.env,
  PORT = 8082,
  HOST = '0.0.0.0',
  APPSDIR = 'dist';
  
env.cwd = __dirname;

(function() { describe('Tests to suite router', () => {

  describe('General API', () => {
    
    const Router = require('../libs/router');
    
    it('should be defined', () => {
      expect(Router).to.be.a('function');
    });
    
    it('should be defined a constructor', () => {
      expect(new Router()).to.be.an.instanceof(Router);
      expect(() => Router()).to.throw();
      expect(Router).to.have.property('constructor');
    });
    
    it('should be defined properties', () => {
      let 
      options = {
          'originalUrl': 'originalUrl',
          'url': 'url',
          'dirname': 'dirname',
      },
      router = new Router(options);
      
      expect(router, 'originalUrl').to.have.property('originalUrl').to.equal('originalUrl');
      expect(router, 'url').to.have.property('url').to.equal('url');
      expect(router, 'dirname').to.have.property('dirname').to.equal('dirname');
      expect(router, 'dirservices').to.have.property('dirservices').to.equal('services');
    });
    
    it('should be defined an service', () => {
      let 
      options = {
          'originalUrl': 'originalUrl',
          'url': '/test',
          'dirname': join(__dirname, 'dist', 'TEST-test'),
      },
      router = new Router(options);
      
      expect(router, 'has defined').to.have.property('service').to.be.an('function');
      expect(new router.service(), 'instance').to.be.an.instanceof(router.service);
      expect(() => router.service(), 'is an class').to.throw();
    });
    
  });

})})();
