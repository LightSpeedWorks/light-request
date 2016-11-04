light-request
====

`light-request` is simple ajax module.

support following feature:
+ ES6 Promise
+ Thunk
+ Node.js style callback


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
// as a promise
request.get('/').then(
	function (res) {
		console.log('res.statusCode:', res.statusCode);
		console.log('res.statusMessage:', res.statusMessage);
		console.log('res.body:', res.body);
		console.log('res.headers:', res.headers);
	},
	function (err) { console.error(err); }
);

// as a thunk
request.get('/')(
	function (err, res) {
		if (err) return console.error(err);
		console.log('res.statusCode:', res.statusCode);
		console.log('res.statusMessage:', res.statusMessage);
		console.log('res.body:', res.body);
		console.log('res.headers:', res.headers);
	}
);

// with callback
request.get('/',
	function (err, res) {
		if (err) return console.error(err);
		console.log('res.statusCode:', res.statusCode);
		console.log('res.statusMessage:', res.statusMessage);
		console.log('res.body:', res.body);
		console.log('res.headers:', res.headers);
	}
);
</script>
```

QUICK EXAMPLE WITH GENERATORS:
----

```js
const request = require('light-request');
//const aa = require('aa'); // or, use 'co'
const aa = gen => function cb(err, val) {
	const obj = err ? gen.throw(err) : gen.next(val);
	obj.done || (obj.value)(cb); } ();

aa(function *() {
	try {
		const res = yield request.get('http://xxx');
		console.log('res.statusCode:', res.statusCode);
		console.log('res.statusMessage:', res.statusMessage);
		console.log('res.body:', res.body);
		console.log('res.headers:', res.headers);
	} catch (err) {
		console.error(err);
	}
} ());
```


USAGE:
----

### request(method, [options], uri, data, cb): void

if callback function `cb` is specified, it returns void (undefined).

```js
request(method, [options], uri, data, function (err, res) {});
```

### request(method, [options], uri, data): Promise or Thunk

it returns Promise or Thunk.

```js
p = request(method, [options], uri, data);
// as a promise
p.then(function (res) {}, function (err) {});
p.then(function (res) {}).catch(function (err) {});
// or, as a thunk
p(function (err, res) {});
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

### request.get([options], uri, [cb]): void, Promise or Thunk

```js
p = request.get([options], uri);
```

### request.post([options], uri, data, [cb]): void, Promise or Thunk

```js
p = request.post([options], uri, data);
```


### request.put([options], uri, data, [cb]): void, Promise or Thunk

```js
p = request.put([options], uri, data);
```


### request.del([options], uri, data, [cb]): void, Promise or Thunk

```js
p = request.del([options], uri, data);
p = request.delete([options], uri, data);
```


LICENSE:
----

  MIT
