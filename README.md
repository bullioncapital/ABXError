# ErrorInterface

An interface for ABX errors.

## ABX Error Convention:
https://github.com/bullioncapital/dev/blob/master/coding_conventions.md#error-handling

## Install

### via npm (for the library as a node module)

```sh
npm install "git@github.com:bullioncapital/errorinterface.git#master"
```

### via bower (for the library as an Angular service)

```sh
bower install "git@github.com:bullioncapital/errorinterface.git#master"
```

## ErrorInterface API

```js
//Backend
var ErrorInterface = require('ErrorInterface');
var error = new ErrorInterface(error);
console.log(error.getMessage());


//Frontend
myApp.controller("myController", ["errorInterface", function(ErrorInterface)){
	var error = new ErrorInterface(error);
	console.log(error.getMessage());
}
```

## Options 

### defaults

(key, value) object of default values.

| DEPRECATED: The default argument is deprecated on all functions. It should only be used in cases where the API is returning an error in the old format.

### propTypes 

(key, value) object to specify what type a property should be

| DEPRECATED: The default argument is deprecated on all functions. It should only be used in cases where the API is returning an error in the old format.

### logger

TODO

## ABX Object functions

### getType()

Returns the error type


### getTitle()

Returns the error title

### getName()

Returns the error name

### getMessage()

Returns the error name

### getStatusCode()

Returns the error name

### getValidationCode()

Returns the error name

### getData()

Returns the error name

## ABXError functions

### ABXError.isValid(error)

{object} error - Error object to check

Validates if an object is a valid ABXError object

## Development commands

```sh
// Grunt commands
grunt // starts development environment
grunt test // run test suite
grunt build // build framework variations of the library (e.g. angularJS)

// NPM
npm start // `grunt` alias
npm test // `grunt test` alias
npm build // `grunt build` alias
```

## Test Suite:
Tape: https://www.npmjs.com/package/tape, https://testanything.org/
