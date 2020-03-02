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
  server = require('../src/index'),
  env = process.env,
  PORT = 8082,
  HOST = '0.0.0.0',
  APPSDIR = 'dist';
  
env.cwd = __dirname;

(function() { describe('Tests to suite RouterHttp', () => {

  describe('General API', () => {
    
    const 
      RouterHttp = require('../src/routerhttp'),
      request = {
        'method': 'GET',
        'headers': {
          'authorization': 'bared'
        }
      },
      response = {
        'setHeader': () => {},
        'end': () => {}
      },
      options = {
        'originalUrl': '/TEST/http/test/1/2?nome=jose',
        'url': '/test/1/2?nome=jose',
        'dirname': join(__dirname, 'dist', 'TEST-test')      
      };
    
    it('should be defined', () => {
      expect(RouterHttp).to.be.a('function');
    });
    
    let routerHttp;
    
    it('should be defined a constructor', () => {
      expect(() => RouterHttp(), 'throw').to.throw();
      expect(RouterHttp, 'constructor').to.have.property('constructor');
      expect(routerHttp = new RouterHttp(request, response, options), 'instance').to.be.an.instanceof(RouterHttp);
    });

    it('should be defined hinherit properties - originalUrl', () => {
      expect(routerHttp, 'originalUrl').to.have.property('originalUrl').to.equal(options.originalUrl);
    });

    it('should be defined hinherit properties - url', () => {
      expect(routerHttp, 'url').to.have.property('url').to.equal(options.url);
    });

    it('should be defined hinherit properties - dirname', () => {
      expect(routerHttp, 'dirname').to.have.property('dirname').to.equal(options.dirname);
    });

    it('should be defined hinherit properties - dirservices', () => {
      expect(routerHttp, 'dirservices').to.have.property('dirservices').to.equal('services');
    });

    it('should be defined properties - authorization', () => {
      expect(routerHttp, 'authorization')
        .to.have.property('authorization')
        .to.equal(request.headers.authorization);
    });

    it('should be defined properties - key', () => {
      expect(routerHttp, 'key - 1').to.have.property('key').to.equal('1');
      expect(routerHttp, 'key - 1').to.have.property('key').to.equal('1');
    });

    it('should be defined properties - rev', () => {
      expect(routerHttp, 'rev - 2').to.have.property('rev').to.equal('2');
      expect(routerHttp, 'rev - 2').to.have.property('rev').to.equal('2');
    });

    it('should be defined properties - query', () => {
      expect(routerHttp, 'query an object').to.have.property('query').to.be.a('object');
      expect(routerHttp.query.nome, 'query.nome').to.equal('jose');
    });

    it('should be defined properties - method', () => {
      expect(routerHttp, 'method').to.have.property('method').to.equal(request.method);
    });
    
  //   it('should be defined an service', () => {
  //     let 
  //     options = {
  //         'originalUrl': 'originalUrl',
  //         'url': '/test',
  //         'dirname': join(__dirname, 'dist', 'TEST-test'),
  //     },
  //     routerHttp = new RouterHttp(options);
      
  //     expect(routerHttp, 'has defined').to.have.property('service').to.be.an('function');
  //     expect(new routerHttp.service(), 'instance').to.be.an.instanceof(routerHttp.service);
  //     expect(() => routerHttp.service(), 'is an class').to.throw();
    
  });

})})();
