/**
 * application: load-test
 *
 * powered by moreira in 2020-02-17
 *
 * testes de unidade local com axios
*/
const { expect } = require('chai');
const axios = require('axios');

/** @param {string} a */
const url = a => `http://sicinfo.kinghost.net/DEV/load-test/${a}`;

describe('Suite test to load', () => {

  describe('Router unit test', () => {

    const { Router } = require('sicinfo-load');

    it('should be defined', () => {
      expect(Router).to.be.a('function');
    });

    it('should be defined a constructor', () => {
      expect(new Router()).to.be.an.instanceof(Router);
      // expect(() => Router()).to.throw();
      expect(Router).to.have.property('constructor');
    });

    describe('Router general properties', () => {

      it('#resolve', () => {
        expect(new Router()).to.have.property('resolve');
      })

      it('#reject', () => {
        expect(new Router()).to.have.property('reject');
      })

      it('#headers', () => {
        expect(new Router().headers).to.deep.equal({});
        expect(new Router({ req: { headers: { a: 1 } } }).headers['a']).to.equal(1);
      })

      it('#url', () => {
        expect(new Router().url).to.deep.equal([]);
        expect(new Router({ url: [1] }).url[0]).to.equal(1);
      })

      it('#method', () => {
        expect(new Router()).to.have.property('method').to.be.undefined;
      })

      it('#cache', () => {
        expect(new Router().cache).to.deep.equal({});
        expect(new Router({ cache: { a: 1 } }).cache.a).to.equal(1);
      })

      it('#dirServices', () => {
        expect(new Router().dirServices).to.equal('services');
        expect(new Router({ dirServices: 'a' }).dirServices).to.equal('a');
      })

      it('#query', () => {
        expect(new Router().query).to.deep.equal({});
        expect(new Router({ req: { url: '/?a=b' } }).query.a).to.equal('b');
      })

      it('#body', () => {
        expect(new Router().body).to.deep.equal({});
      })

    });

    describe('Router properties to RESTFull', () => {

      const
        methodsPost = ['PATCH', 'POST', 'PUT'],
        methods = ['OPTIONS', 'DELETE', 'GET', ...methodsPost];

      for (const method of methods) {

        const
          props = {
            req: { method },
            service: class {}
          },
          router = new Router(props),
          isMethodsPost = methodsPost.includes(method),
          argMethod = `is${method[0] + method.slice(1).toLowerCase()}Method`;

        it(`#method ${method}`, () => {
          expect(router.method).to.equal(method);
          expect(router[argMethod]).to.be.true;
          expect(router.isPatchOrPostOrPutMethod).to.equal(isMethodsPost);
        })

      }

    });

  //   describe('Router properties from Service', () => {})

  });

  describe('Service unit test', () => {

    const { Service, Router, Auth } = require('sicinfo-load');

    it('should be defined', () => {
      expect(Service).to.be.a('function');
    });

    it('should be defined a constructor', () => {
      expect(new Service()).to.be.an.instanceof(Service);
      // expect(() => Service()).to.throw();
      expect(Service).to.have.property('constructor');
    });

    describe('Service general properties', () => {

      it('#router', () => {
        expect(new Service().router).to.be.an.instanceof(Router);
      })

      it('#id', () => {
        expect(new Service().id).to.be.undefined;
        expect(new Service(new Router({ url: ['a'] })).id).to.be.undefined;
        expect(new Service(new Router({ url: ['a', 'b'] })).id).to.equal('b')
      })

      it('#key', () => {
        expect(new Service().key).to.be.undefined;
        expect(new Service(new Router({ req: { url: '/?_key=a' } })).key).to.equal('a');
      })

      it('#validate', () => {
        expect(new Service().validate).to.be.a('promise');
      })

      it('#authorization', () => {
        expect(new Service().authorization).to.deep.equal({});
      })

      it('#requiredAuthorization', () => {
        expect(new Service().requiredAuthorization).to.be.false;
      })

      it('#isAuthorized', () => {
        expect(new Service().isAuthorized).to.be.false;
      })

      it('#expiresIn', () => {
        expect(new Service().expiresIn).to.equal(60 * 60);
      })

      it('#createAuth', () => {
        const service = new Service();
        expect(service.createAuth())
          .to.be.an('array')
          .to.have.lengthOf(2)
          .that.includes(Auth.AUTHORIZATION);
      })

    });

    describe('#Service properties do RESTFull', () => {

      const
        methods = ['OPTIONS', 'DELETE', 'GET', 'PATCH', 'POST', 'PUT'];

      for (const method of methods) {

        const
          service = new Service(new Router({
            req: { method },
            service: class { }
          })),
          doMethod = `do${method[0]}${method.slice(1).toLowerCase()}`;

        it(`#method ${doMethod}`, () => {
          return service[doMethod]().then(res => {
            expect(res).to.be.undefined;
          }).catch(err => {
            expect(err).to.be.an('object');
            expect(err.code).to.equal(405);
            expect(err.message).to.have.string(doMethod.slice(2));
          });
        });

        it(`#method ${method}`, () => {
          return service.doHttp().then(res => {
            expect(res).to.be.undefined;
          }).catch(err => {
            expect(err).to.be.an('object');
            expect(err.code).to.equal(405);
            expect(err.message).to.have.string(doMethod.slice(2));
          });
        });

      }

    });

  });

  // describe('Http request test', () => {

  //   it('#GET safe - 401 Unauthorized', () => {
  //     // @ts-ignore
  //     return axios({ url: url('safe') }).then(res => {
  //       expect(res).to.be.undefined;
  //     }).catch(err => {
  //       expect(err)
  //         .to.have.property('response')
  //         .to.have.property('status')
  //         .to.equal(401);
  //     })
  //   });

  //   it('#GET login - 200 (authorization)', () => {
  //     // @ts-ignore
  //     return axios({
  //       url: url('login'),
  //       headers: { authorization: '' }
  //     }).then(res => {
  //       expect(res)
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res)
  //         .to.have.property('headers')
  //         .to.have.property('authorization');
  //     }).catch(err => {
  //       expect(err).to.be.undefined;
  //     });
  //   });

  //   it('#GET safe - 200', () => {
  //     // @ts-ignore
  //     return axios({ url: url('login'), headers: { authorization: '' } }).then(res => {
  //     // @ts-ignore
  //     return axios({ url: url('safe'), headers: { authorization: res.headers.authorization } });
  //     }).then(res => {
  //       expect(res)
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res)
  //         .to.have.property('headers')
  //         .to.have.property('authorization');
  //     }).catch(err => {
  //       expect(err).to.be.undefined;
  //     });
  //   });

  //   it('#GET config - all', () => {
  //     // @ts-ignore
  //     return axios({ url: url('config') }).then(res => {
  //       expect(res).to.have.property('status').to.equal(200);
  //       expect(res)
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.an('array')
  //         .to.not.be.empty;
  //       expect(res.data.result[0])
  //         .to.be.a('object')
  //         .to.have.property('method').to.equal('doGetByQuery');
  //     }).catch(err => {
  //       expect(err, err.stack).to.be.null;
  //     })
  //   });

  //   it('#GET config/1', () => {
  //     // @ts-ignore
  //     return axios({ url: url('config/1') }).then(res => {
  //       expect(res)
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res)
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.a('object')
  //         .to.have.property('method')
  //         .to.equal('doGetById')
  //     }).catch(err => {
  //       expect(err).to.be.null;
  //     })
  //   });

  //   it('#GET config?_key=1', () => {
  //     // @ts-ignore
  //     return axios({ url: url('config'), params: { _key: 1 } }).then(res => {
  //       expect(res, 'status = 200')
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res, 'method = doGetByKey')
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.a('object')
  //         .to.have.property('method')
  //         .to.equal('doGetByKey');
  //       expect(res.data.result, '_key = 1')
  //         .to.have.property('_key')
  //         .to.equal('1');
  //     }).catch(err => {
  //       expect(err).to.be.null;
  //     })
  //   });

  //   it('#PATCH config/1', () => {
  //     // @ts-ignore
  //     return axios({ method: 'patch', url: url('config/1'), data: { code: 1 } }).then(res => {
  //       expect(res, 'status = 200')
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res, 'method = doPatch')
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.a('object')
  //         .to.have.all.keys('method', 'id', 'code');
  //       expect(res.data.result.method).to.equal('doPatch');
  //       expect(res.data.result.id).to.equal('1');
  //       expect(res.data.result.code).to.equal(1);
  //     }).catch(err => {
  //       expect(err).to.be.null;
  //     })
  //   });

  //   it('#POST config {code:1}', () => {
  //     // @ts-ignore
  //     return axios({ method: 'post', url: url('config'), data: { code: 1 } }).then(res => {
  //       expect(res, 'status = 200')
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res, 'method = doPatch')
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.a('object')
  //         .to.have.all.keys('method', 'code');
  //       expect(res.data.result.method).to.equal('doPost');
  //       expect(res.data.result.code).to.equal(1);
  //     }).catch(err => {
  //       expect(err).to.be.null;
  //     })
  //   });

  //   it('#PUT config/1 {code:1}', () => {
  //     // @ts-ignore
  //     return axios({
  //       method: 'put',
  //       url: url('config/1'),
  //       data: { code: 1 }
  //     }).then(res => {
  //       expect(res, 'status = 200')
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res, 'method = doPut')
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.a('object')
  //         .to.have.all.keys('method', 'id', 'code');
  //       expect(res.data.result.method).to.equal('doPut');
  //       expect(res.data.result.id).to.equal('1');
  //       expect(res.data.result.code).to.equal(1);
  //     }).catch(err => {
  //       expect(err).to.be.null;
  //     })
  //   });

  //   it('#GET cadastro/config - all', () => {
  //     // @ts-ignore
  //     return axios({ url: url('cadastro/config') }).then(res => {
  //       expect(res)
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res)
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.an('array')
  //         .to.not.be.empty;
  //       expect(res.data.result[0])
  //         .to.be.a('object')
  //         .to.have.property('method')
  //         .to.equal('doGetByQuery');
  //     }).catch(err => {
  //       expect(err, err.stack).to.be.null;
  //     })
  //   });

  //   it('#GET teste - all', () => {
  //     // @ts-ignore
  //     return axios({ url: url('teste') }).then(res => {
  //       expect(res)
  //         .to.have.property('status')
  //         .to.equal(200);
  //       expect(res)
  //         .to.have.property('data')
  //         .to.have.property('result')
  //         .to.be.an('array')
  //         .to.not.be.empty;
  //       expect(res.data.result[0])
  //         .to.be.a('object')
  //         .to.have.property('method')
  //         .to.equal('doGetByQuery');
  //     }).catch(err => {
  //       expect(err, err.stack).to.be.null;
  //     })
  //   });

  // });

});
