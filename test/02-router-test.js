/**
 * application load
 * 
 * powered by moreira in 2020-01-31
 * 
 * require
 * npm install mocha, chai
 */

(function() {

  const 
    chai = require('chai'),
    { assert } = chai;
    
  chai.config.showDiff = true;

  describe('Tests to http-router', function() {

    const args = {
        
      request: {
          setEncoding: () => {},
          on: (a, b) => b(),
          url: 'http://teste.com?a=b&b=a',
          method: 'GET',
          headers: {
            host: process.env.HOSTNAME
          },
        },

      response: {
        setHeader: () => {},
        hasHeader: () => {},
        end: () => {}        
      },
    
      url: ['teste'],
    
      locals: { dirname: __dirname }
    
      };

    const HttpService = require('../libs/http-service')
    const HttpRouter = require('../libs/http-router')

    describe('General API', function() {
      
      it('should by defined', function() {

        assert.isFunction(HttpRouter);
        assert.isFunction(HttpRouter.constructor);
        // @ts-ignore
        assert.throw(() => HttpRouter());
        // @ts-ignore
        assert.instanceOf(new HttpRouter(args), HttpRouter);
      });

    });

    describe('HttpRouter: tests of properties', function() {

      // @ts-ignore
      const routers = new HttpRouter(args);
      
      it('#dirservices - default', function() {
        assert.isTrue(Reflect.has(routers, 'dirservices'));
        assert.equal(routers.dirservices, 'services');
      });

      it('#method', function() {
        assert.isTrue(Reflect.has(routers, 'method'));
      });

      it('#request', function() {
        assert.isTrue(Reflect.has(routers, 'request'));
        assert.isTrue(Object.is(routers.request, args.request));
      });

      it('#query', function() {
        assert.isTrue(Reflect.has(routers, 'query'));
        assert.equal(routers.query.a, 'b');
        assert.equal(routers.query.b, 'a');
      });

      it('#body', function() {
        assert.isTrue(Reflect.has(routers, 'body'));
        assert.isUndefined(routers.body);
      });

      it('#url', function() {
        assert.isTrue(Reflect.has(routers, 'url'));
        assert.isArray(routers.url);
        assert.equal(routers.url, args.url);
      });

      it('#headers', function() {
        assert.isTrue(Reflect.has(routers, 'headers'));
        assert.isTrue(Object.is(routers.headers, args.request.headers));
      });

      it('#hostname', function() {
        assert.isTrue(Reflect.has(routers, 'hostname'));
        assert.equal(routers.hostname, args.request.headers.host);
      });

      it('#response', function() {
        assert.isTrue(Reflect.has(routers, 'response'));
        assert.isTrue(Object.is(routers.response, args.response));
      });

      it('#statusCode', function() {
        assert.isTrue(Reflect.has(routers, 'statusCode'));
        assert.isTrue(Object.is(routers.statusCode(200), routers));
        assert.equal(args.response.statusCode, 200);
      });

      it('#setHeader', function() {
        assert.isTrue(Reflect.has(routers, 'setHeader'));
        assert.isFunction(routers.setHeader);
        assert.isTrue(Object.is(routers.setHeader('a', 'b'), routers));
      });

      it('#hasHeader', function() {
        assert.isTrue(Reflect.has(routers, 'hasHeader'));
        assert.isFunction(routers.hasHeader);
      });

      it('#sendJson', function() {
        assert.isTrue(Reflect.has(routers, 'sendJson'));
        assert.isFunction(routers.sendJson);
      });

      it('#sendText', function() {
        assert.isTrue(Reflect.has(routers, 'sendText'));
        assert.isFunction(routers.sendText);
      });

      it('#send', function() {
        assert.isTrue(Reflect.has(routers, 'send'));
        assert.isFunction(routers.send);
      });

      it('#method - DELETE', function() {
        
        // @ts-ignore
        args.request.method = 'DELETE';
        // @ts-ignore
        const routers = new HttpRouter(args);
 
        assert.equal(routers.method, args.request.method);
        assert.isTrue(routers.isDeleteMethod);
        assert.isTrue(routers.isGetOrDeleteMethod);
        assert.isFalse(routers.isPostOrPutOrPatchMethod);
      });

      it('#method - GET', function() {
        
        // @ts-ignore
        args.request.method = 'GET';
        // @ts-ignore
        const routers = new HttpRouter(args);
 
        assert.equal(routers.method, args.request.method);
        assert.isTrue(routers.isGetMethod);
        assert.isTrue(routers.isGetOrDeleteMethod);
        assert.isFalse(routers.isPostOrPutOrPatchMethod);
      });

      it('#method - OPTIONS', function() {
        
        // @ts-ignore
        args.request.method = 'OPTIONS';
        // @ts-ignore
        const routers = new HttpRouter(args);
 
        assert.equal(routers.method, args.request.method);
        assert.isTrue(routers.isOptionsMethod);
        assert.isFalse(routers.isGetOrDeleteMethod);
        assert.isFalse(routers.isPostOrPutOrPatchMethod);
      });

      it('#method - PATCH', function() {
          
        // @ts-ignore
        args.request.method = 'PATCH';
        // @ts-ignore
        const routers = new HttpRouter(args);
 
        assert.equal(routers.method, args.request.method);
        assert.isTrue(routers.isPatchMethod);
        assert.isFalse(routers.isGetOrDeleteMethod);
        assert.isTrue(routers.isPostOrPutOrPatchMethod);
      });

      it('#method - POST', function() {
          
        // @ts-ignore
        args.request.method = 'POST';
        // @ts-ignore
        const routers = new HttpRouter(args);
 
        assert.equal(routers.method, args.request.method);
        assert.isTrue(routers.isPostMethod);
        assert.isFalse(routers.isGetOrDeleteMethod);
        assert.isTrue(routers.isPostOrPutOrPatchMethod);
      });

      it('#method - PUT', function() {
          
        // @ts-ignore
        args.request.method = 'PUT';
        // @ts-ignore
        const routers = new HttpRouter(args);
 
        assert.equal(routers.method, args.request.method);
        assert.isTrue(routers.isPutMethod);
        assert.isFalse(routers.isGetOrDeleteMethod);
        assert.isTrue(routers.isPostOrPutOrPatchMethod);
      });

      it('#service', function() {
          
        const routers = new HttpRouter({
          service: class {}
        });

        assert.isFunction(routers.service);
        assert.throw(() => routers.service());
        assert.instanceOf(new routers.service(), routers.service);

      });

      it('#service - url (1)', function() {

        const _args = Object.assign({}, args, { url: ['teste'] });
        // @ts-ignore
        const routers = new HttpRouter(_args);

        assert.isFunction(routers.service);
        assert.throw(() => routers.service());
        assert.instanceOf(new routers.service(), HttpService);

      });

      it('#service - url (2)', function() {

        const _args = Object.assign({}, args, { url: ['testa'] });
        // @ts-ignore
        const routers = new HttpRouter(_args);

        assert.isFunction(routers.service);
        assert.throw(() => routers.service());
        assert.instanceOf(new routers.service(), HttpService);

      });

      it('#service - url (3)', function() {

        const _args = Object.assign({}, args, { url: ['testb', 'testb'] });
        // @ts-ignore
        const routers = new HttpRouter(_args);

        assert.isFunction(routers.service);
        assert.throw(() => routers.service());
        assert.instanceOf(new routers.service(), HttpService);

      });

      it('#service - url (4)', function() {

        const _args = Object.assign({}, args, { url: ['testc', 'testb'] });
        // @ts-ignore
        const routers = new HttpRouter(_args);
  
        assert.isFunction(routers.service);
        assert.throw(() => routers.service());
        assert.instanceOf(new routers.service(), HttpService);

      });

    });

  });

})();