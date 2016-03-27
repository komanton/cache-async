require('es6-shim');

var chai = require("chai"), 
    chaiAsPromised = require("chai-as-promised"),
    sinonChai = require("sinon-chai"),
    sinon = require("sinon");
require('sinon-as-promised')
chai.use(sinonChai);
chai.use(chaiAsPromised);
var should = chai.should(),    
    assert = require('assert');
    
var Cache = require('../index');
    
var stubAsync = function(value, timeout, needReject) {
    return new Promise(function(resolve, reject) {
        console.log('async start ...');
        setTimeout(function() {
            console.log('async end!');
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
        var asyncWaiter = setTimeout;
        cache = Cache(asyncWaiter);
    });
    afterEach(function() {
    });
    describe('get', function() {
        it('should return key-value when async func resolved', function(done) {
            cache.get(stubKV.key, stubAsyncResolve, 10)
                .should.eventually.deep.equal(stubKV).notify(done);
        });
        it('should return cached key-value when async func resolved', function(done) {
            var stubCallBack = sinon.stub().resolves(1);            
            cache.get(stubKV.key, stubCallBack, 500)
                .should.eventually.deep.equal(stubKV)
                .then(function() {return cache.get(stubKV.key, stubCallBack, 10)})
                .should.eventually.deep.equal(stubKV)                
                .then(function(){stubCallBack.should.have.been.calledOnce})              
                .should.notify(done);
        });
        it('should return non-cached key-value when cache timeout', function(done) {
            var stubCallBack = sinon.stub().resolves(1);
            cache.get(stubKV.key, stubCallBack, 500)
                .should.eventually.deep.equal(stubKV)
                .then(function() {return cache.get(stubKV.key, stubCallBack, 10)})
                .should.eventually.deep.equal(stubKV)                
                .then(function() {return stubAsync(null, 550)})//expire cache                
                .then(function() {return cache.get(stubKV.key, stubCallBack, 10)})
                .should.eventually.deep.equal(stubKV)                
                .then(function(){stubCallBack.should.have.been.calledTwice})              
                .should.notify(done);
        });
        it('should return cached key-value when async long', function(done) {
            var long = function() {return stubAsync(1, 90); };
            var stubCallBack = sinon.stub().resolves(1);
            var longCallBack = function(){ return long().then(stubCallBack); };            
            Promise.all([
                cache.get(stubKV.key, longCallBack, 500).should.eventually.deep.equal(stubKV),
                cache.get(stubKV.key, longCallBack, 500).should.eventually.deep.equal(stubKV),
                cache.get(stubKV.key, longCallBack, 500).should.eventually.deep.equal(stubKV),
            ]).then(function(){stubCallBack.should.have.been.calledOnce})
            .should.notify(done);
        });
    });
});