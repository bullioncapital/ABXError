var test = require('tape');
var errHandler = require('../src/index');

test('Valid property function', function(t){
	t.plan(2);
	//should return true for valid properties and false for invalid props.
	t.equal(errHandler.validProperty('message'),  true);
	t.equal(errHandler.validProperty('meefewfefwe'),  false);
});

test('Valid properties', function(t){
	t.plan(2);

	//should return true if there is at least one valid property and false if there are no valid props.
	t.equal(errHandler.validProperties({message:'test'}),  true);
	t.equal(errHandler.validProperties({mefwefwef: 'test'}),  false);
});


test('Valid error input', function(t){
	t.plan(9);

	//Check Invalid Error Format - Must not contain null, undefined, numbers, arrays, empty objects, 
	//objects with invalid properties or empty strings.

	t.equal(errHandler.validErrorInput(null),  false);

	t.equal(errHandler.validErrorInput(),  false);

	t.equal(errHandler.validErrorInput(8),  false);

	t.equal(errHandler.validErrorInput([]),  false);

	t.equal(errHandler.validErrorInput({}),  false);

	t.equal(errHandler.validErrorInput(""),  false);

	t.equal(errHandler.validErrorInput(" "),  false);


	//Approved Valid Error Format String - Objects must contain appropriate 
	//properties and strings must have at least one character

	t.equal(errHandler.validErrorInput({type: "string" }),  true);

	t.equal(errHandler.validErrorInput("string"),  true);
});


test('Instantiates and returns a custom error object', function(t){
	t.plan(1);

	var errObj = errHandler.errorHandler();	
	//Should return an error object
	t.equal(typeof errObj,  'object');
});

test('Determine error properties are added', function(t){
	t.plan(4);

	var errObj = errHandler.errorHandler({type:"test", message:"random message", title:"randTitle", randomProp:"testing"});	
	//Should return an error object
	t.equal(errObj.properties.type,  "test");
	t.equal(errObj.properties.message,  "random message");
	t.equal(errObj.properties.title,  "randTitle");

	//Should not return invalid properties
	t.equal(errObj.properties.randomProp,  undefined);
});

test('Determine error methods are working', function(t){
	t.plan(1);

	var errObj = errHandler.errorHandler({type:"test", message:"random message", title:"randTitle", randomProp:"testing"});	
	//Should return an error object
	t.equal(errObj.getType(),  "test");
});