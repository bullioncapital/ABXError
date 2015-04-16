"use strict";
module.exports = function(grunt){
	// load all grunt tasks matching the ['grunt-*', '@*/grunt-*'] patterns
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		ngservice: {
			index: {
				name: 'AbxError',
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
				files: ['index.js', 'test/test.js'],
				tasks: ['build']
			}
		},
		jshint: {
			files: 'index.js',
			options: {
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
		},
		bump: {
		   options: {
		     files: ['package.json', 'bower.json'],
		     updateConfigs: [],
		     commit: true,
		     commitMessage: 'Release v%VERSION%',
		     commitFiles: ['-a'],
		     createTag: true,
		     tagName: 'v%VERSION%',
		     tagMessage: 'Version %VERSION%',
		     push: true,
		     pushTo: 'origin',
		     gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
		     globalReplace: false,
		     prereleaseName: false,
		     regExp: false
		   }
		 },
	});

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('test', ['jshint', 'tape']);
	grunt.registerTask('build', ['test', 'ngservice:index']);
	grunt.registerTask('package', ['build', 'bump']);
};