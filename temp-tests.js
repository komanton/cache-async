

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

