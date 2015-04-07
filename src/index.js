function validProperty(prop, errObj){
	var validProps = ['type', 'message', 'title', 'statusCode', 'validationCode', 'data'];
	return validProps.some(function(item){
		return prop === item && (!errObj || Object.prototype.hasOwnProperty.call(errObj, prop)) ;
	});
}

function validProperties(errObj, callback){
	var atLeastOneValid = false;

	for (var prop in errObj){
		if ( validProperty(prop, errObj) ){
			atLeastOneValid = true;

			if (callback){
				callback(prop, errObj);
			}
		}
	}
	
	return atLeastOneValid;
}

function validErrorInput(passedErr){
	"use strict";
	var paramType = typeof passedErr;

	// Allow object literal with at least one valid property or a string. 
	if (paramType === 'object' && !Array.isArray(passedErr) && passedErr !== null){
		return validProperties(passedErr);
	} else if (paramType === 'string' && passedErr.trim().length){
		return true;
	}
	return false;
}

function ErrorConstructor(passedErr){
	if (!validErrorInput(passedErr)){
		this.properties = false;

	} else if (typeof passedErr === 'string') {
		this.properties = passedErr;

	} else {
		this.properties = {};

		validProperties(passedErr, function(prop, errObj){
			this.properties[prop] = errObj[prop];
		}.bind(this));
	}
} 

ErrorConstructor.prototype.returnMessage = function(msgType, callback){
	if (!this.properties){
		return 'Incorrect Error Type';

	} else if (typeof this.properties === 'string'){
		return this.properties;

	} else if (!Object.prototype.hasOwnProperty.call(this.properties, msgType)){
		return msgType + ' field not provided to the errorHandler';

	} else {
		return callback();
	}
};


ErrorConstructor.prototype.getType = function(){
	return this.returnMessage('type', function(){
		return this.properties.type;
	}.bind(this));
};

function errorHandler(passedErr){
	var errHandler = new ErrorConstructor(passedErr);
	return errHandler;
}


module.exports = {
	validProperty : validProperty,
	validProperties : validProperties,
	validErrorInput : validErrorInput,
	errorHandler: errorHandler
};