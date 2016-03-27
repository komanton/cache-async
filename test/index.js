require('es6-shim');
var chai = require("chai"), 
    chaiAsPromised = require("chai-as-promised"),
    sinonChai = require("sinon-chai"),
    sinon = require("sinon");
    
chai.use(sinonChai);
chai.use(chaiAsPromised);
var should = chai.should(),    
    assert = require('assert');
    
var Cache = require('../index');
    
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
        it('should return key-value when async func resolved', function(done) {
            cache.get(stubKV.key, stubAsyncResolve, 10)
                .should.eventually.deep.equal(stubKV).notify(done);
        });

        it('should return cached key-value when async func resolved', function(done) {
            var callback = sinon.stub().returns(1);
            var dd = function(){return stubAsyncResolve().then(function(){
                return callback();});}
            cache.get(stubKV.key, dd, 10)
                .should.eventually.deep.equal(stubKV)
                .then(cache.get(stubKV.key, dd, 10))
                .should.eventually.deep.equal(stubKV)
                .should.be.fulfilled
                .then(function(){callback.should.have.been.calledOnce})              
                .should.notify(done);
        });
        it('should ---- when async have not resolved', function() {
            
        });
    });
});