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

    //do bower things
    bower: {
      options: {
      	targetDir: "./bin/lib"
      },
      install: {
        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },

    coffee: {
      compile: {
        files: {
          'bin/content.min.js': [
            'src/BrowserComms.coffee',
            'src/MediaLink.coffee',
            'src/HtmlLink.coffee',
            'src/ResourceFiles.coffee',
            'src/DomMutator.coffee',
            'src/Lecture.coffee',
            'src/EchoDl.coffee',
            'src/content.coffee'
          ],
          'bin/background.min.js': [
            'src/BrowserComms.coffee',
            'src/EchoDlService.coffee',
            'src/background.coffee'
          ]
        }
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
          'bin/content.min.js': ['bin/content.min.js'],
          'bin/background.min.js': ['bin/background.min.js']
        }
      },
    },

    //zip it all up
    compress: {
      main: {
        options: {
          archive: 'dist/<%= pkg.name %>.zip'
        },
        files: [
          { expand: true, src : '**/*', cwd : 'bin/' }
        ]
      }
    },

    //replace version number
    sed: {
      version: {
        path: 'bin/manifest.json',
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['clean', 'bower', 'copy', 'coffee', 'sed']);
  grunt.registerTask('dist', ['clean', 'bower', 'copy', 'coffee', 'uglify', 'sed', 'compress']);

};
