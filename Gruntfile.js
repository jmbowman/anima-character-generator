/*global module: false, require: false */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: ['build'],
            css: ['build/css/fuelux.min.css', 'build/css/styles.min.css']
        },
        concat: {
            options: {
                separator: ''
            },
            css: {
                src: ['css/bootstrap.min.css', 'build/css/fuelux.min.css', 'build/css/styles.min.css'],
                dest: 'build/css/styles.css'
            }
        },
        copy: {
            html: {
                files: [
                    {
                        src: ['index.html'],
                        dest: 'build/'
                    }
                ],
                options: {
                    processContent: function (content) {
                        // Adjust CSS and JS tags to use minified files
                        content = content.replace(/<link rel="stylesheet" href="css\/bootstrap\.min\.css" media="screen" \/>/, '');
                        content = content.replace(/<link rel="stylesheet" href="css\/fuelux\.css" \/>/, '');
                        content = content.replace(/styles\.css/, 'styles.css');
                        content = content.replace(/data-main="js\/main" src="js\/libs\/require\.js"/, 'src="js/main.js"');
                        return content;
                    }
                }
            },
            fonts: {
                files: [
                    {
                        src: ['fonts/glyphicons-*.*'],
                        dest: 'build/'
                    }
                ]
            }
        },
        cssmin: {
            fuelux: {
                src: 'css/fuelux.css',
                dest: 'build/css/fuelux.min.css'
            },
            styles: {
                src: 'css/styles.css',
                dest: 'build/css/styles.min.css'
            }
        },
        jsdoc: {
            all: {
                src: ['js/*.js'],
                dest: 'doc'
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/*.js'],
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                onevar: true,
                regexp: true,
                trailing: true,
                undef: true,
                unused: true,
                white: true
            }
        },
        md5: {
            all: {
                files: {
                    'build/css': 'build/css/styles.css',
                    'build/js': 'build/js/main.js'
                },
                options: {
                    keepBasename: true,
                    keepExtension: true,
                    afterEach: function (fileChange) {
                        var fs = require('fs'),
                            content = fs.readFileSync('build/index.html', 'utf8'),
                            newPath = fileChange.newPath,
                            oldPath = fileChange.oldPath;
                        fs.unlink(oldPath);
                        content = content.replace(oldPath.replace('build/', ''),
                                                  newPath.replace('build/', ''));
                        fs.writeFileSync('build/index.html', content);
                    }
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './js',
                    findNestedDependencies: true,
                    logLevel: 3,
                    mainConfigFile: './js/config.js',
                    name: 'libs/almond',
                    include: 'main',
                    optimize: 'uglify2',
                    optimizeCss: 'none',
                    out: './build/js/main.js',
                    wrap: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-md5');

    grunt.registerTask('build', ['clean:all', 'requirejs', 'cssmin', 'concat', 'clean:css', 'copy', 'md5']);
    grunt.registerTask('default', ['jshint']);

};
