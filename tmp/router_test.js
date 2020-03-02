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

// const { expect } = require('chai'),
//   http = require('http'),
//   server = require('sicinfo-load'),
//   _router = require('../dist/router'),
//   env = process.env,
//   url = 'http://localhost:3006/ROUTER/test0';

// env.cwd = __dirname;
// env.CONFIG = JSON.stringify({
//   'port': 3006,
//   'host': 'localhost',
//   'appsDir': ''
// });


// (function() {

//   describe('Testes para Router', () => {

//     describe('Teste gerais para Router', () => {

//       it('Deve estar definido em myrouter', () => {
//         expect(_router).to.have.property('Router');
//       });

//       // const { Router } = myrouter,
//       // options = {
//       //   'protocol': 'HTTP',
//       //   'originalUrl': '/TEST/test/test'
//       // };

//       // let router;

//       // it('deve ter um constructor', () => {
//       //   router = new Router({ options });
//       //   expect(router).to.be.an.instanceof(Router);
//       // });

//       // it('deve ter um metodo has', () => {
//       //   expect(router).to.have.property('has');
//       //   expect(router.has('protocol')).to.be.true;
//       //   expect(router.has('b')).to.be.false;
//       // });




//       // const { Router } = myrouter;



//       // // const load = server(env).listen();
//       // it('should be defined Router', () => {
//       //   expect(Router).to.be.a('function');
//       //   expect(Router.toString().trim().replace(/\n/g,'')).to.match(/^class {.*}$/);
//       //   expect(new Router()).to.be.an.instanceof(Router);
//       // });

//       // it('should be Router constructor', () => {
//       //   expect(Router).to.have.property('constructor');
//       //   // expect(Router.toString().trim().replace(/\n/g,'')).to.match(/^class {(.*)constructor\((.*)\)(.*){(.*)}0 }$/);

//       //   // expect(new Router()).to.have.own.property('constructor');
//       // });

//       // it('should be Router instanciable', () => {
//       // });


//       // it('should be Router method originalUrl', () => {
//       //   const router = new Router({'originalUrl':'originalUrl1'}); 
//       //   expect(router).to.have.property('originalUrl');
//       //   expect(router.originalUrl).to.equal('originalUrl1');
//       // });

//     });

//     //======================================================================================    
//     describe('Teste gerais para RouterHttp', () => {

//       // const { Router, RouterHttp, RouterWs } = myrouter;

//       // it('should be defined RouterHttp', () => {
//       //   expect(RouterHttp).to.be.a('function');

//       //   const routerHttp = new RouterHttp();

//       //   expect(routerHttp).to.be.an.instanceof(RouterHttp);
//       //   expect(routerHttp).to.be.an.instanceof(Router);

//       //   expect(routerHttp, 'não tem get resquest').to.have.property('request');
//       //   expect(routerHttp, 'não tem get originalUrl').to.have.property('originalUrl');


//       //   // expect(RouterHttp, 'não tem get response').to.have.property('response');

//       //   // expect('')
//       // });

//       // it('should be RouterHttp constructor', () => {
//       //   expect(RouterHttp).to.have.property('constructor');
//       //   // expect(new RouterHttp()).to.respondTo('constructor');
//       //   // expect(new RouterHttp()).to.have.ownPropertyDescriptor('constructor');
//       // });

//       // it('should be RouterHttp instanciable', () => {
//       //   const routerhttp = new RouterHttp();
//       //   expect(routerhttp).to.be.an.instanceof(RouterHttp);
//       //   expect(routerhttp).to.be.an.instanceof(Router);
//       // });

//       // it('should be RouterHttp method request', () => {
//       //   const router = new RouterHttp({'response':{}}); 
//       //   expect(router).to.have.property('request');
//       //   expect(router.request).to.be.an('object');
//       // });

//       // it('should be RouterHttp method response', () => {
//       //   const router = new RouterHttp({'response':{}}); 
//       //   expect(router).to.have.property('response');
//       //   expect(router.response).to.be.an('object');
//       // });



//     });

//     //======================================================================================    
//     describe('Teste gerais para RouterWs', () => {

//       // const { Router, RouterWs } = myrouter;

//       // it('should be defined RouterWs', () => {
//       //   expect(RouterWs).to.be.a('function');
//       //   expect(RouterWs.toString().trim().replace(/\n/g,'')).to.match(/^class\s+extends\s+Router\s+{.*}$/);
//       //   expect(new RouterWs()).to.be.an.instanceof(RouterWs);
//       //   expect(new RouterWs()).to.be.an.instanceof(Router);
//       // });

//       // it('should be RouterWs constructor', () => {
//       //   expect(RouterWs).to.have.property('constructor');
//       //   // expect(new RouterWs()).to.have.ownPropertyDescriptor('constructor');
//       // });

//     });

//     //   it('should be defined port', () => {
//     //     expect(load.port).to.be.a('number');
//     //   });

//     //   it('should be defined host', () => {
//     //     expect(load.host).to.be.a('string');
//     //   });

//     //   it('should be defined appsDir', () => {
//     //     expect(load.appsDir).to.be.a('string');
//     //   });

//     //   it('should be port 3006', () => {
//     //     expect(load.port).to.equal(3006);
//     //   });

//     //   it('should be host localhost', () => {
//     //     expect(load.host).to.equal('localhost');
//     //   });

//     //   it('should be defined appsDir', () => {
//     //     expect(load.appsDir).to.be.a('string');
//     //   });
//     // });

//     // describe(`Test appsDir`, () => {

//     //   env.CONFIG = JSON.stringify({
//     //     'port': 3007, 'host': 'localhost', 'appsDir': 'dist'
//     //   });

//     //   let 
//     //     appsDir = `${process.env.cwd}/dist`,
//     //     load = server(env);

//     //   it(`should be appsDir ${appsDir}`, () => {
//     //     expect(load.appsDir).to.equal(appsDir);
//     //   });

//     //   env.CONFIG = JSON.stringify({
//     //     'port': 3007, 'host': 'localhost', 'appsDir': '~dist'
//     //   });

//     //   appsDir = `${process.env.HOME}/dist`,
//     //   load = server(env);

//     //   it(`should be appsDir ${appsDir}`, () => {
//     //     expect(load.appsDir).to.equal(appsDir);
//     //   });

//     //   env.CONFIG = JSON.stringify({
//     //     'port': 3007, 'host': 'localhost', 'appsDir': '/dist'
//     //   });

//     //   appsDir = `/dist`,
//     //   load = server(env);

//     //   it(`should be appsDir ${appsDir}`, () => {
//     //     expect(load.appsDir).to.equal(appsDir);
//     //   });

//     // });

//     // describe(`Test Router`, () => {

//     //   env.CONFIG = JSON.stringify({
//     //     'port': 3007, 'host': 'localhost', 'appsDir': 'dist'
//     //   });

//     //   let load = server(env);
//     //   load.listen();

//     //   it(`should be receiver error: package.json - not found`, () => {
//     //     http.request('http://localhost:3007/TEST', response => {
//     //       response.setEncoding('utf8');
//     //       response.on('data', chunk => {
//     //         expect(chunk).to.equal(`{"message":"package.json - not found!"}`);
//     //       });
//     //     }).end();
//     //   });

//     //   it(`should be receiver error: main.js - not found`, () => {
//     //     http.request('http://localhost:3007/TEST/test1', response => {
//     //       response.setEncoding('utf8');
//     //       response.on('data', chunk => {
//     //         expect(chunk).to.equal('{"message":"main: <executable.js> - not found!"}');
//     //       });
//     //     }).end();
//     //   });

//     //   it(`should be receiver result: /TEST/test`, () => {
//     //     http.request('http://localhost:3007/TEST/test', response => {
//     //       response.setEncoding('utf8');
//     //       response.on('data', chunk => {
//     //         expect(chunk).to.equal('{"result":"/TEST/test"}');
//     //       });
//     //     }).end();
//     //   });


//   });

// })();
