/**
 * application: load
 * module: load-test
 * 
 * powered by moreira 2020-02-12
 */

Promise.all([
  'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
  'https://cdn.jsdelivr.net/npm/chai/chai.js',
  'https://cdn.jsdelivr.net/npm/chai-http@4.3.0/dist/chai-http.js',
  'https://cdn.jsdelivr.net/npm/mocha/mocha.js'
// @ts-ignore
].map(a => System.import(a)))
.then(a => a.map(b => b.default || b))
.then(([axios, chai, chaiHttp, mocha]) => {

  mocha.setup({ 
    ui: 'bdd', 
    checkLeaks: true, 
    asyncOnly: true, 
    growl: true ,
    'globals': ['_']
  });

  chai.use(chaiHttp);

  const 
    host = `http://sicinfo.kinghost.net`,
    url = /** @param {string} a */ a => `/DEV/load-test/${a}`;

  axios.defaults.baseURL = `${host}${url('')}`;

  describe('Load test suite', () => {

    it('#GET teste/safe - 401 Unauthorized ', done => {

      axios({ method: 'get', url: 'safe' }).then(resp => {
        chai.expect(resp).to.be.null;
      }).catch(err => {
        chai.expect(err).to.have.status(401);
      }).finally(done);
    });

    it('#GET teste/safe - 200 ', done => {
      
      axios({ 
        method: 'get', 
        url: 'login', 
        headers: {
          authorization: ''
        }
       }).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.have.property('headers').to.have.property('authorization');

        return axios({ method: 'get', url: 'safe', headers: { authorization: resp.headers.authorization } });

      }).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.have.property('headers').to.have.property('authorization');

      }).catch(err => {
        
        chai.expect(err).to.be.null;
      
      }).finally(done);        
    });

    it('#GET teste/config - all ', done => {

      axios({ method: 'get', url: 'config' }).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result').to.be.an('array');
        chai.expect(resp.data.result[0]).to.have.property('method').equal('doGetByQuery');

      }).catch(err => {

        chai.expect(err).to.be.null;
      
      }).finally(done);

    });

    it('#GET teste/config/1 - ', done => {
      
      axios({ method: 'get', url: 'config/1' }).then(resp => {
        
        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result');
        chai.expect(resp.data.result).to.have.property('method').equal('doGetById');

      }).finally(done);
    });

    it('#GET teste/config?_key=1 - ', done => {

      axios({ method: 'get', url: 'config', params: { _key: 1 }}).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result');
        chai.expect(resp.data.result).to.have.property('method').equal('doGetByKey');
        chai.expect(resp.data.result).to.have.property('_key').equal('1');

      }).finally(done);
    });

    it('#PATCH teste/config/1 {code: 1} - ', done => {

      axios({ method: 'patch', url: 'config/1', data: { code: 1 }}).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result');
        chai.expect(resp.data.result).to.have.property('method').equal('doPatch');
        chai.expect(resp.data.result).to.have.property('id').equal('1');
        chai.expect(resp.data.result).to.have.property('code').equal(1);

      }).finally(done);
    });

    it('#POST teste/config {code: 1} - ', done => {

      axios({ method: 'post', url: 'config', data: { code: 1 }}).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result');
        chai.expect(resp.data.result).to.have.property('method').equal('doPost');
        chai.expect(resp.data.result).to.have.property('code').equal(1);

      }).finally(done);
    });

    it('#PUT teste/config/1 {code: 1} - ', done => {

      axios({ method: 'put', url: 'config/1', data: { code: 1 }}).then(resp => {

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result');
        chai.expect(resp.data.result).to.have.property('method').equal('doPut');
        chai.expect(resp.data.result).to.have.property('id').equal('1');
        chai.expect(resp.data.result).to.have.property('code').equal(1);
        
      }).finally(done);
    });

    it('#GET teste/cadastro/config - all ', done => {

      axios({ method: 'get', url: 'cadastro/config' }).then(resp => {

console.log('accept')  ;      

        chai.expect(resp).to.have.status(200);
        chai.expect(resp).to.be.json;
        chai.expect(resp.data).to.have.property('result').to.be.an('array');
        chai.expect(resp.data.result[0]).to.have.property('method').equal('doGetByQuery');

      }).catch(err => {

console.log('reject', err.stack);        

        chai.expect('err').to.be.null;
      
      }).finally(() => { console.log('finally'); done() });
    });

  });

  mocha.run();

});
    