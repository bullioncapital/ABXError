# ErrorInterface

An interface for ABX errors

## ABX Error Convention:
https://github.com/bullioncapital/dev/blob/master/coding_conventions.md#error-handling

## Install

### via npm (backend)

```sh
npm install "git@github.com:bullioncapital/errorinterface.git#master"
```

### via bower (frontend)

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

### getType()



### getTitle()



### getName()



### getMessage()



### getStatusCode()



### getValidationCode()



### getData()



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
Tape: [https://www.npmjs.com/package/tape], [https://testanything.org/]
