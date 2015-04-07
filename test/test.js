var test = require('tape');
var errHandler = require('../src/index');

test('Valid error input', function(t){
	t.plan(2);

	//
	t.equal(errHandler.validateErrorInput(null),  false);
});