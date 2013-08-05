/*
 * assemble-bootstrap
 * http://github.com/assemble/assemble-bootstrap
 *
 * Copyright (c) 2013 Jon Schlinkert
 * MIT License
 */

module.exports = function(grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    // Load Bootstrap's config data.
    site: grunt.file.readYAML('vendor/bootstrap/_config.yml'),

    // Run Bootstrap's own Gruntfile.
    subgrunt: {
      test: {
        options: {task: 'test'},
        src: ['vendor/bootstrap']
      },
      js: {
        options: {task: 'dist-js'},
        src: ['vendor/bootstrap']
      },
      css: {
        options: {task: 'dist-css'},
        src: ['vendor/bootstrap']
      },
      dist: {
        options: {task: 'dist'},
        src: ['vendor/bootstrap']
      },
      all: {
        options: {task: 'default'},
        src: ['vendor/bootstrap']
      }
    },

    // Regex for refactor task.
    replacements: require('./tasks/replacements').init(grunt),

    // Refactor Liquid to Handlebars so we can
    // build with Assemble instead of Jekyll
    refactor: {
      liquid: {
        options: {
          replacements: '<%= replacements.regex.patterns %>'
        },
        files: [{
            expand: true,
            cwd: 'vendor/bootstrap',
            src: ['*.html', '_layouts/*.html', '_includes/*.html', '!js/**'],
            dest: 'tmp/',
            ext: '.hbs'
          }
        ]
      }
    },

    assemble: {
      options: {
        site: '<%= site %>',
        flatten: true,
        assets: 'tmp/assets',
        partials: 'tmp/_includes/*.hbs',
        layoutdir: 'tmp/_layouts',
        layout: 'default.hbs'
      },
      docs: {
        src: ['tmp/*.hbs'],
        dest: 'tmp/'
      }
    },

    copy: {
      libs: {
        files: {
          'tmp/assets/js/highlight.js': ['vendor/highlightjs/highlight.pack.js'],
          'tmp/assets/css/github.css':  ['vendor/highlightjs/styles/github.css']
        }
      },
      assets: {
        files: [
          {expand: true, cwd: 'vendor/bootstrap',      src: ['assets/**'], dest: 'tmp/'},
          {expand: true, cwd: 'vendor/bootstrap/dist', src: ['**'], dest: 'tmp/assets/'}
        ]
      }
    },

    clean: {
      dist: ['tmp/**']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-refactor');
  grunt.loadNpmTasks('assemble');

  // Load local "Subgrunt" task to run Bootstrap's Gruntfile.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['subgrunt:dist', 'copy', 'refactor', 'assemble']);
};
