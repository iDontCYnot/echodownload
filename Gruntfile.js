module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    //cleanup
    clean: {
      dist: ['bin/', 'dist/', 'lib/']
    },

    //copy come files
    copy: {
      chrome: {
        expand: true,
        src: ['src/chrome/**', 'bin/shared/**'],
        dest: 'bin/chrome',
        flatten: true,
        filter: 'isFile'
      },
      chrome_lib: {
        expand: true,
        src: ['lib/**'],
        dest: 'bin/chrome/lib',
        flatten: true,
        filter: 'isFile'
      },
      safari: {
        expand: true,
        src: ['src/safari/**', 'bin/shared/**'],
        dest: 'bin/safari.safariextension',
        flatten: true,
        filter: 'isFile'
      },
      safari_lib: {
        expand: true,
        src: ['lib/**'],
        dest: 'bin/safari.safariextension/lib',
        flatten: true,
        filter: 'isFile'
      }
    },

    //do bower things
    bower: {
      options: {
      	targetDir: "./lib"
      },
      install: {
        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },

    coffee: {
      compile: {
        files: {
          'bin/shared/browserComms.min.js': [
            'src/BrowserComms.coffee'
          ],
          'bin/shared/content.min.js': [
            'src/MediaLink.coffee',
            'src/HtmlLink.coffee',
            'src/ResourceFiles.coffee',
            'src/DomMutator.coffee',
            'src/Lecture.coffee',
            'src/EchoDl.coffee',
            'src/content.coffee'
          ],
          'bin/shared/background.min.js': [
            'src/EchoDlService.coffee',
            'src/background.coffee'
          ]
        }
      }
    },

    sass: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      dist: {
        files: {
          'bin/shared/banner_styles.css': 'src/banner_styles.scss'
        }
      }
    },

    removelogging: {
      dist: {
        src: "bin/shared/*.js" // Each file will be overwritten with the output!
      }
    },

    //zip it all up
    compress: {
      chrome: {
        options: {
          archive: 'dist/<%= pkg.name %>_chrome.zip'
        },
        files: [
          { expand: true, src : '**/*', cwd : 'bin/chrome' }
        ]
      }
    },

    //replace version number
    sed: {
      chrome: {
        path: 'bin/chrome/manifest.json',
        pattern: '%VERSION%',
        replacement: '<%= pkg.version %>'
      },
      safari: {
        path: 'bin/safari.safariextension/info.plist',
        pattern: '%VERSION%',
        replacement: '<%= pkg.version %>'
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks("grunt-remove-logging");
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'bower', 'coffee', 'sass', 'copy', 'sed'])
  grunt.registerTask('dist', ['clean', 'bower', 'coffee', 'removelogging', 'sass', 'copy', 'sed', 'compress']);

};
