"use strict";
module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      	watch: {
		    js: {
	          	files: [
	          		'*.js',
		            '*/*.js',
		            '!node_modules/*.js',
	            ],
	          	tasks: ['jshint', 'execute']
    		}
		},
	    pkg: grunt.file.readJSON('package.json'),
		jshint: {
      		files: [
      			'*.js',
	            '*/*.js',
	            '!node_modules/*.js',
	        ],
	    	options: {
	        // options here to override JSHint defaults
	        	node: true,
		        globals: {
		        	console: true,
		        	module: true,
					require: true
		        }
		    }
      	},
      	execute: {
      		target: {
      			src: ['test/test.js']
      		}
      	}
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('test', ['execute']);
};