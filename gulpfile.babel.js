/*
* @Author: KingYaZh
* @Date: 2018-04-17 16:57:07
* @Last Modified by: KingYaZh
* @Last Modified time: 2018-04-17 16:57:07
*/
const gulp = require('gulp');
const workbox = require('workbox-build');
const babelify = require('babelify');
const bro = require('gulp-bro');// 缓存已编译的文件，只对修改的文件进行重新编译。用更快的编译时间重复调用bro。
const changed = require('gulp-changed');// 只编译改动过的文件
const htmlmin = require('gulp-htmlmin');// html 压缩
const sass = require('gulp-sass');// 编译 sass
const autofx = require('gulp-autoprefixer');// css 浏览器前缀补全
const cleanCSS = require('gulp-clean-css');// 压缩 css
const eslint = require('gulp-eslint');// js 代码检查
const babel = require('gulp-babel');// 编译 es6 代码
const uglify = require('gulp-uglify');// js 压缩
const imagemin = require('gulp-imagemin');// 图片压缩
const cache = require('gulp-cache');// 图片缓存，图片替换了才压缩
const runSequence = require('run-sequence');// 设定同步异步执行任务
const md5 = require('gulp-md5-assets');// 添加 md5
const concat = require('gulp-concat');// 合并文件
const del = require('del');// 删除文件
const browserSync = require('browser-sync').create();// 静态服务器
const reload = browserSync.reload;


const config = require('./config/pluginConfig');

// 转移 html
gulp.task('move-html', () => {
    return gulp
        .src('./src/**/*.html')
        .pipe(changed('./dev'))
        .pipe(gulp.dest('./dev'));
});

// 压缩 html
gulp.task('minify-html', ['move-html'], () => {
    return gulp
        .src('./dev/**/*.html')
        .pipe(htmlmin(config.htmlmin))
        .pipe(gulp.dest('./build'))
    // .pipe(md5(10));
});

// 编译 sass
gulp.task('sass', () => {
    return gulp
        .src('./src/styles/**/*.{scss,css}')
        // .src('./src/styles/**/*.scss','!./src/styles/**/css.scss') // 排除文件时报错，需排查
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(autofx(config.autofx))
        .pipe(gulp.dest('./dev/styles'))
        .pipe(reload({ stream: true }));
});

// 压缩 css
gulp.task('minify-css', ['sass'], () => {
    return gulp
        .src('./dev/styles/**/*.css')
        .pipe(cleanCSS(config.cleanCSS))
        // .pipe(concat('style.css'))  // 合并匹配到的css文件并命名为 "style.css", concat 合并 js 和 css 文件，按需开启，未开启
        .pipe(gulp.dest('./build/styles'))
    // .pipe(md5(10, './build/**/*.html'));
});

// 编译 js
gulp.task('babel-js', () => {
    return (
        gulp
            .src('./src/scripts/**/*.js')
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(changed('./dev/scripts'))
            // .pipe(babel())
            .pipe(bro({ transform: ['babelify'] }))
            .pipe(gulp.dest('./dev/scripts'))
            .pipe(reload({ stream: true }))
    );
});

// 压缩js
gulp.task('minify-js', ['babel-js'], () => {
    return gulp
        .src('./dev/scripts/**/*.js')
        .pipe(uglify(config.uglify))
        // .pipe(concat('all.js'))  // 合并匹配到的js文件并命名为 "all.js", concat 合并 js 和 css 文件，按需开启，未开启
        .pipe(gulp.dest('./build/scripts'))
    // .pipe(md5(10, './build/**/*.html'));
});

// 转移图片
gulp.task('move-img', () => {
    return gulp
        .src('./src/images/**/*.{png,jpg,gif,ico}')
        .pipe(changed('./dev/images'))
        .pipe(gulp.dest('./dev/images'))
        .pipe(reload({ stream: true }));
});

// 转移图片（不压缩）
gulp.task('minify-img', ['move-img'], () => {
    return gulp
        .src('./dev/images/**/*.{png,jpg,gif,ico}')
        .pipe(gulp.dest('./build/images'))
});

// json 转移
gulp.task('move-json', () => {
    return gulp
        .src('./src/_data/*.json')
        .pipe(gulp.dest('./dev/_data'))
        .pipe(reload({ stream: true }));
});

// json 转移至 build
gulp.task('build-json', () => {
    return gulp
        .src('./src/_data/*.json')
        .pipe(gulp.dest('./build/_data'))
    // .pipe(md5(10, './build/**/*.js'));
});

// 转移 libs 插件
gulp.task('move-libs-dev', () => {
    return gulp.src('./src/libs/**/*')
        .pipe(gulp.dest('./dev/libs'));
});

gulp.task('move-libs-build', () => {
    return gulp
        .src('./src/libs/**/*')
        .pipe(gulp.dest('./build/libs'))
    // .pipe(md5(10, './build/**/*.html'));
});

// 清空文件
gulp.task('clean-dev', cb => {
    return del(['./dev/**/*'], cb);
});

gulp.task('clean-build', cb => {
    return del(['./build/**/*'], cb);
});

// 转移 mainfest.json
gulp.task('move-manifest', () => {
    return gulp
        .src('./src/manifest.json')
        .pipe(gulp.dest('./dev'))
        .pipe(reload({ stream: true }));
});

// 转移 manifest 至 build
gulp.task('build-manifest', () => {
    return gulp
        .src('./src/manifest.json')
        .pipe(gulp.dest('./build'))
});

// 配置 service worker
gulp.task('generate-service-worker', () => {
    return workbox
        .generateSW({
            cacheId: 'gulp-babel-sass-browsersync', // 设置前缀
            globDirectory: './build',
            globPatterns: ['**/*.{html,js,css,png,jpg,gif}'],
            globIgnores: [ 'sw.js' ],
            swDest: `./build/sw.js`,
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
                {
                    urlPattern: /.*\.js/,
                    handler: 'networkFirst', // 网络优先
                },
                {
                    urlPattern: /.*\.css/,
                    handler: 'staleWhileRevalidate', // 缓存优先同时后台更新
                    options: {
                        plugins: [
                            {
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        ]
                    }
                },
                {
                    urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif)/,
                    handler: 'cacheFirst', // 缓存优先
                    options: {
                        plugins: [
                            {
                                expiration: {
                                    maxAgeSeconds: 24 * 60 * 60, // 最长缓存时间,
                                    maxEntries: 50, // 最大缓存图片数量
                                }
                            }
                        ]
                    },

                },
                {
                    urlPattern: /.*\.html/,
                    handler: 'networkFirst',
                }
            ]
        })
        .then(() => {
            console.info('Service worker generation completed.');
        })
        .catch(error => {
            console.warn('Service worker generation failed: ' + error);
        });
});

// 命令行命令
// 编译
gulp.task('dev', cb => {
    runSequence(
        'clean-dev',
        'move-html',
        ['sass', 'babel-js', 'move-libs-dev'],
        'move-img',
        'move-json',
        'move-manifest',
        cb
    );
});

// 测试执行
gulp.task('run', ['dev'], () => {
    browserSync.init({// 启动Browsersync服务
        port: 18888,
        // proxy: "http://www.caissa.com", //后端服务器地址，调试接口时，不用设置浏览器跨域，修改此处的域地址
        server: {
            baseDir: './dev', // 启动服务的目录 默认 index.html
            index: 'index.html', // 自定义启动文件名
            middleware: function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        },
        open: 'external', // 决定Browsersync启动时自动打开的网址，external 表示 可外部打开 url, 可以在同一 wifi 下不同终端测试
        injectChanges: true, // 注入CSS改变
        //reloadOnRestart: false,//刷新每个浏览器时Browsersync重新启动。
        ui:{
            port: 18889,
            weinre: {
                port: 18890
            }
        }
    });

    //gulp.watch  监听文件变化
    gulp.watch('./src/styles/**/*.scss', ['sass']);
    gulp.watch('./src/scripts/**/*.js', ['babel-js']);
    gulp.watch('src/images/**/*.{png,jpg,gif,ico}', ['move-img']); //原先路径为：./src/images/**/*.{png,jpg,gif,ico} 时，监听图片没起作用，具体情况需排查，先从监听html时，图片移动，去掉 ./ 就行了。什么引起的路径问题？
    gulp.watch('./src/_data/*.json', ['move-json']);
    gulp.watch('./src/**/*.html', ['move-html']).on('change', reload);
});

// 压缩输出
gulp.task('build', cb => {
    runSequence(
        'clean-build',
        'minify-html',
        ['minify-css', 'minify-js', 'move-libs-build'],
        'minify-img',
        'build-json',
        'build-manifest',
        // 'generate-service-worker',//生产打包时服务器配置
        cb
    );
});

// 生产版本测试，生产版本不允许更改文件后实时编译输出
gulp.task('build-test', ['build'], () => {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        open: 'external'
    });
});
