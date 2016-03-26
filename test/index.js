
var chai = require("chai"), chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should(),
    Cache = require('../index'),
    assert = require('assert');
var stubAsync = function(value, timeout, needReject) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            if (needReject == undefined || needReject === false) {
                resolve(value);
            } else {
                reject(value);
            }
        }, timeout || 3);
    });
};
var stubAsyncResolve = function() { return stubAsync(1) };
var stubAsyncReject = function() { return stubAsync('error') };
var stubKV = { key: 'key_1', value: 1 };

describe('Cache', function() {
    var cache;
    beforeEach(function() {
        cache = Cache(setTimeout);
    });
    afterEach(function() {

    });
    describe('get', function() {
        it('should return key-value when async func resolved', function() {
            return Promise.all([
                cache.get(stubKV.key, stubAsyncResolve, 10)
                    .should.eventually.deep.equal(stubKV)
            ]);
        });
    });
});