"use strict";
module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      	watch: {
		    js: {
	          	files: [
	          		'*.js',
		            '*/*.js',
		            '*/angular-concat/*.js',
		            '!index.js',
		            '!node_modules/*.js',
	            ],
	          	tasks: ['jshint', 'execute', 'concat', 'replace']
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
      	},
      	concat: {
      		buildFile: {
      			src : ['build/angular-concat/prepend.js', 'build/index.js', 'build/angular-concat/append.js'],
      			dest: 'index.js'
      		}
      	},
      	replace: {
      		moduleToReturn: {
      			src: ['index.js'],
      			dest: 'index.js',
      			replacements: [{
      				from: "module.exports =",
      				to: "return"
      			}]
      		}
      	}
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('test', ['jshint', 'execute']);
    grunt.registerTask('build', ['jshint', 'execute', 'concat', 'replace']);
};