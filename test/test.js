var test = require('tape');
var err = require('../src/index');
var errorHandler = err.errorHandler;


test('Valid property function', function(t){
	t.plan(2);
	//should return true for valid properties and false for invalid props.
	t.equal(err.validProperty('message'),  true);
	t.equal(err.validProperty('meefewfefwe'),  false);
});


test('Valid properties', function(t){
	t.plan(2);

	//should return true if there is at least one valid property and false if there are no valid props.
	t.equal(err.validProperties({message:'test'}),  true);
	t.equal(err.validProperties({mefwefwef: 'test'}),  false);
});


test('Valid error input', function(t){
	t.plan(9);

	//Check Invalid Error Format - Must not contain null, undefined, numbers, arrays, empty objects, 
	//objects with invalid properties or empty strings.

	t.equal(err.validErrorInput(null),  false);

	t.equal(err.validErrorInput(),  false);

	t.equal(err.validErrorInput(8),  false);

	t.equal(err.validErrorInput([]),  false);

	t.equal(err.validErrorInput({}),  false);

	t.equal(err.validErrorInput(""),  false);

	t.equal(err.validErrorInput(" "),  false);

	//Approved Valid Error Format String - Objects must contain appropriate 
	//properties and strings must have at least one character

	t.equal(err.validErrorInput({type: "string" }),  true);

	t.equal(err.validErrorInput("string"),  true);
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

	var errObj = errorHandler({type:"test", message:"random message", title:"randTitle", randomProp:"testing"});	
	//Should return an error object
	t.equal(errObj.properties.type,  "test");
	t.equal(errObj.properties.message,  "random message");
	t.equal(errObj.properties.title,  "randTitle");

	//Should not return invalid properties
	t.equal(errObj.properties.randomProp,  undefined);
});



test('Determine error handling with returnMessage function is working', function(t){
	// This method is used by other get methods
	t.plan(2);

	// No parameters passed, so throw incorrect param error
	try {
		err.returnMessage();
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}

	// incorrect parameters provided, so throw incorrect error passed
	try {
		err.returnMessage('random', 'te', 'wef', 'wefwef');
		t.fail('Should throw an error');
	} catch (e) {
		t.pass('Should throw an error');
	}

});


test('Determine correct callbacks are fired for returnMessage function', function(t){
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
	t.equal(err.returnMessage('type', propObj, successCallback, failureCallback), 'test worked!');


	// Should return empty object value returned from failure callback
	t.equal(err.returnMessage('statusCode', propObj, successCallback, failureCallback), err.emptyErrorProps.statusCode); 

});


test('Determine error methods are working', function(t){
	t.plan(1);

	var sampleError = {type:"test", message:"random message", title:"randTitle", randomProp:"testing"};

	//Testing getType Method: Should return instantiated type property
	t.equal(errorHandler(sampleError).getType(),  "test");
	t.equal(errorHandler(sampleError).getType(),  "test");
});
