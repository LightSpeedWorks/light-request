// support browser <script src="">
// support common.js, node.js, browserify: require('');
// support ES5
// do not use ES6 (ES2015) or later

//  var request = require('light-request');
//  p = request(method, [options], url, [data]);
//     method: GET, POST, PUT, DELETE

//  p = request.get([options], url, [data]);
//  p = request.post([options], url, [data]);
//  p = request.put([options], url, [data]);
//  p = request.del([options], url, [data]);
//  p = request.delete([options], url, [data]);

//  options: {headers: {'x-get-data': true}}


(this || {}).request = function () {
	'use strict';

	//var slice = [].slice;
	var unshift = [].unshift;

	var request = requestXHR;
	//var deps = {readyState: [
	//		'0: UNSENT, uninitialized: not open',
	//		'1: OPENED, loading: not send',
	//		'2: HEADERS_RECEIVED, loaded: status & headers',
	//		'3: LOADING, interactive: download in progress',
	//		'4: DONE, complete']};

	//request.setDefaultHeaders(headers)

	function makeRequest(method) {
		return function (opts, url, data, cb) {
			// var args = slice.call(arguments);
			// args.unshift(method);
			// return request.apply(null, args);
			unshift.call(arguments, method);
			return request.apply(null, arguments);
		};
	}

	request.get  = makeRequest('GET');
	request.post = makeRequest('POST');
	request.put  = makeRequest('PUT');
	request.del  = makeRequest('DELETE');
	request['delete'] = request.del;

	return request;

	function requestXHR(method, options, url, data, cb) {
		var i = 0, args = arguments, n = arguments.length;
		cb = typeof args[n - 1] === 'function' ? args[--n] : promiseThunkCallback();
		method = i < n ? args[i++] : undefined;
		options = i < n && typeof args[i] === 'object' && args[i++] || {};
		url = i < n ? args[i++] : undefined;
		data = i < n ? args[i++] : undefined;

		//var start = new Date;
		var xhr = new XMLHttpRequest;
		xhr.onreadystatechange = function () {
			//console.log('time:', (new Date - start) / 1000, 'sec, State:',
			//	deps.readyState[xhr.readyState]);
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var res = {statusCode: xhr.status,
						statusMessage: xhr.statusText,
						body: xhr.response};
					//xhr.getResponseHeader()
					res.headers = xhr.getAllResponseHeaders();
					res.responseURL = xhr.responseURL;
					res.type = xhr.responseType;
					try {
						if (typeof res.body === 'string')
							res.body = JSON.parse(res.body);
					} catch (e) {}
					callback(null, res);
				}
				else callback(new Error('Status ' + xhr.status + ': ' + xhr.statusText),
						{statusCode: xhr.status, statusMessage: xhr.statusText});
			}
		}
		xhr.onerror = callback;
		var called = false;
		function callback(err, res) {
			if (called) return;
			called = true;
			cb(err, res);
		}
		xhr.open(method, url, true);

		// options.headers
		if (/* options && */ options.headers)
			for (var i in options.headers)
				try { xhr.setRequestHeader(i, options.headers[i]); }
				catch (e) { console.error(e); }
		var headers = options.headers || {};
		//Object.keys(headers).map(p => {key: p.toLowerCase(), headers[])

		if (typeof data === 'string') {
			xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
			xhr.send(data); // TODO URL Encode!?
		}
		else if (typeof data !== 'undefined') {
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(data));
		}
		else xhr.send();
		return cb.promiseThunk;
	} // requestXHR

	function promiseThunkCallback() {
		var promise, resolve, reject, pending = true;
		var ctx, results, cbs = [];

		function setup(res, rej) { resolve = res; reject = rej; }

		function thunk(cb) {
			if (typeof cb === 'function') cbs.push(cb);
			results && callback.apply(ctx, results);
		}

		thunk.then = function then(res, rej) {
			promise || (promise = new Promise(setup));
			results && callback.apply(ctx, results);
			return promise.then(res, rej);
		};

		thunk['catch'] = function caught(rej) {
			promise || (promise = new Promise(setup));
			results && callback.apply(ctx, results);
			return promise['catch'](rej)
		};

		function callback(err, val) {
			results || (ctx = this, results = arguments);

			var cb;
			while (cb = cbs.shift())cb.apply(ctx, results);

			if (pending && promise) {
				pending = false;
				results[0] ? reject(results[0]) : resolve(results[1]);
			}
		}

		callback.promiseThunk = thunk;
		return callback;
	} // promiseThunkCallback

} ();

// http://js-next.hatenablog.com/entry/2013/11/28/093230
// https://ja.wikipedia.org/wiki/XMLHttpRequest
// https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest
// https://developer.mozilla.org/ja/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests
// http://www.html5rocks.com/ja/tutorials/es6/promises/
