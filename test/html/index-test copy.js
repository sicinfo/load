/**
 * application: load
 * module: load-test
 * 
 * powered by moreira 2020-02-12
 */

Promise.all([
  'https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
  'https://cdn.jsdelivr.net/npm/mocha/mocha.js',
  'https://cdn.jsdelivr.net/npm/chai/chai.js',
  'https://cdn.jsdelivr.net/npm/chai-http@4.3.0/dist/chai-http.js'
// @ts-ignore
].map(a => System.import(a)))
.then(a => a.map(b => b.default || b))
.then(([axios, mocha, chai, chaiHttp]) => {

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

    it('#GET teste/config - all ', async () => {

      const resp = await axios({
        method: 'get',
        url: 'config'
      })

      chai.expect(resp).to.have.status(200);
      chai.expect(resp).to.be.json;
      chai.expect(resp.data).to.have.property('result').to.be.an('array');
      chai.expect(resp.data.result[0]).to.have.property('method').equal('doGetByQuery');
      
    });

    // it('#GET teste/config - all ', done => {
    //   chai.request(host)
    //     .get(url('config'))
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(200);
    //       chai.expect(resp).to.be.json;
    //       chai.expect(JSON.parse(resp.text)).to.have.property('result');
    //       chai.expect(JSON.parse(resp.text).result).to.be.an('array');
    //       chai.expect(JSON.parse(resp.text).result[0]).to.have.property('method').equal('doGetByQuery');
    //       done();
    //     });
    // });

    // it('#GET teste/config/1 - ', done => {
    //   chai.request(host)
    //     .get(url('config/1'))
    //     //.set('withcredentials', true)
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(200);
    //       chai.expect(resp).to.be.json;
    //       chai.expect(JSON.parse(resp.text)).to.have.property('result');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('method').equal('doGetById');
    //       done();
    //     });
    // });

    // it('#GET teste/config?_key=1 - ', done => {
    //   chai.request(host)
    //     .get(url('config'))
    //     .query({ _key: 1 })
    //     //.set('withcredentials', true)
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(200);
    //       chai.expect(resp).to.be.json;
    //       chai.expect(JSON.parse(resp.text)).to.have.property('result');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('method').equal('doGetByKey');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('_key').equal('1');
    //       done();
    //     });
    // });

    // it('#PATCH teste/config/1 {code: 1} - ', done => {
    //   chai.request(host)
    //     .patch(url('config/1'))
    //     // .set('withcredentials', true)
    //     // .set('contnet-type', 'application/json')
    //     // .type('json')
    //     .send({ code: 1 })
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(200);
    //       chai.expect(resp).to.be.json;
    //       chai.expect(JSON.parse(resp.text)).to.have.property('result');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('method').equal('doPatch');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('id').equal('1');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('code').equal(1);
    //       done();
    //     });
    // });

    // it('#POST teste/config {code: 1} - ', done => {
    //   chai.request(host)
    //     .post(url('config'))
    //     //.set('withcredentials', true)
    //     .type('json')
    //     .send({ code: 1 })
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(200);
    //       chai.expect(resp).to.be.json;
    //       chai.expect(JSON.parse(resp.text)).to.have.property('result');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('method').equal('doPost');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('code').equal(1);
    //       done();
    //     });
    // });

    // it('#PUT teste/config {code: 1} - ', done => {
    //   chai.request(host)
    //     .put(url('config/1'))
    //     //.set('withcredentials', true)
    //     .type('json')
    //     .send({ code: 1 })
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(200);
    //       chai.expect(resp).to.be.json;
    //       chai.expect(JSON.parse(resp.text)).to.have.property('result');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('method').equal('doPut');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('id').equal('1');
    //       chai.expect(JSON.parse(resp.text).result).to.have.property('code').equal(1);
    //       done();
    //     });
    // });

    // it('#GET teste/safe - 401 Unauthorized ', done => {
    //   chai.request(host)
    //     .get(url('safe'))
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;
    //       chai.expect(resp).to.have.status(401);
    //       done();
    //     })
    // });

    // it('#GET teste/safe - 200 ', done => {
    //   chai.request(host)
    //     .get(url('login'))
    //     .end((err, resp) => {
    //       chai.expect(err).to.be.null;

    //       console.log(145, resp.headers);

    // //   //     chai.request(host)
    // //   //     .get(url('safe'))
    // //   //     .set('authorization', 'a b')
    // //   //     .end((err, resp) => {
    // //   //       chai.expect(err).to.be.null;
    // //   //       chai.expect(resp).to.have.status(200);
    //       done();
    //     });
    // });
  



    // //   //     chai.expect(err).to.be.null;
    // //   //     chai.expect(resp).to.have.status(200);
    // //       done();
    // //     });
    // // });

  });

  mocha.run();

});
    