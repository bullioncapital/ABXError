/**
 * Holds default properties to use if none provided
 */
var emptyErrorProps = {
	type: null,
	title: null,
	message: null,
	statusCode: 999,
	validationCode: 999,
	data: null
};

/**
 * Expected property value types for error object
 */
var validErrorTypes = {
	type: 'string',
	title: 'string',
	message: 'string',
	statusCode: 'number',
	validationCode: 'number',
	data: 'object'
};

/**
 * Determines if prop is a valid property
 * @param  {string} prop - A prop name;
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
function validPropertyName(prop){
	var validProps = ['type', 'title', 'message', 'statusCode', 'validationCode', 'data'];
	var valid = validProps.some(function(item){
		return prop === item;
	});
	if(!valid){
		throw Error("Invalid Property Name");
	}
	return true;
}

/**
 * Determines if there is at least one valid error property passed in and provides a callback for each valid prop. The  property is deemed valid if the prop name is returned true by validPropertyName and the prop value has the same type as validErrorTypes or the prop value matches emptyErrorProps.
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
function validProperties(errObj, callback){
	var atLeastOneValid = false;

	for (var prop in errObj){
		if(Object.prototype.hasOwnProperty.call(errObj, prop) && validPropertyName(prop)){

			if(typeof errObj[prop] !== validErrorTypes[prop] && 
				errObj[prop] !== emptyErrorProps[prop]){

				throw Error("Invalid Property Value On Error Object");
			}

			atLeastOneValid = true;
			if (typeof callback === 'function'){
				callback(prop, errObj);
			}

		}
	}
	
	return atLeastOneValid;
}

/**
 * Determines whether passedErr is a legitimate object or string.
 * @param  {object|string} passedErr - An Error object generated from MD2Node;
 * @return {boolean}
 */
function validErrorParameter(passedErr){
	var paramType = typeof passedErr;

	if (paramType === 'object' && !Array.isArray(passedErr) && passedErr !== null){
		return validProperties(passedErr);
	} else if (paramType === 'string' && passedErr.trim().length){
		return true;
	}
	return false;
}

/**
 * Constructor called by errHandler which provides methods for err props
 * @param  {string|object} passedErr/String - An Error object generated from MD2Node;
 */
function ErrorConstructor(passedErr){
	this.properties = JSON.parse(JSON.stringify(emptyErrorProps));

	if (!validErrorParameter(passedErr)){
		throw Error('Incorrect Error Type Passed To Constructor');

	} else if (typeof passedErr === 'string') {
		this.properties.type = passedErr;

	} else {
		// Attach passedErr props to properties object.
		validProperties(passedErr, function(prop, errObj){
			this.properties[prop] = errObj[prop];
		}.bind(this));
	}
} 

/**
 * Used by each get method to return a value
 * @param  {string} valType - the type of value to be called;
 * @param  {object} errObj - the properties object of the constructed error obj
 * @param  {function} successCallback - function to be called if successful
 * @param  {function} failureCallback - function to be called if invalid properties
 * @return {string} - return result of success or failure callback
 */
function returnVal(valType, errorObj, successCallback, failureCallback){
	if (typeof valType === 'string' && validPropertyName(valType) && 
			typeof errorObj === 'object' && validProperties(errorObj) && 
			typeof successCallback === 'function' && 
			typeof failureCallback === 'function'){
		
		if ( errorObj[valType] === emptyErrorProps[valType] ){
			return failureCallback( errorObj[valType] );

		}
		return successCallback( errorObj[valType] );

	}

	throw Error("Incorrect Parameters Provided");
}

/**
 * Gets type of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getType = function(){
	return returnVal('type', this.properties, function(type){
			return type;
		}, function(type){
			return type;
		});
};

/**
 * Gets title of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getTitle = function(){
	return returnVal('title', this.properties, function(title){
			return title;
		}, function(title){
			return title;
		});
};

/**
 * Gets message of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getMessage = function(){
	return returnVal('message', this.properties, function(message){
			return message;
		}, function(message){
			return message;
		});
};

/**
 * Gets statusCode of error and returns it
 * @return {number} - return result of success or failure callback
 */
ErrorConstructor.prototype.getStatusCode = function(){
	return returnVal('statusCode', this.properties, function(statusCode){
			return statusCode;
		}, function(statusCode){
			return statusCode;
		});
};

/**
 * Gets validationCode of error and returns it
 * @return {number} - return result of success or failure callback
 */
ErrorConstructor.prototype.getValidationCode = function(){
	return returnVal('validationCode', this.properties, function(validationCode){
			return validationCode;
		}, function(validationCode){
			return validationCode;
		});
};

/**
 * Gets data object of error and returns it
 * @return {object} - return result of success or failure callback
 */
ErrorConstructor.prototype.getData = function(){
	return returnVal('data', this.properties, function(data){
			return data;
		}, function(data){
			return data;
		});
};

/**
 * Provides a wrapper to Instantiate ErrorConstructor
 * @param  {string|object} passedErr/String - An Error object generated from MD2Node;
 * @return {object} - Provides methods to interact with method properties
 */
function errorHandler(passedErr){
	var errHandler = new ErrorConstructor(passedErr);
	return errHandler;
}

var attachMethods = {
	"emptyErrorProps" : emptyErrorProps,
	"validPropertyName": validPropertyName,
	"validProperties": validProperties,
	"validErrorParameter": validErrorParameter,
	"returnVal": returnVal
};

for (var prop in attachMethods){
	if (attachMethods.hasOwnProperty(prop)){
		errorHandler[prop] = attachMethods[prop];
	}
}

module.exports = errorHandler;