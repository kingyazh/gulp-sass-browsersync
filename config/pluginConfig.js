/*
* @Author: KingYaZh
* @Date: 2018-04-17 18:37:47
* @Last Modified by: KingYaZh
* @Last Modified time: 2018-04-17 18:37:47
*/
/*
   gulp 插件的配置文件
*/

// gulp-htmlmin
exports.htmlmin = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
};

exports.autofx = {
    browsers: [
        'ie >= 8',
        'ie_mob >= 8',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ],
    cascade: true,
    remove: true
};

exports.cleanCSS = {
    compatibility: 'ie8',
    keepSpecialComments: '*'
};

exports.uglify = {
    mangle: {
        // except: ['require', 'exports', 'module', '$']
        reserved: ['require', 'exports', 'module', '$']
    }
};
