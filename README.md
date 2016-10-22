light-request
====

`light-request` is simple ajax module.
depends on ES6 Promise.


PREPARE:
----

```html
<script src="light-request.js"></script>
```

with Browserify or Node.js

```js
// ES5
var request = require('light-request');
// or
// with Babel and so on
import request from 'light-request';
```


QUICK EXAMPLE:
----

```html
<script src="http://lightspeedworks.github.io/light-request/light-request.js"></script>
<!--[if IE]><script src="http://lightspeedworks.github.io/promise-light/promise-light.js"></script><![endif]-->
<script>
request.get('/').then(
    function (res) {
        console.log('res.statusCode:', res.statusCode);
        console.log('res.statusMessage:', res.statusMessage);
        console.log('res.body:', res.body);
        console.log('res.headers:', res.headers);
    },
    function (err) { console.error(err); }
);
</script>
```

USAGE:
----

### request(method, [options], uri, data): Promise

```js
p = request(method, [options], uri, data);
```

#### method: String

+ 'GET'
+ 'POST'
+ 'PUT'
+ 'DELETE'
+ and so on


#### uri: String

```js
uri = 'http://www.google.com';
```

#### data: String or JSON

```js
data = 'field1=10&field2=20';     // send string
data = {field1: 10, field2: 20};  // send JSON string
data = undefined;                 // send nothing (length zero)
```

#### options.headers: Object

```js
options = {headers: {'x-sample-header': 'any-value'}};
```

### request.get([options], uri): Promise

```js
p = request.get([options], uri);
```

### request.post([options], uri, data): Promise

```js
p = request.post([options], uri, data);
```


### request.put([options], uri, data): Promise

```js
p = request.put([options], uri, data);
```


### request.del([options], uri, data): Promise

```js
p = request.del([options], uri, data);
p = request.delete([options], uri, data);
```


LICENSE:
----

  MIT
