var test = require('tape');
var err = require('../src/index');
var errorHandler = err.errorHandler;


test('Valid property name function', function(t){
	t.plan(2);
	//should return true for valid properties and false for invalid props.
	t.equal( err.validPropertyName('message'),  true);
	
	//Raise an exception if there is an invalid property name.
	try {
		err.validPropertyName('tqdqwt');
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}
});


test('Valid properties function', function(t){
	t.plan(4);

	// Should return true if there is at least one valid property.
	t.equal(err.validProperties({message:'test'}),  true);

	//Raise an exception if there is is an invalid property value.
	try {
		err.validProperties({type: 5});
		t.fail('Should throw an error - prop val is number, expected string');
	} catch (e) {
		t.pass('Should throw an error - prop val is number, expected string');
	}

	try {
		err.validProperties({statusCode: '55'});
		t.fail('Should throw an error - prop val is string, expected number');
	} catch (e) {
		t.pass('Should throw an error - prop val is string, expected number');
	}

	try {
		err.validProperties({data: 'string'});
		t.fail('Should throw an error - prop val is string, expected object');
	} catch (e) {
		t.pass('Should throw an error - prop val is string, expected object');
	}

});


test('Valid error parameter function', function(t){
	t.plan(9);

	// Check Invalid Error Format - Must not contain null, undefined, numbers, arrays, 
	// empty objects, objects with invalid properties or empty strings.
	t.equal(err.validErrorParameter(null),  false);
	t.equal(err.validErrorParameter(),  false);
	t.equal(err.validErrorParameter(8),  false);
	t.equal(err.validErrorParameter([]),  false);
	t.equal(err.validErrorParameter({}),  false);
	t.equal(err.validErrorParameter(""),  false);
	t.equal(err.validErrorParameter(" "),  false);

	//Approved Valid Error Format String - Objects must contain appropriate 
	//properties and strings must have at least one character
	t.equal(err.validErrorParameter({type: "string" }),  true);
	t.equal(err.validErrorParameter("string"),  true);
});


test('Instantiates and returns a custom error object', function(t){
	t.plan(2);

	var sampleError = {type:"test", message:"random message"};

	//Should return an object
	t.equal(typeof errorHandler(sampleError),  'object');

	//Should throw an err if nothing provided
	try {
		errorHandler();
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}
});


test('Determine error properties are added', function(t){
	t.plan(4);

	var errObj = errorHandler({type:"test", message:"random message", title:"randTitle"});	
	//Should return an error object
	t.equal(errObj.properties.type,  "test");
	t.equal(errObj.properties.message,  "random message");
	t.equal(errObj.properties.title,  "randTitle");

	//Should not return invalid properties
	t.equal(errObj.properties.randomProp,  undefined);
});



test('Determine error handling with returnVal function is working', function(t){
	// This method is used by other get methods
	t.plan(2);

	// No parameters passed, so throw incorrect param error
	try {
		err.returnVal();
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}

	// incorrect parameters provided, so throw incorrect error passed
	try {
		err.returnVal('random', 'te', 'wef', 'wefwef');
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}

});


test('Determine correct callbacks are fired for returnVal function', function(t){
	// Set up
	t.plan(2);
	var sampleError = {type:"test", message:"random message"};
	var propObj = errorHandler(sampleError).properties;
	var successCallback = function(msg){
		return msg + ' worked!';
	};
	var failureCallback = function(msg){
		return msg;
	};

	// Should return success callback method as type prop is present
	t.equal(err.returnVal('type', propObj, successCallback, failureCallback), 'test worked!');

	// Should return empty object value returned from failure callback
	t.equal(err.returnVal('statusCode', propObj, successCallback, failureCallback), err.emptyErrorProps.statusCode); 
});


test('Determine error methods are returning expected callbacks', function(t){
	t.plan(12);

	var sampleErrorType = {type:"testType"};
	var sampleErrorTitle = {title:"testTitle"};
	var sampleErrorMessage = {message:"random message"};
	var sampleErrorStatusCode = {statusCode: 234};
	var sampleErrorValidationCode = {validationCode: 234};
	var sampleErrorData = {data: {prop: 'prop'}};

	// Testing getType Method: Should return instantiated type property
	t.equal(errorHandler(sampleErrorType).getType(),  "testType");
	// Testing getType Method: Should return null as no type property exists
	t.equal(errorHandler(sampleErrorMessage).getType(),  err.emptyErrorProps.type);

	// Testing getTitle Method: Should return instantiated type property
	t.equal(errorHandler(sampleErrorTitle).getTitle(),  "testTitle");
	// Testing getTitle Method: Should return null as no title property exists
	t.equal(errorHandler(sampleErrorMessage).getTitle(),  err.emptyErrorProps.title);

	// Testing getMessage Method: Should return instantiated message property
	t.equal(errorHandler(sampleErrorMessage).getMessage(),  "random message");
	// Testing getMessage Method: Should return null as no message property exists
	t.equal(errorHandler(sampleErrorTitle).getMessage(),  err.emptyErrorProps.message);

	// Testing getStatusCode Method: Should return instantiated statusCode property
	t.equal(errorHandler(sampleErrorStatusCode).getStatusCode(), 234);
	// Testing getStatusCode Method: Should return default number as no statusCode property exists
	t.equal(errorHandler(sampleErrorMessage).getStatusCode(), err.emptyErrorProps.statusCode);

	// Testing getValidationCode Method: Should return instantiated validation property
	t.equal(errorHandler(sampleErrorValidationCode).getValidationCode(),  234);
	// Testing getValidationCode Method: Should return default number as no validation property exists
	t.equal(errorHandler(sampleErrorMessage).getValidationCode(),  err.emptyErrorProps.validationCode);

	// Testing getData Method: Should return instantiated data property
	t.equal(typeof errorHandler(sampleErrorData).getData(),  "object");
	// Testing getData Method: Should return null as no data property exists
	t.equal(errorHandler(sampleErrorMessage).getData(),  err.emptyErrorProps.data);
});


test('Username use case test', function(t){
	t.plan(6);
	var errObj = {
		type: "Invalid Username",
		title: "Username is already taken",
		message: "Please try another username as this one is taken",
	};

	// Defined properties should return instantiated properties
	t.equal(errorHandler(errObj).getType(),  "Invalid Username");
	t.equal(errorHandler(errObj).getTitle(),  "Username is already taken");
	t.equal(errorHandler(errObj).getMessage(),  "Please try another username as this one is taken");

	// Undefined properties should fallback to emptyErrorProps
	t.equal(errorHandler(errObj).getData(), err.emptyErrorProps.data);
	t.equal(errorHandler(errObj).getStatusCode(), err.emptyErrorProps.statusCode);
	t.equal(errorHandler(errObj).getValidationCode(), err.emptyErrorProps.validationCode);
});















