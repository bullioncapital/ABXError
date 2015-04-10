# ErrorInterface
Error Interface for parsing Errors

# ErrorInterface tldr;
```js
	// serverErr provided by server when some form of error occurs.
	// Provides methods, success/failure callbacks optional.
	// If no callbacks are provided, it simply returns the value.
	errorInterface(serverErr).getName();
```

# ErrorInterface Functionality
```js
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
```

### Requirements:
Node/NPM/Grunt

### Related to backend error handling:
https://github.com/bullioncapital/dev/blob/master/coding_conventions.md#error-handling

### Tests:
Tape: https://github.com/Jam3/jam3-testing-tools#tape

### Installation:
```sh
$ git clone https://github.com/bullioncapital/errorinterface.git
$ npm install
$ npm start // Runs JSHint and Tests on file changes
``` 

### Run tests
```
npm test
```