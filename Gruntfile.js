module.exports = function(grunt) {
  /* Instructions:
  Run 'grunt' in a terminal tab
  Run 'grunt' launch in a second tab


  DISCLAIMER: This grunt file will deal with initial setup of the database.
    In order for it to work after the database exists, you must delete the whole thing.
  */

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'server/*.js','server/**/*.js'], //'client/app/*.js', 'client/app/**/*.js',
      options: {
	     	asi: true,
		    laxbreak: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['client/app/*.js', 'client/app/**/*.js', 'server/*.js','server/**/*.js'],
      tasks: ['jshint'],
      options : { nospawn : true }
    },
    exec: {
      init_db: {
        cmd: 'initdb dev_db/'
      },
      run_db: {
        cmd: 'postgres -D dev_db/'
      },
      drop_db: {
        cmd: 'dropdb dev_db/'
      },
      config_db: {
        cmd: 'createdb dev_db'
      },
      init_schemas: {
        cmd: 'node server/schema.js'
      },
      seed_db: {
        cmd: 'node server/seeds/seeder.js'
      },
      launch_app: {
        cmd: 'npm start'
      }
    },
    fixmyjs: {
      options: {
        config: '.jshintrc',
        indentpref: 'spaces'
      },
      test: {
        files: [
          {expand: true, cwd: 'test/fixtures', src: ['**/*.js'], dest: 'test/actual/', ext: '.js'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-fixmyjs');

  grunt.registerTask('default',  ['jshint', 'exec:init_db', 'exec:run_db']);
  grunt.registerTask('launch',   ['exec:config_db', 'exec:init_schemas', 'exec:seed_db', 'exec:launch_app']);
};
