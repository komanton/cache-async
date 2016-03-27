cache-async
=========

A small module providing cache for async methods with promises

## Installation
```javascript
  npm install cache-async --save
```
## Usage
```javascript
var Cache = require('cache-async');
var asyncWaiter = setTimeout;
var cache = Cache(asyncWaiter);

var cacheTimeoutMilliseconds = 10000;
  
cache.get('key_1', function(){
        return new Promise(function(resolve, reject) {
            //Example long async operation
            console.log('async start ...');
            setTimeout(function() {
                console.log('async end!');                
                resolve(1);                
            }, 5000);
        });
    }, cacheTimeoutMilliseconds).then(function(){
        console.log(keyValue.key + ' ' + keyValue.value); //key_1 1
    });
```
## Tests
```javascript
  npm test
```
## Contributing



## Release History

