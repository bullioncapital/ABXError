/**
 * Error property types
 */
var propTypeList = {
	type: 'string',
	title: 'string',
	message: 'string',
 	name: 'string',
 	statusCode: 'number',
 	validationCode: 'number',
	data: 'object'
};

var defaultError = {
	type: 'System',
	title: '',
	message: '',
	name: '',
	statusCode: 999,
	validationCode: 999,
	data: {}
};

var defaultOptions = {
	defaults: defaultError,
	propTypes: propTypeList
};

/**
 * Extends multiple objects together
 * @private
 * @param {Object} target of the extend. Use {} if you wish to merge.
 * @param {Object} source to be extend onto the target. Can be passed multiple times
 * @returns {Object} target object with the properties of source extend onto it.
 */
function extend (target) {
    for(var i=1; i<arguments.length; ++i) {
        var from = arguments[i];
        if(typeof from !== 'object') continue;
        for(var j in from) {
            if(from.hasOwnProperty(j)) {
                target[j] = typeof from[j]==='object' ? extend({}, target[j], from[j]) : from[j];
            }
        }
    }
    return target;
}

/**
 * Constructor called by errHandler which provides methods for err props
 * @param  {string|object} error/String - An Error object generated from MD2Node;
 */
function ABXError(error, options){
	if(!(this instanceof ABXError)) {
		return new ABXError(error, options);
	}

	// Check that the correct arguments were provided
	if(['string', 'object'].indexOf(typeof error) === -1) {
		throw new Error('Required argument "error" is either missing or an invalid type');
	}

	if (['undefined', 'object'].indexOf(typeof options) === -1){
		throw new Error('Required argument "options" must either be an object or undefined');
	}

	if (typeof error === 'string'){
		console.warn("DEPRECATED: Use of error strings is being removed in favor of the standard error format");
		error = {
			message: error
		};
	}

	if(Object.keys(error).length === 0){
		throw new Error('Error object cannot be empty');
	}

	this.options = extend({}, defaultOptions, options);
	error = extend({}, this.options.defaults, error);

	if(!ABXError.isValid(error)){
		throw new Error('Incorrect error format: ' + error);
	}

	extend(this, error);
}

ABXError.prototype.getProp = function(property){
	if(!this.options.propTypes[property]){
		throw Error("Invalid property");
	} else {
		return this[property];
	}
};

/**
 * Gets type of error and returns it
 * @return {string} - return result of success or failure modifier
 */
ABXError.prototype.getType = function(){
	return this.getProp('type');
};

/**
 * Gets title of error and returns it
 * @return {string} - return result of success or failure modifier
 */
ABXError.prototype.getTitle = function(){
	return this.getProp('title');
};

/**
 * Gets name of error and returns it
 * @return {string} - return result of success or failure modifier
 */
ABXError.prototype.getName = function(){
	return this.getProp('name');
};

/**
 * Gets message of error and returns it
 * @return {string} - return result of success or failure modifier
 */
ABXError.prototype.getMessage = function(){
	return this.getProp('message');
};

/**
 * Gets statusCode of error and returns it
 * @return {number} - return result of success or failure modifier
 */
ABXError.prototype.getStatusCode = function(){
	return this.getProp('statusCode');
};

/**
 * Gets validationCode of error and returns it
 * @return {number} - return result of success or failure modifier
 */
ABXError.prototype.getValidationCode = function(){
	return this.getProp('validationCode');
};

/**
 * Gets data object of error and returns it
 * @return {object} - return result of success or failure modifier
 */
ABXError.prototype.getData = function(){
	return this.getProp('data');
};


/**
 * Determines if there is at least one valid error property passed in and provides a modifier for each valid prop. The  property is deemed valid if the prop name is matched by getProp and the prop value has the same type as type or the prop value matches default.
 * @param  {object} errObj - An Error object generated from MD2Node;
 * @return {boolean}
 */
ABXError.isValid = function(errObj){
	var index = 0;
	var keys = Object.keys(propTypeList);

	// Check that there are the same number of keys
	var valid = keys.length === Object.keys(errObj).length;

	// Check that each key has the correct type
	while(valid && index < keys.length){
		valid = (typeof errObj[keys[index]] === propTypeList[keys[index]]);
		index++;
	}

	return valid;
};

module.exports = ABXError;