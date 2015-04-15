"use strict";
module.exports = function(grunt){
	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require('load-grunt-tasks')(grunt);

    grunt.initConfig({
    	ngservice: {
    		default: {
    			name: 'abxError',
    			module: 'abx.errors',
    			defineModule: true,
    			exportStrategy: 'node',
    			files: {
    				'build/angular/index.js': 'index.js'
    			}
    		}
	    },
	    watch: {
		    js: {
	          	files: 'index.js',
	          	tasks: ['jshint', 'tape']
    		}
		},
	    pkg: grunt.file.readJSON('package.json'),
		jshint: {
      		files: 'index.js',
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
      	tape: {
      	      options: {
      	        pretty: true,
      	        output: 'console'
      	      },
      	      files: ['test/**/*.js']
      	    }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('test', ['jshint', 'tape']);
    grunt.registerTask('build', ['jshint', 'tape', 'ngservice:default']);
};