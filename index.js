require('es6-shim');
module.exports = function($timeout) {
    var cacheItems = [];
    var get = function(key, action, timeout) {
        return new Promise(function(resolve, reject) {
            if (!timeout) {
                timeout = 60;
            }
            var cacheItem = cacheItems.find(function(e) {
                return e.key === key;
            })
            var now = new Date();
            if (cacheItem == undefined) {
                cacheItem = { key: key, value: {}, lock: false };
                cacheItems.push(cacheItem);
            }
            if (cacheItem.value.expires != undefined && (now < cacheItem.value.expires)) {
                resolve({ key: key, value: cacheItem.value.data });
            } else {
                if (cacheItem.lock === false) {
                    cacheItem.lock = true;
                    action().then(function(result) {
                        cacheItem.value.data = result;
                        var expires = new Date(now.getTime());
                        expires.setSeconds(expires.getSeconds() + timeout);
                        cacheItem.value.expires = expires;
                        //console.info('Now: ' + now + ' expires ' + cacheItem.value.expires);
                        cacheItem.lock = false;
                        resolve({ key: key, value: cacheItem.value.data });
                    }).catch(reject);
                } else {
                    var wait = function() {
                        if (cacheItem.lock === false) {
                            resolve({ key: key, value: cacheItem.value.data });
                        } else {
                            $timeout(wait, 3);
                        }
                    };
                    $timeout(wait, 3);
                }
            }
        });
    };
    return {
        get: get
    };
};

