/**
 * Array with name, default val and accepted types of error properties.
 */
var errPropList = [{
		errName: 'type',
		errDefault: null, 
		errType: 'string'
	}, {
		errName: 'title',
		errDefault: null, 
		errType: 'string'
	}, {
		errName: 'message',
		errDefault: null, 
		errType: 'string'
	}, {
		errName: 'name',
		errDefault: null, 
		errType: 'string'
	},{
		errName: 'statusCode',
		errDefault: 999, 
		errType: 'number'
	}, {
		errName: 'validationCode',
		errDefault: 999, 
		errType: 'number'
	}, {
		errName: 'data',
		errDefault: null, 
		errType: 'object'
}];

/**
 * Get Prop Obj determines if the prop exists on the actual object and then determines if the
 * property is a legitimate error property by looping through errPropList.
 * @param  {string} propName - A prop name;
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
function getProp(propName, errObj){
	if(errObj && !Object.prototype.hasOwnProperty.call(errObj, propName)){
		return false;
	}

	for (var i = 0; i < errPropList.length; i++){
		if(errPropList[i].errName === propName){
			return errPropList[i];
		}
	}

	throw Error("Invalid Property Name: " + propName);
}

/**
 * Determines if there is at least one valid error property passed in and provides a callback for each valid prop. The  property is deemed valid if the prop name is matched by getProp and the prop value has the same type as errType or the prop value matches errDefault.
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
function validProperties(errObj, callback){
	var valid = false;

	for (var propName in errObj){
		var propObj = getProp(propName, errObj);

		if(propObj){
			if(typeof errObj[propName] !== propObj.errType && 
				errObj[propName] !== propObj.errDefault){

				throw Error("Invalid Property Value On Error Object");
			}

			valid = true;
			if (typeof callback === 'function'){
				callback(propName, errObj);
			}
		}
	}
	
	return valid;
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
 * Creates a copy of default properties in errPropList.
 * @return {object}
 */
function getDefault() {
	var defaultObj = {};
	for (var i = 0; i < errPropList.length; i++) {
		defaultObj[errPropList[i].errName] = errPropList[i].errDefault;
	}
	return defaultObj;
}

/**
 * Constructor called by errHandler which provides methods for err props
 * @param  {string|object} passedErr/String - An Error object generated from MD2Node;
 */
function ErrorConstructor(passedErr){
	this.properties = getDefault();

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
function returnVal(propName, errorObj, successCallback, failureCallback){
	if (typeof propName === 'string' && getProp(propName) && 
			typeof errorObj === 'object' && validProperties(errorObj) && 
			typeof successCallback === 'function' && 
			typeof failureCallback === 'function'){
		
		if ( errorObj[propName] === getProp(propName).errDefault ){
			return failureCallback( errorObj[propName] );
		}

		return successCallback( errorObj[propName] );
	}

	throw Error("Incorrect Parameters Provided");
}

/**
 * Default callback to use when get callback is not set
 * @return {string} - returns the value passed in.
 */
function defaultCallback(val){
	return val;
}

/**
 * Gets type of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getType = function(successCallback, failureCallback){
	return returnVal('type', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Gets title of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getTitle = function(successCallback, failureCallback){
	return returnVal('title', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Gets name of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getName = function(successCallback, failureCallback){
	return returnVal('name', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Gets message of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getMessage = function(successCallback, failureCallback){
	return returnVal('message', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Gets statusCode of error and returns it
 * @return {number} - return result of success or failure callback
 */
ErrorConstructor.prototype.getStatusCode = function(successCallback, failureCallback){
	return returnVal('statusCode', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Gets validationCode of error and returns it
 * @return {number} - return result of success or failure callback
 */
ErrorConstructor.prototype.getValidationCode = function(successCallback, failureCallback){
	return returnVal('validationCode', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Gets data object of error and returns it
 * @return {object} - return result of success or failure callback
 */
ErrorConstructor.prototype.getData = function(successCallback, failureCallback){
	return returnVal('data', this.properties, successCallback || defaultCallback, failureCallback || defaultCallback);
};

/**
 * Provides a wrapper to Instantiate ErrorConstructor
 * @param  {string|object} passedErr/String - An Error object generated from MD2Node;
 * @return {object} - Provides methods to interact with method properties
 */
function errorInterface(passedErr){
	var interfaceInstance = new ErrorConstructor(passedErr);
	return interfaceInstance;
}

/**
 * Attaches methods to errorInterface for testing.
 */
var attachMethods = {
	"getProp": getProp,
	"errPropList": errPropList,
	"validProperties": validProperties,
	"validErrorParameter": validErrorParameter,
	"returnVal": returnVal
};

for (var prop in attachMethods){
	if (attachMethods.hasOwnProperty(prop)){
		errorInterface[prop] = attachMethods[prop];
	}
}

module.exports = errorInterface;