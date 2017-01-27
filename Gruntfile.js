module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // Combine js and css files
    concat: {
      options: {
        stripBanners: true,
        sourceMap: true
      },

      js: {
        src: ['src/js/lib/*.js', 'src/js/main.js', 'src/js/messages.js', 'src/js/handlers/*.js'],
        dest: 'dist/js/app.js'
      },

      admin: {
        src: ['src/admin/js/main.js', 'src/admin/js/handlers/*.js'],
        dest: 'dist/admin/js/app.js'
      },

      css: {
        src: ['src/css/font-awesome.css', 'src/css/boot-template.css', 'src/css/jquery-ui.css', 'src/css/jquery-ui.structure.css', 'src/css/jquery-ui.theme.css', 'src/css/leaflet.css', 'src/css/leaflet.draw.css', 'src/css/boot-forms.css', 'src/css/boot-checkbox.css', 'src/css/animate.css', 'src/css/main.css'],
        dest: 'dist/css/app.css'
      }

    },

    //minify js
    uglify: {
      app: {
        options: {
          preserveComments: false
        },
        files: {
          'dist/js/app.min.js': ['<%= concat.js.dest %>'],
          'dist/admin/js/app.min.js': ['<%= concat.admin.dest %>']
        }
      }
    },

    //minify css
    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      my_target: {
        src: 'dist/css/app.css',
        dest: 'dist/css/app.min.css'
      }
    },

    //update version number in index.html
    'string-replace': {
      dist: {
        files: {
          'dist/index.html': 'src/index.html'
        },
        options: {
          replacements: [{
            pattern: /<!-- package.version -->/ig,
            replacement: '<%= pkg.version %>'
          },
          {
            pattern: /<!-- build.env -->/ig,
            replacement: function () {
              if (grunt.config.get('pkg.production') == 'true'){
                return '.min';
              }
              else {
                return '';
              }
            }
          }]
        }
      }
    },

    //copy
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: false, src: ['src/.htaccess'], dest: 'dist/.htaccess', dot: true},
          {expand: true, cwd: 'src/templates/', src: ['**/*.html'], dest: 'dist/templates'},
          {expand: true, cwd: 'src/fonts/', src: ['**'], dest: 'dist/fonts'},
          {expand: true, cwd: 'src/img/', src: ['**/*'], dest: 'dist/img'},
          {expand: false, cwd: 'src/img/uploads/', src: ['**'], dest: 'dist/img/uploads'},
          {expand: true, cwd: 'src/js/lib/polyfiller/', src: ['**/*'], dest: 'dist/js/lib/polyfiller'},
          {expand: true, cwd: 'src/admin/config', src: ['**/*.php'], dest: 'dist/admin/config'},
          {expand: true, cwd: 'src/config/', src: ['**/*.php'], dest: 'dist/config'},
          {expand: true, cwd: 'src/admin/templates/', src: ['**/*.html'], dest: 'dist/admin/templates'},
          {expand: false, src: ['src/admin/index.html'], dest: 'dist/admin/index.html'},
          {expand: false, src: ['src/db/data.sqlite'], dest: 'dist/db/data.sqlite'}
        ],
      },
    },

    sync: {
      main: {
        files: [
          {cwd: 'src/img', src: ['*.png', '*.jpg', '*.gif', '*.svg'], dest: 'dist/img/'},
          {cwd: 'src/templates', src: ['**/*.html'], dest: 'dist/templates'},
          {cwd: 'src/config', src: ['**/*.php'], dest: 'dist/config'},
          {cwd: 'src/admin/templates', src: ['**/*.html'], dest: 'dist/admin/templates'},
          {cwd: 'src/admin/config', src: ['**/*.php'], dest: 'dist/admin/config'},
          {cwd: 'src/admin', src: ['index.html'], dest: 'dist/admin'}
        ],

        failOnError: true, // Fail the task when copying is not possible. Default: false 
        updateAndDelete: false, // Remove all files from dest that are not found in src. Default: false 
        compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime" 
     
      }
    },

    clean: {
      folder: ['dist']
    },

    watch: {
      options: {
        nospawn: true,
        event: 'all',
        interrupt: false,
        interval: 1000,
        debounceDelay: 1000
      },
      css: {
        files: ['src/css/*.css'],
        tasks: ['concat:css', 'cssmin']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['concat:js', 'uglify']
      },
      admin: {
        files: ['src/admin/js/**/*.js'],
        tasks: ['concat:admin', 'uglify']
      },
      html: {
        files: ['src/index.html'],
        tasks: ['string-replace']
      },
      templates: {
        files: ['src/img/*.png', 'src/img/*.jpg', 'src/img/*.gif', 'src/img/*.svg', 'src/templates/**/*.html', 'src/config/**/*.php', 'src/admin/templates/**/*.html', 'src/admin/config/**/*.php', 'src/admin/index.html'],
        tasks: ['sync']
      }
    },


    compress: {
      main: {
        options: {
          archive: 'archive/<%= pkg.version %>.zip'
        },
        files: [
          {expand: true, cwd: 'dist/', src: ['**'], dot:true}
        ]
      }
    }


  });

  //main build tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-css');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-string-replace');

  //secondary build tasks
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sync');
  grunt.loadNpmTasks('grunt-contrib-compress');

  //main watch tasks
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['watch']);
  grunt.registerTask('zip', ['compress']);
  grunt.registerTask('build', ['clean', 'concat', 'uglify', 'cssmin', 'string-replace', 'copy']);

};