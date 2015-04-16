var test = require('tape');
var ABXError = require('../index');

/**
 * Unit Tests
 */
test('ABXError construction', function(t){
	var error = ABXError({
		type: 'test',
		title: 'test',
		message: 'test',
		name: 'test',
		statusCode: 123,
		validationCode: 123,
		data: { 'test': true }
	});

	t.throws(function(){
		ABXError(undefined)
	}, Error, 'error argument cannot be undefined');

	t.throws(function(){
		ABXError(null)
	}, Error, 'error argument cannot be null');

	t.throws(function(){
		ABXError(123)
	}, Error, 'error argument cannot be a number');

	t.throws(function(){
		ABXError(function(){})
	}, Error, 'error argument cannot be a function');

	t.throws(function(){
		ABXError(error, function() {})
	}, Error, 'options argument cannot be a function');

	t.throws(function(){
		ABXError(error, "test")
	}, Error, 'options argument cannot be a string');

	t.throws(function(){
		ABXError(error, 123)
	}, Error, 'options argument cannot be a number');

	t.ok(error instanceof ABXError, 'ABXError() should return an instance of ABXError');

	t.equal(error.type, 'test', 'type should equal the provided type');
	t.equal(error.title, 'test', 'title should equal the provided title');
	t.equal(error.message, 'test', 'message should equal the provided message');
	t.equal(error.name, 'test', 'name should equal the provided name');
	t.equal(error.statusCode, 123, 'statusCode should equal the provided statusCode');
	t.equal(error.validationCode, 123, 'validationCode should equal the provided validationCode');
	t.deepEqual(error.data, { 'test': true }, 'data should equal the provided data');

	var error = ABXError({
		type: 'test',
	});
	t.equal(error.title, '', 'title should equal the default title');
	t.equal(error.message, '', 'message should equal the default message');
	t.equal(error.name, '', 'name should equal the default name');
	t.equal(error.statusCode, 999, 'statusCode should equal the default statusCode');
	t.equal(error.validationCode, 999, 'validationCode should equal the default validationCode');
	t.deepEqual(error.data, {}, 'data should equal the default data');

	var error = ABXError({
		message: 'test',
	});

	t.equal(error.type, 'System', 'type should equal the default title');

	t.throws(function() {
		ABXError({})
	}, Error, 'should throw because of no valid properties');

	t.throws(function() {
		ABXError({
			title: 'test',
			invalid: true
		})
	}, Error, 'should throw because of an invalid property');

	t.end();
});

test('ABXError usage', function(t){
	var error = ABXError({
		type: 'type',
		title: 'title',
		message: 'message',
		name: 'name',
		statusCode: 123,
		validationCode: 456,
		data: { 'data': true }
	});

	// Check that the getter functions work correctly
	t.equal(error.getType(), 'type', 'should equal type');
	t.equal(error.getTitle(), 'title', 'should equal title');
	t.equal(error.getName(), 'name', 'should equal name');
	t.equal(error.getMessage(), 'message', 'should equal message');
	t.equal(error.getStatusCode(), 123, 'should equal 123');
	t.equal(error.getValidationCode(), 456, 'should equal 456');
	t.deepEqual(error.getData(), {'data': true} , 'should equal {data: true}');

	var error = ABXError({
		type: 'another type',
	}, {
		defaults: {
			type: 'type',
			title: 'title',
			message: 'message',
			name: 'name',
			statusCode: 123,
			validationCode: 456,
			data: { 'data': true }
		}
	});

	// Ensure that creating a new error does not affect older errors
	var unusedError = ABXError({
		type: 'another type',
	}, {
		defaults: {
			type: 'unused type',
			title: 'unused title',
			message: 'unused message',
			name: 'unused name',
			statusCode: 123456,
			validationCode: 456789,
			data: { 'data': false }
		}
	});

	// Check that default values work correctly
	t.equal(error.getTitle(), 'title', 'should equal title');
	t.equal(error.getName(), 'name', 'should equal name');
	t.equal(error.getMessage(), 'message', 'should equal message');
	t.equal(error.getStatusCode(), 123, 'should equal 123');
	t.equal(error.getValidationCode(), 456, 'should equal 456');
	t.deepEqual(error.getData(), {'data': true} , 'should equal {data: true}');

	var error = ABXError({
		title: 'another type',
	}, {
		defaults: {
			type: 'type',
		}
	});

	t.equal(error.getType(), 'type', 'should equal type');

	t.end();
});

test('ABXError.isValid', function(t){
	t.ok(ABXError({
		type: 'test',
		title: 'test',
		message: 'test',
		name: 'test',
		statusCode: 123,
		validationCode: 123,
		data: { 'test': true }
	}), 'should be a valid ABXError');

	t.ok(ABXError({
		type: 'test',
	}), 'should be a valid ABXError');

	t.throws(function(){
		ABXError({
			type: 123,
		});
	}, 'should not be a valid ABXError');

	t.throws(function(){
		ABXError({});
	}, 'should not be a valid ABXError');

	t.throws(function(){
		ABXError({
			invalid: true,
		});
	}, 'should not be a valid ABXError');

	t.throws(function(){
		ABXError({
			type: 'test',
			invalid: true,
		});
	}, 'should not be a valid ABXError');

	t.end();
});