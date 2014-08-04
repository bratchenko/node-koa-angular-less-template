module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        folders: {
            // configurable paths
            src: 'client',
            tmp: '.tmp',
            dist: 'client-build'
        },
        less: {
            dist: {
                files: {
                    '<%=folders.tmp%>/styles/application.css': '<%=folders.src%>/styles/application.less'
                }
            }
        },
        watch: {
            less: {
                files: ['<%=folders.src%>/styles/**/*.*'],
                tasks: ['less', 'autoprefixer'],
                options: {
                    nospawn: true
                }
            },
            livereload: {
                options: {
                    livereload: 35729,
                    nospawn: true
                },
                files: [
                    '<%= folders.tmp %>/**/*.*',
                    '<%= folders.src %>/views/**/*.html',
                    '<%= folders.src %>/scripts/**/*.js',
                    '<%= folders.src %>/*.ejs'
                ]
            }
        },
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    env: {
                        ENVIRONMENT: 'development'
                    },
                    ignore: ['client/*', '.tmp/*'],
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    }
                }
            }
        },
        concurrent: {
            dev: {
                // We spawn livereload as a separate process to avoid https://github.com/gruntjs/grunt-contrib-watch/issues/231
                tasks: ['nodemon', 'watch:less', 'watch:livereload'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        autoprefixer: {
            options: ['last 2 versions'],
            dist: {
                files: [{
                    src: '<%=folders.tmp%>/styles/application.css',
                    dest: '<%=folders.tmp%>/styles/application.css'
                }]
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%=folders.dist%>'
                    ]
                }]
            }
        },
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= folders.dist %>/scripts/scripts.js',
                        '<%= folders.dist %>/scripts/libs.js',
                        '<%= folders.dist %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        useminPrepare: {
            html: ['<%=folders.src%>/index.ejs', '<%=folders.src%>/login.ejs'],
            options: {
                root: '<%= folders.src %>',
                dest: '<%= folders.dist %>',
                flow: {
                    steps: { 'js': ['uglifyjs'], 'css': ['concat', 'cssmin']},
                    post: {
                        js: [{
                            name: 'uglify',
                            createConfig: function(context) {
                                // Enable mangle for libs, but disable for app
                                // since there is no easy way to mangle angularjs app correctly
                                var options = context.options.generated;

                                options.files.forEach(function(filesConfig) {
                                    var name = require('path').basename(filesConfig.dest);
                                    context.options[name] = {
                                        files: [filesConfig],
                                        options: {
                                            mangle: filesConfig.dest.match(/libs\.js/) ? true : false
                                        }
                                    };
                                });

                                // We remove files from 'generated' task since we moved them to another task
                                context.options.generated.files.length = 0;
                            }
                        }]
                    }
                }
            }
        },
        usemin: {
            html: ['<%= folders.dist %>/index.ejs', '<%= folders.dist %>/login.ejs'],
            css: ['<%= folders.dist %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= folders.dist %>']
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%=folders.src%>/',
                        src: '*.ejs',
                        dest: '<%= folders.dist %>/'
                    },
                    {
                        expand: true,
                        cwd: '<%=folders.src%>/bower_components/bootstrap/fonts',
                        src: '*.*',
                        dest: '<%= folders.dist %>/fonts'
                    },
                    {
                        // Keep original scripts for better debugging with source maps
                        expand: true,
                        cwd: '<%=folders.src%>/scripts/',
                        src: '**/*.*',
                        dest: '<%= folders.dist %>/scripts/'
                    },
                    {
                        expand: true,
                        cwd: '<%=folders.src%>/views/',
                        src: '**/*.*',
                        dest: '<%= folders.dist %>/views/'
                    },
                    {
                        expand: true,
                        cwd: '<%=folders.src%>/images/',
                        src: '**/*.*',
                        dest: '<%= folders.dist %>/images/'
                    }
                ]
            }
        },
        uglify: {
            options: {
                sourceMap: true
            }
        }
    });

    grunt.registerTask("rev-sourcemaps", "Rename sourcemaps to match revved file", function() {
        var baseDir = require('path').join(__dirname + '/client-build/scripts');
        var files = ['scripts', 'libs'];

        for (var idx in files) {
            var file = files[idx];

            var paths = require('fs').readdirSync(baseDir);

            // Find revision of given file
            var rev, revvedFileName;
            paths.forEach(function(path) {
                var matches = path.match('^([\\w\\d]+)\\.' + file + '\\.js$');
                if (matches) {
                    rev = matches[1];
                    revvedFileName = path;
                }
            });

            if (!rev) {
                return grunt.log.error(new Error("Can't find revved version of " + file + ".js"));
            }

            var fileName = file + '.js';
            var revvedFilePath = require('path').join(baseDir, revvedFileName);
            var mapFileName = file + '.map';
            var mapFilePath = require('path').join(baseDir, mapFileName);
            var revvedMapFileName = rev + '.' + file + '.map';
            var revvedMapFilePath = require('path').join(baseDir, revvedMapFileName);

            // Rename map file adding revision
            require('fs').renameSync(mapFilePath, revvedMapFilePath);

            // Replace link to map file in generated file
            require('fs').writeFileSync(
                revvedFilePath,
                require('fs').readFileSync(revvedFilePath).toString().replace('sourceMappingURL=' + mapFileName, 'sourceMappingURL=' + revvedMapFileName)
            );

            // Replace link to file in map file
            require('fs').writeFileSync(
                revvedMapFilePath,
                require('fs').readFileSync(revvedMapFilePath).toString().replace('"file":"' + fileName, '"file":"' + revvedFileName)
            );
        }
    });

    var buildTasks = [
        'clean:dist',
        'less',
        'autoprefixer',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'copy:dist',
        'rev',
        'usemin',
        'rev-sourcemaps'
    ];
    grunt.registerTask('build', buildTasks);

    grunt.registerTask('serve', ['less', 'concurrent:dev']);

};
