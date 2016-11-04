const request = require('../light-request');
//const aa = require('aa');
const aa = gen => function cb(err, val) {
	const obj = err ? gen.throw(err) : gen.next(val);
	obj.done || (obj.value)(cb); } ();

aa(function *() {
	try {
		const res = yield request.get('http://xxxx');
		console.log('res.statusCode:', res.statusCode);
		console.log('res.statusMessage:', res.statusMessage);
		console.log('res.body:', res.body);
		console.log('res.headers:', res.headers);
	} catch (err) {
		console.error('***', err);
	}
} ());
