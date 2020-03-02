/** 
 * application: load-test 
 * 
 * powered by moreira in 2020-02-17
 * 
 * testes de unidade
 */

const 
  { expect } = require('chai'),
  axios = require('axios');

describe('Suite test to load', () => {

  it('Soould assert to be true', () => {

    return axios({ url: `http://sicinfo.kinghost.net:${process.env.PORT_LOAD}/load-test/teste/config` }).then(res => {
      expect(res).to.have.property('data');
    }).catch(err => {
      console.log(err.stack);
      expect(err, 'Should be null').to.be.null;
    });
    
  })

});
