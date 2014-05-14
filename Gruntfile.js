module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //cleanup
    clean: {
      dist: ['bin/', 'dist/']
    },

    //copy come files
    copy: {
      files: {
        expand: true,
        cwd: 'src',
        src: ['manifest.json', 'active.html'],
        dest: 'bin/',
        flatten: true,
        filter: 'isFile'
      },
      asset: {
        expand: true,
        cwd: 'src/asset',
        src: '**',
        dest: 'bin/asset/',
        flatten: true,
        filter: 'isFile'
      }
    },

    //get ugly
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        options: {
          compress: {
            drop_console: true
          }
        },
        files: {
          'bin/content.min.js': ['src/content.js', 'src/dom.js', 'src/logs.js', 'lib/jquery-1.11.1.min.js', 'lib/moment.min.js'],
          'bin/background.min.js': ['src/background.js']
        }
      },
      debug: {
        options: {
          mangle: false
        },
        files: {
          'bin/content.min.js': ['src/content.js', 'src/dom.js', 'src/logs.js', 'lib/jquery-1.11.1.min.js', 'lib/moment.min.js'],
          'bin/background.min.js': ['src/background.js']
        }
      }
    },

    //zip it all up
    compress: {
      main: {
        options: {
          archive: 'dist/<%= pkg.name %>.zip'
        },
        files: [
          {expand: true, cwd: 'bin/', src: ['**'], dest: '/'}
        ]
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'copy', 'uglify:debug']);
  grunt.registerTask('dist', ['clean', 'copy', 'uglify:dist', 'compress']);

};
