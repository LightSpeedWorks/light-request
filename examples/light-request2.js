// support browser <script src="">
// support common.js, node.js, browserify: require('');
// support ES5
// do not use ES6 (ES2015) or later

//  var request = require('light-request');
//  p = request(method, [options], url, [data]);
//     method: GET, POST, PUT, DELETE

//  p = request.get([options], url);
//  p = request.post([options], url, [data]);
//  p = request.put([options], url, [data]);
//  p = request.del([options], url, [data]);
//  p = request.delete([options], url, [data]);

//  options: {headers: {'x-get-data': true}}


(this || {}).request = function () {
	'use strict';

/*
	// Array.prototype.forEach for ie8
	if (!Array.prototype.hasOwnProperty('forEach'))
		Array.prototype.forEach = function forEach(fn, ctx) {
			for (var i = 0, n = this.length; i < n; ++i)
				fn.call(ctx, this[i], i, this);
		};
*/

	var slice = [].slice;

	var request = requestXHR;
	//var deps = {readyState: [
	//		'0: UNSENT, uninitialized: not open',
	//		'1: OPENED, loading: not send',
	//		'2: HEADERS_RECEIVED, loaded: status & headers',
	//		'3: LOADING, interactive: download in progress',
	//		'4: DONE, complete']};

	//request.setDefaultHeaders(headers)

	function yyy(method) {
		return function (opts, url, data, cb) {
			var args = slice.call(arguments);
			args.unshift(method);
			return request.apply(null, args);
		};
	}

	request.get  = yyy('GET');
	request.post = yyy('POST');
	request.put  = yyy('PUT');
	request.del  = yyy('DELETE');
	request['delete'] = request.del;
/*
	request.get  = function (opts, url, data, cb) {
		return request('GET',    opts, url, data, cb); };
	request.post = function (opts, url, data, cb) {
		return request('POST',   opts, url, data, cb); };
	request.put  = function (opts, url, data, cb) {
		return request('PUT',    opts, url, data, cb); };
	request.del  = function (opts, url, data, cb) {
		return request('DELETE', opts, url, data, cb); };
	request['delete'] = request.del;
*/

	return request;

	function requestXHR(method, options, url, data, cb) {
		var i = 0, a = arguments, n = arguments.length;
		cb = typeof a[n - 1] === 'function' ? a[--n] : promiseThunkCallback();
		method = i < n ? a[i++] : undefined;
		options = i < n && typeof a[i] === 'object' && a[i++] || {};
		url = i < n ? a[i++] : undefined;
		data = i < n ? a[i++] : undefined;

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
		if (options && options.headers)
			for (var i in options.headers)
				try { xhr.setRequestHeader(i, options.headers[i]); }
				catch (e) { console.error(e); }
		if (typeof data === 'string') {
			// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
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
			if (typeof cb === 'function')
				cbs.push(cb);
			if (results !== undefined)
				callback.apply(ctx, results);
		}

		thunk.then = function then(res, rej) {
			if (promise === undefined)
				promise = new Promise(setup);
			if (results !== undefined)
				callback.apply(ctx, results);
			return promise.then(res, rej);
		};

		thunk['catch'] = function caught(rej) {
			if (promise === undefined)
				promise = new Promise(setup);
			if (results !== undefined)
				callback.apply(ctx, results);
			return promise['catch'](rej)
		};

		function callback(err, val) {
			if (results === undefined)
				ctx = this, results = arguments;

			cbs.forEach(function (cb) { cb.apply(ctx, results); });
			cbs = [];

			if (pending && promise !== undefined) {
				if (results[0]) reject(results[0]);
				else resolve(results[1]);
				pending = false;
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
