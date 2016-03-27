require('es6-shim');
module.exports = function($asyncWaiter, $asyncWaiterTimeout) {
    var cacheItems = [];
    if(!$asyncWaiterTimeout){
        $asyncWaiterTimeout = 10;
    }
    var get = function(key, action, timeout) {
        return new Promise(function(resolve, reject) {
            //console.info('get ->');
            if (!timeout) {
                timeout = 60;
            }
            var cacheItem = cacheItems.find(function(e) {
                return e.key === key;
            })            
            if (cacheItem == undefined) {
                cacheItem = { key: key, value: {}, lock: 'free' };
                cacheItems.push(cacheItem);
            }
            var now = new Date();
            if (cacheItem.value.expires != undefined && (now < cacheItem.value.expires)) {
                //console.info('get from cache');
                //console.info('Now: ' + now + ' expires ' + cacheItem.value.expires);
                resolve({ key: key, value: cacheItem.value.data });
                return;
            } else {
                if (cacheItem.lock === 'free' || cacheItem.lock === 'fail') {
                    cacheItem.lock = 'used';
                    action().then(function(result) {                        
                        var expires = new Date(now.getTime());
                        expires.setMilliseconds(expires.getMilliseconds() + timeout);
                        cacheItem.value.expires = expires;
                        //console.info('Now: ' + now + ' expires ' + cacheItem.value.expires);
                        cacheItem.value.data = result;
                        cacheItem.lock = 'free';                        
                    }).catch(function(error){
                        //console.info('reject: ' + error);                        
                        cacheItem.value.data = error;
                        cacheItem.lock = 'fail';
                    }); 
                }
                var wait = function() {
                    if (cacheItem.lock === 'free') {
                        console.info('get from waiter');
                        var value = cacheItem.value.data;
                        resolve({ key: key, value: value });
                        return;
                    } else if (cacheItem.lock === 'fail') {
                        var error = cacheItem.value.data;                        
                        reject(error);
                        return;
                    } else {
                        console.info(' waiter one more');
                        $asyncWaiter(wait, $asyncWaiterTimeout);
                    }
                };
                $asyncWaiter(wait, $asyncWaiterTimeout);
            }
        });
    };
    return {
        get: get
        //todo creal, clearByKey
    };
};

