// merge-light.js

void function () {
	'use strict';

	function merge(dst, src) {
		for (var i = 1; src = arguments[i], i < arguments.length; ++i)
			for (var p in src)
				if (src.hasOwnProperty(p) && !dst.hasOwnProperty(p) &&
						dst[p] !== src[p]) dst[p] = src[p];
		return dst;
	}

	if (typeof module === 'object' && module && module.exports)
		module.exports = merge;

	Function('return this')()['merge-light'] = merge;
}();
