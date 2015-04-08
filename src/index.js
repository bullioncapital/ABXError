/**
 * Empty error props is an object with properties to be used if props provided are missing.
 */
var emptyErrorProps = {
	type: null,
	message: null,
	statusCode: 999,
	validationCode: 999,
	data: null
};

/**
 * Determines if prop is a valid property
 * @param  {string} prop - A prop name;
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
function validProperty(prop){
	var validProps = ['type', 'message', 'title', 'statusCode', 'validationCode', 'data'];
	return validProps.some(function(item){
		return prop === item ;
	});
}

/**
 * Determines if there is at least one valid error property passed in and provides a callback for each valid prop.
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
function validProperties(errObj, callback){
	var atLeastOneValid = false;

	for (var prop in errObj){
		if ( validProperty(prop) && Object.prototype.hasOwnProperty.call(errObj, prop) ){
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
function validErrorInput(passedErr){
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

	if (!validErrorInput(passedErr)){
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
 * Used by each get method to return a message
 * @param  {string} msgType - the type of message to be called;
 * @param  {object} errObj - the properties object of the constructed error obj
 * @param  {function} successCallback - function to be called if successful
 * @param  {function} failureCallback - function to be called if invalid properties
 * @return {string} - return result of success or failure callback
 */
function returnMessage(msgType, errorObj, successCallback, failureCallback){
	if (typeof msgType === 'string' && validProperty(msgType) && 
			typeof errorObj === 'object' && validErrorInput(errorObj) && 
			typeof successCallback === 'function' && typeof failureCallback === 'function'){
		
		if ( errorObj[msgType] === emptyErrorProps[msgType] ){
			return failureCallback( errorObj[msgType] );

		}
		return successCallback( errorObj[msgType] );
			
	}

	throw Error("Incorrect Parameters Provided");
}

/**
 * Gets type of error and returns it
 * @return {string} - return result of success or failure callback
 */
ErrorConstructor.prototype.getType = function(){
	return returnMessage('type', this.properties, function(msg){
			return msg;
		}, function(msg){
			return msg;
		});
};


// Instantiate ErrorContstuctor with passed in Error
/**
 * Provides a wrapper to Instantiate ErrorConstructor
 * @param  {string|object} passedErr/String - An Error object generated from MD2Node;
 * @return {object} - Provides methods to interact with method properties
 */
function errorHandler(passedErr){
	var errHandler = new ErrorConstructor(passedErr);
	return errHandler;
}

module.exports = {
	emptyErrorProps : emptyErrorProps,
	validProperty : validProperty,
	validProperties : validProperties,
	validErrorInput : validErrorInput,
	errorHandler: errorHandler,
	returnMessage: returnMessage
};