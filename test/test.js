var test = require('tape');
var errorInterface = require('../index');

/**
 * Typical Use Case Test with explanation
 */
test('Username use case test', function(t){
	t.plan(5);

	// Example Error Object Sent From Server
	var errObj = {
		type: "Invalid Username",
		title: "Username is already taken",
		message: "Please try another username as this one is taken",
	};

	// errorInterface takes the Error Object sent from server and returns an interface
	// object for interacting with the error. The interface object has a number of methods,
	// including getType, getTitle, getMessage, getName, getStatusCode, getValidationCode and
	// getData.
	var err = errorInterface(errObj);

	// example: getType will return the type provided in errObj;
	var type = err.getType();

	// All methods available on the interface object have optional success/failure callbacks.
	// Success callbacks are called when the property was found on the error object.
	// Failure callbacks are called when the property was not found/set.
	// When no success or failure callbacks are provided, the property val will simply be returned.
	var successCallback = function(val){
		return "Err: " + val;
	};
	var failureCallback = function(val){
		return "Not sure what went wrong!";
	};

	// Utilizing default return;
	t.equal( type,  "Invalid Username");

	// Utilizing success callback
	t.equal(err.getTitle(successCallback),  "Err: Username is already taken");
	t.equal(err.getMessage(successCallback),  "Err: Please try another username as this one is taken");

	// Undefined properties utilize failureCallBack
	t.equal(err.getData(null, failureCallback), "Not sure what went wrong!");
	t.equal(err.getStatusCode(null, failureCallback), "Not sure what went wrong!");

	// Other notes: Including properties that are not valid will throw an exception - this
	// is to enforce consistency. Valid properties can be found here:
	// https://github.com/bullioncapital/dev/blob/master/coding_conventions.md#error-handling
});


/**
 * Unit Tests
 */
test('Valid property name function', function(t){
	t.plan(2);
	//should return true for valid properties and false for invalid props.
	t.ok( errorInterface.getProp('message'),  "Should return a truthy value");

	//Raise an exception if there is an invalid property name.
	try {
		errorInterface.getProp('tqdqwt');
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}
});

test('Valid properties function', function(t){
	t.plan(4);

	// Should return true if there is at least one valid property.
	t.equal(errorInterface.validProperties({message:'test'}),  true);

	//Raise an exception if there is is an invalid property value.
	try {
		errorInterface.validProperties({type: 5});
		t.fail('Should throw an error - prop val is number, expected string');
	} catch (e) {
		t.pass('Should throw an error - prop val is number, expected string');
	}

	try {
		errorInterface.validProperties({statusCode: '55'});
		t.fail('Should throw an error - prop val is string, expected number');
	} catch (e) {
		t.pass('Should throw an error - prop val is string, expected number');
	}

	try {
		errorInterface.validProperties({data: 'string'});
		t.fail('Should throw an error - prop val is string, expected object');
	} catch (e) {
		t.pass('Should throw an error - prop val is string, expected object');
	}

});

test('Valid error parameter function', function(t){
	t.plan(9);

	// Check Invalid Error Format - Must not contain null, undefined, numbers, arrays,
	// empty objects, objects with invalid properties or empty strings.
	t.equal(errorInterface.validErrorParameter(null),  false);
	t.equal(errorInterface.validErrorParameter(),  false);
	t.equal(errorInterface.validErrorParameter(8),  false);
	t.equal(errorInterface.validErrorParameter([]),  false);
	t.equal(errorInterface.validErrorParameter({}),  false);
	t.equal(errorInterface.validErrorParameter(""),  false);
	t.equal(errorInterface.validErrorParameter(" "),  false);

	//Approved Valid Error Format String - Objects must contain appropriate
	//properties and strings must have at least one character
	t.equal(errorInterface.validErrorParameter({type: "string" }),  true);
	t.equal(errorInterface.validErrorParameter("string"),  true);
});

test('Instantiates and returns a custom error object', function(t){
	t.plan(2);

	var sampleError = {type:"test", message:"random message"};

	//Should return an object
	t.equal(typeof errorInterface(sampleError),  'object');

	//Should throw an err if nothing provided
	try {
		errorInterface();
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}
});

test('Determine error properties are added', function(t){
	t.plan(3);

	var errObj = errorInterface({type:"test", message:"random message", title:"randTitle"});
	//Should return an error object
	t.equal(errObj.properties.type,  "test");
	t.equal(errObj.properties.message,  "random message");
	t.equal(errObj.properties.title,  "randTitle");
});

test('Determine error handling with returnVal function is working', function(t){
	// This method is used by other get methods
	t.plan(2);

	// No parameters passed, so throw incorrect param error
	try {
		errorInterface.returnVal();
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}

	// incorrect parameters provided, so throw incorrect error passed
	try {
		errorInterface.returnVal('random', 'te', 'wef', 'wefwef');
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}

});

test('Determine correct callbacks are fired for returnVal function', function(t){
	// Set up
	t.plan(2);
	var sampleError = {type:"test", message:"random message"};
	var propObj = errorInterface(sampleError).properties;
	var successCallback = function(msg){
		return msg + ' worked!';
	};
	var failureCallback = function(msg){
		return msg;
	};

	// Should return success callback method as type prop is present
	t.equal(errorInterface.returnVal('type', propObj, successCallback, failureCallback), 'test worked!');

	// Should return empty object value returned from failure callback
	t.equal(errorInterface.returnVal('statusCode', propObj, successCallback, failureCallback), errorInterface.getProp('statusCode').errDefault);
});

test('Determine error methods are returning expected callbacks', function(t){
	t.plan(14);

	var sampleErrorType = {type:"testType"};
	var sampleErrorTitle = {title:"testTitle"};
	var sampleErrorName = {name:"testName"};
	var sampleErrorMessage = {message:"random message"};
	var sampleErrorStatusCode = {statusCode: 234};
	var sampleErrorValidationCode = {validationCode: 234};
	var sampleErrorData = {data: {prop: 'prop'}};

	// Testing getType Method: Should return instantiated type property
	t.equal(errorInterface(sampleErrorType).getType(),  "testType");
	// Testing getType Method: Should return null as no type property exists
	t.equal(errorInterface(sampleErrorMessage).getType(),  errorInterface.getProp('type').errDefault);

	// Testing getTitle Method: Should return instantiated type property
	t.equal(errorInterface(sampleErrorTitle).getTitle(),  "testTitle");
	// Testing getTitle Method: Should return null as no title property exists
	t.equal(errorInterface(sampleErrorMessage).getTitle(),  errorInterface.getProp('title').errDefault);

	// Testing getName Method: Should return instantiated type property
	t.equal(errorInterface(sampleErrorTitle).getTitle(),  "testTitle");
	// Testing getTitle Method: Should return null as no title property exists
	t.equal(errorInterface(sampleErrorMessage).getTitle(),  errorInterface.getProp('title').errDefault);

	// Testing getMessage Method: Should return instantiated message property
	t.equal(errorInterface(sampleErrorMessage).getMessage(),  "random message");
	// Testing getMessage Method: Should return null as no message property exists
	t.equal(errorInterface(sampleErrorTitle).getMessage(),  errorInterface.getProp('message').errDefault);

	// Testing getStatusCode Method: Should return instantiated statusCode property
	t.equal(errorInterface(sampleErrorStatusCode).getStatusCode(), 234);
	// Testing getStatusCode Method: Should return default number as no statusCode property exists
	t.equal(errorInterface(sampleErrorMessage).getStatusCode(), errorInterface.getProp('statusCode').errDefault);

	// Testing getValidationCode Method: Should return instantiated validation property
	t.equal(errorInterface(sampleErrorValidationCode).getValidationCode(),  234);
	// Testing getValidationCode Method: Should return default number as no validation property exists
	t.equal(errorInterface(sampleErrorMessage).getValidationCode(),  errorInterface.getProp('validationCode').errDefault);

	// Testing getData Method: Should return instantiated data property
	t.equal(typeof errorInterface(sampleErrorData).getData(),  "object");
	// Testing getData Method: Should return null as no data property exists
	t.equal(errorInterface(sampleErrorMessage).getData(),  errorInterface.getProp('data').errDefault);
});