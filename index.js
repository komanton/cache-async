var Cache = function($timeout){
  var cacheItems = [];
  return {
    get: function(key, action, timeout){
      return new Promise(function(resolve, reject){
        if(!timeout){
          timeout = 60;
        }
        var cacheItem = cacheItems.find(function(e){
          return e.key === key;
        })
        var now = new Date();
        if(cacheItem == undefined){
          cacheItem = { key: key, value: { }, lock: false };
          cacheItems.push(cacheItem);
        }
        if(cacheItem.value.expires != undefined && (now < cacheItem.value.expires)){
          resolve({key: key, value: cacheItem.value.data});
        }else{
          if(cacheItem.lock === false){
            cacheItem.lock = true;
            action().then(function(result){
              cacheItem.value.data = result;
              var expires = new Date(now.getTime());
              expires.setSeconds(expires.getSeconds() + timeout);
              cacheItem.value.expires = expires;
              //console.info('Now: ' + now + ' expires ' + cacheItem.value.expires);
              cacheItem.lock = false;
              resolve({key: key, value: cacheItem.value.data});
            }).catch(reject);
          }else{
            var wait = function(){
              if(cacheItem.lock === false){
                resolve({key: key, value: cacheItem.value.data});
              }else{
                $timeout(wait, 2);
              }
            };
            $timeout(wait, 3);
          }
        }
      });
    }
  };
};



var timeout = function(action, timeout){
  setTimeout(action, timeout);
};
var cache = Cache(timeout);

//Tests
//========================================================================================================

console.info('Start 1 = ');
cache.get('key_1',function(){
  return new Promise(function(resolve, reject){
    console.info('Start New request!');
    timeout(function(){
      console.info('Fininsh New request!');
      resolve(1);
    }, 10000);
  });
}, 20).then(function(keyValue){
  console.info('1 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
}); 

console.info('Start 2 = ');
cache.get('key_1',function(){
  return new Promise(function(resolve, reject){
    console.info('New request!');
    resolve(1);
  });
}, 10).then(function(keyValue){
  console.info('2 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
}); 

console.info('Start 3 = ');
cache.get('key_1',function(){
  return new Promise(function(resolve, reject){
    console.info('New request!');
    resolve(1);
  });
}, 10).then(function(keyValue){
  console.info('3 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
}); 
/*
console.info('Start 2.1 = ');
cache.get('key_2',function(){
  return new Promise(function(resolve, reject){
    console.info('Start New request #2!');
    timeout(function(){
      console.info('Fininsh New request #2!');
      resolve(2);
    }, 40000);
  });
}, 10).then(function(keyValue){
  console.info('2.1 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
}); 

console.info('Start 2.2 = ');
cache.get('key_2',function(){
  return new Promise(function(resolve, reject){
    console.info('New request! #2');
    resolve(2);
  });
}, 10).then(function(keyValue){
  console.info('2.2 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
});
*/
//========================================================================================================



timeout(function(){
  console.info('Start 1 = ' + new Date());
  cache.get('key_1',function(){
    return new Promise(function(resolve, reject){
      console.info('Start New request!');
      timeout(function(){
        console.info('Fininsh New request!');
        resolve(1);
      }, 10000);
    });
  }, 10).then(function(keyValue){
    console.info('1 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
  }); 
},15000);


timeout(function(){
  console.info('Start 1 = ' + new Date());
  cache.get('key_1',function(){
    return new Promise(function(resolve, reject){
      console.info('Start New request!');
      timeout(function(){
        console.info('Fininsh New request!');
        resolve(1);
      }, 10000);
    });
  }, 10).then(function(keyValue){
    console.info('1 = Key: ' + keyValue.key + ' Value: ' + keyValue.value);
  }); 
},30000);