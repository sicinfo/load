/**
 * application load
 * 
 * powered by moreira in 2020-01-31
 * 
 * require
 * npm install mocha, chai
 */

/**
* application load
* 
* powered by moreira in 2020-01-31
* 
* require
* npm install mocha, chai
*/

(function () {

  const { assert } = require('chai');

  describe('Tests to utils', function () {

    const utils = require('../libs/utils');

    describe('General API', function () {

      it('should by defined', function () {
        assert.isObject(utils);
      });

      it('#log ', function () {
        assert.isFunction(utils.log);
        assert.isFunction(utils.log(__filename));
      });

      it('#atob ', function () {
        assert.isFunction(utils.atob);
        assert.equal(utils.atob('YWJjZGVmZw=='), 'abcdefg');
      });

      it('#weak ', function () {
        assert.isFunction(utils.weak);
      });

      describe('Tests to weak', function () {

        const weak = utils.weak();

        it('#_new ', function () {
          assert.isFunction(weak._new);
          assert.instanceOf(weak._new(this), WeakMap);
        });

        it('#_set', function () {
          assert.isFunction(weak._set);
          assert.instanceOf(weak._set(this, 'teste', 1), Map);
        });

        it('#_has', function () {
          assert.isFunction(weak._has);
          assert.isTrue(weak._has(this, 'teste'));
        });

        it('#_get', function () {
          assert.isFunction(weak._get);
          assert.equal(weak._get(this, 'teste'), 1);
        });

        it('#_del', function () {
          assert.isFunction(weak._del);
          assert.isTrue(weak._del(this, 'teste'));
          assert.isFalse(weak._del(this, 'teste'));
        });

      });

    });

  });

})();