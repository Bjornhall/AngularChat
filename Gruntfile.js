module.exports = function(grunt){
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		//pkg: grunt.file.readJSON('package.json'),
		jshint: {
			src: ['js/controllers/*.js'],
			gruntfile: ['Gruntfile.js'],
			options: {
				curly:  true,
				immed:  true,
				newcap: true,
				noarg:  true,
				sub:    true,
				boss:   true,
				eqnull: true,
				node:   true,
				undef:  true,
				globals: {
					_:       false,
					jQuery:  false,
					angular: false,
					moment:  false,
					console: false,
					$:       false,
					io:      false
				}
			}
		},
		/*concat: {
			options: {
				separator: "\n\n"
			},
			dist: {
				src: ['js/*.js'], // taka úr controllers möppunni...
				dest: 'js/angchat.js' //<%= pkg.name %>.js'
			}
		},*/
		uglify: {
			my_target: {
				files: {
					'js/angchat.min.js' : ['js/app.js']
				}
			}
		}
	});

	// tasks
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};