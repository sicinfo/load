// /**
// * application: myutils
// * 
// * powered by
// * 
// * require
// * npm install mocha
// */
// 'use strict';

// process.env.NODE_ENV = 'dev';

// const { expect } = require('chai'), { join } = require('path'),
//   http = require('http'),
//   server = require('../dist/index'),
//   _router = require('../dist/router'),
//   _service = require('../dist/service'),
//   env = process.env;

// env.cwd = __dirname;

// (function() {

//   describe('Tests to suite load', () => {

//     describe('General API', () => {

//       env.CONFIG = JSON.stringify({
//         'port': 3005,
//         'host': 'localhost',
//         'appsDir': 'dist'
//       });

//       const load = server(env);
//       load.listen();


//       it('should be defined route', () => {
//         expect(load.route).to.be.a('function');
//       });

//       it('should be defined port', () => {
//         expect(load.port).to.be.a('number');
//       });

//       it('should be defined host', () => {
//         expect(load.host).to.be.a('string');
//       });

//       it('should be defined appsDir', () => {
//         expect(load.appsDir).to.be.a('string');
//       });

//       it('should be port 3006', () => {
//         expect(load.port).to.equal(3005);
//       });

//       it('should be host localhost', () => {
//         expect(load.host).to.equal('localhost');
//       });

//       it('should be defined appsDir', () => {
//         expect(load.appsDir).to.be.a('string');
//       });

//       it(`should be receiver error: package.json - not found`, () => {
//         http.request('http://localhost:3005/TEST', response => {
//           response.setEncoding('utf8');
//           response.on('data', chunk => {
//             expect(chunk).to.equal(`{"message":"package.json - not found!"}`);
//           });
//         }).end();
//       });

//       it(`should be receiver error: main.js - not found`, () => {
//         http.request('http://localhost:3005/TEST/test1', response => {
//           response.setEncoding('utf8');
//           response.on('data', chunk => {
//             expect(chunk).to.equal('{"message":"main: <executable.js> - not found!"}');
//           });
//         }).end();
//       });

//     });

//     describe(`Test appsDir`, () => {

//       env.CONFIG = JSON.stringify({
//         'port': 3007,
//         'host': 'localhost',
//         'appsDir': 'dist'
//       });

//       let
//         appsDir = `${process.env.cwd}/dist`,
//         load = server(env);

//       it(`should be appsDir ${appsDir}`, () => {
//         expect(load.appsDir).to.equal(appsDir);
//       });

//       env.CONFIG = JSON.stringify({
//         'port': 3008,
//         'host': 'localhost',
//         'appsDir': '~dist'
//       });

//       appsDir = `${process.env.HOME}/dist`,
//         load = server(env);

//       it(`should be appsDir ${appsDir}`, () => {
//         expect(load.appsDir).to.equal(appsDir);
//       });

//       env.CONFIG = JSON.stringify({
//         'port': 3009,
//         'host': 'localhost',
//         'appsDir': '/dist'
//       });

//       appsDir = `/dist`,
//         load = server(env);

//       it(`should be appsDir ${appsDir}`, () => {
//         expect(load.appsDir).to.equal(appsDir);
//       });

//     });

//     describe(`Test Router`, () => {

//       it('should be defined Router', () => {
//         expect(_router).to.have.property('Router');
//         expect(new _router.Router({})).to.be.instanceof(_router.Router)
//       });

//       it('should be defined RouterHttp', () => {
//         expect(_router).to.have.property('RouterHttp');
//         expect(new _router.RouterHttp()).to.be.instanceof(_router.Router)
//         expect(new _router.RouterHttp()).to.be.instanceof(_router.RouterHttp)
//       });

//       it('should be defined Service', () => {
//         expect(_service).to.have.property('Service')
//         expect(new _service.Service()).to.be.instanceof(_service.Service)
//       });

//       const dirname = join(env.cwd, 'dist/TEST-test');
//       let router = new _router.RouterHttp({
//           'method': 'GET',
//           'headers': {
//             'x-real-ip': '0.0.0.0',
//             'host': 'sv00',
//             'authorization': 'authorized'
//           }
//         },
//         null, {
//           'originalUrl': '/TEST/test/test',
//           'url': '/test',
//           dirname
//         }
//       );

//       it('should be Router have method has', () => {
//         expect(router).to.have.property('has');
//         expect(router.has('originalUrl')).to.be.true;
//         expect(router.has('aaaaaaaaaaa')).to.be.false;
//       });

//       it('should be Router have property originalUrl', () => {
//         expect(router).to.have.property('originalUrl');
//         expect(router.originalUrl).to.equal('/TEST/test/test');
//       });

//       it('should be Router have property url', () => {
//         expect(router).to.have.property('url');
//         expect(router.url).to.equal('/test');
//       });

//       it('should be Router have property dirname', () => {
//         expect(router).to.have.property('dirname');
//         expect(router.dirname).to.equal(dirname);
//       });

//       it('should be Router have property dirservices', () => {
//         expect(router).to.have.property('dirservices');
//         expect(router.dirservices).to.equal('services');
//       });

//       it('should be Router have property service', () => {
//         expect(router).to.have.property('service');
//         expect(new(router.service)()).to.be.instanceof(_service.Service);
//       });

//       it('should be RouterHttp have property method', () => {
//         expect(router).to.have.property('method');
//         expect(router.method).to.equal('GET');
//       });

//       it('should be Router have method isGetMethod', () => {
//         expect(router).to.have.property('isGetMethod');
//         expect(router.isGetMethod).to.be.true;
//         expect(!router.isGetMethod).to.be.false;
//       });

//       it('should be RouterHttp have property headers', () => {
//         expect(router).to.have.property('headers');
//         expect(router.headers).to.be.an('object');
//       });

//       it('should be RouterHttp have property method', () => {
//         expect(router).to.have.property('method');
//         expect(router.method).to.equal('GET');
//       });

//       it('should be RouterHttp have property hostname', () => {
//         expect(router).to.have.property('hostname');
//         expect(router.hostname).to.equal('sv00');
//       });

//       it('should be RouterHttp have property ip', () => {
//         expect(router).to.have.property('ip');
//         expect(router.ip).to.equal('0.0.0.0');
//       });

//       it('should be RouterHttp have property authorization', () => {
//         expect(router).to.have.property('authorization');
//         expect(router.authorization).to.equal('authorized');
//       });
      

//       // env.CONFIG = JSON.stringify({
//       //   'port': 3005,
//       //   'host': '0.0.0.0',
//       //   'appsDir': 'dist'
//       // });

//       //   let load = server(env);
//       //   load.listen();

//       //   it(`should be receiver error: package.json - not found`, () => {
//       //     http.request('http://localhost:3005/TEST', response => {
//       //       response.setEncoding('utf8');
//       //       response.on('data', chunk => {
//       //         expect(chunk).to.equal(`{"message":"package.json - not found!"}`);
//       //       });
//       //     }).end();
//       //   });

//       //   it(`should be receiver error: main.js - not found`, () => {
//       //     http.request('http://localhost:3005/TEST/test1', response => {
//       //       response.setEncoding('utf8');
//       //       response.on('data', chunk => {
//       //         expect(chunk).to.equal('{"message":"main: <executable.js> - not found!"}');
//       //       });
//       //     }).end();
//       //   });

//       //   it(`should be receiver result: /TEST/test`, () => {
//       //     http.request('http://localhost:3005/TEST/test', response => {
//       //       response.setEncoding('utf8');
//       //       response.on('data', chunk => {
//       //         expect(chunk).to.equal('{"result":"/TEST/test"}');
//       //       });
//       //     }).end();
//       //   });

//     });

//   });

// })();
