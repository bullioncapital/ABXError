var test = require('tape');
var ABXError = require('../index');

/**
 * Unit Tests
 */
test('ABXError', function(t){
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

	t.equal(error.getType(), 'test', 'type should equal the provided type');
	t.equal(error.getTitle(), 'test', 'title should equal the provided title');
	t.equal(error.getMessage(), 'test', 'message should equal the provided message');
	t.equal(error.getName(), 'test', 'name should equal the provided name');
	t.equal(error.getStatusCode(), 123, 'statusCode should equal the provided statusCode');
	t.equal(error.getValidationCode(), 123, 'validationCode should equal the provided validationCode');
	t.deepEqual(error.getData(), { 'test': true }, 'data should equal the provided data');

	var error = ABXError({
		message: 'test'
	});

	t.equal(error.getType(), 'Custom', 'getType() should equal "Custom');
	t.equal(error.getTitle(), null, 'getTitle() should equal null');
	t.equal(error.getName(), null, 'getName() should equal null');
	t.equal(error.getStatusCode(), null, 'getStatusCode() should equal null');
	t.equal(error.getValidationCode(), null ,'getvalidationCode() shoudl equal null');
	t.equal(error.getData(), null ,'getData() shoudl equal null');

	t.throws(function() {
		ABXError({})
	}, Error, 'should throw because of message is not set');

	t.throws(function() {
		ABXError({
			message: 'test',
			invalid: true
		})
	}, Error, 'should throw because of an invalid property');

	t.end();
});

test('ABXError options', function(t){
	var error = ABXError({
		message: 'message',
	}, {
		defaults: {
			type: 'type',
			title: 'title',
			message: 'default message',
			name: 'name',
			statusCode: 123,
			validationCode: 456,
			data: { 'data': true }
		}
	});

	// Ensure that creating a new error does not affect older errors
	var unusedError = ABXError({
		message: 'another type',
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
	t.equal(error.getType(), 'type', 'should equal type');
	t.equal(error.getTitle(), 'title', 'should equal title');
	t.equal(error.getName(), 'name', 'should equal name');
	t.equal(error.getMessage(), 'message', 'should equal message');
	t.equal(error.getStatusCode(), 123, 'should equal 123');
	t.equal(error.getValidationCode(), 456, 'should equal 456');
	t.deepEqual(error.getData(), {'data': true} , 'should equal {data: true}');

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
		message: 'test',
	}), 'should be a valid ABXError');

	t.throws(function(){
		ABXError({
			message: 123,
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
			message: 'test',
			invalid: true,
		});
	}, 'should not be a valid ABXError');

	t.end();
});