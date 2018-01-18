// var path = require('path');
var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  // concat = require('gulp-concat'),
  del = require('del'),
  // rename = require('gulp-rename'),
  revAppend = require('gulp-rev-append'),
  // cleanCSS = require('gulp-clean-css'),
  gutil = require('gulp-util'),
  include = require('gulp-html-tag-include'),
  // minify = require('gulp-minify'),
  // sourcemaps = require('gulp-sourcemaps'),
  // uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  webpack = require('webpack');
// WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

var num = {
  webpack: 0,
  webpackError: 0,
  version: 0,
  HTML: 0,
  SCSS: 0
};


function fnConsoleBegin(v) {
  v = '<!-- ' + v + '于' + (new Date().toLocaleTimeString()) + ' -->';
  console.log(gutil.colors.bgYellow(v));
}

function fnConsoleError(v) {
  v = '<!-- ' + v + '于' + (new Date().toLocaleTimeString()) + ' -->';
  console.log(gutil.colors.bgRed(v));
}
//彩色输入操作成功控件台
function fnConsole(v) {
  v = '<!-- ' + v + '于' + (new Date().toLocaleTimeString()) + ' -->';
  console.log(gutil.colors.bgGreen(v));
}

var isBuild = false; //是否是生产环境配置，webpack时用到
var opts = {
  srcPath: './src/',
  destPath: './dist/',
  minRename: {
    suffix: '.min'
  }
};
var cssStyles = ['compressed', 'expanded'],
  cssStyle = cssStyles[1]; //生成css格式，压缩、展开

//复制文件至目标目录
var copyFiles = function() {
  gulp.src('./src/staticResources/scripts/**')
    .pipe(gulp.dest(opts.destPath + '/scripts/'));

  gulp.src('./src/staticResources/images/**')
    .pipe(gulp.dest(opts.destPath + '/images/'));

  gulp.src('./src/staticResources/fonts/**')
    .pipe(gulp.dest(opts.destPath + '/fonts/'));

  gulp.src('./src/staticResources/files/**')
    .pipe(gulp.dest(opts.destPath + '/files/'));

  gulp.src('./src/staticResources/css/*.css')
    .pipe(gulp.dest(opts.destPath + '/css/'));

  fnConsole('静态文件复制完成');
};

//清理文件
// gulp.task('clean', function(cb) {
//   del([driDist + 'css/', dirDist + 'scripts/bundle/'], cb);
// });

//压缩、链接资源类
// gulp.task('uglify', function() {
//   gulp.src(opts.destPath + 'scripts/bundle/*.js')
//     .pipe(uglify())
//     .pipe(gulp.dest(opts.destPath + 'scripts/bundle'));
//   // .pipe(rename({suffix:'.min'}))
// });

// gulp.task('minify', function() {
//   gulp.src(opts.destPath + 'scripts/bundle/*.js')
//     .pipe(minify({
//       exclude: ['tasks'],
//       ignoreFiles: ['.combo.js', '-min.js']
//     }))
//     .pipe(gulp.dest(opts.destPath + 'scripts/bundle'));
// });
//文件添加版本号， 在HTML中写入 ** .js ? rev = @hash
function fnRev() {
  fnConsoleBegin('打下版本号');
  gulp.src('./*.html')
    .pipe(revAppend())
    .pipe(gulp.dest('.'));
  fnConsole('版本号打好啦-v' + num.version++);
}
gulp.task('rev', fnRev);
//outputStyle:compressed,expanded
function fnSass() {
  gulp.src(opts.srcPath + 'scss/*.scss')
    .pipe(sass({
      outputStyle: cssStyle
    }).on('error', sass.logError))
    .pipe(gulp.dest(opts.destPath + 'css'));
  //文档目录生成
  if (!isBuild) {
    gulp.src(opts.srcPath + 'scss/common.scss')
      .pipe(sass({
        outputStyle: cssStyle
      }).on('error', sass.logError))
      .pipe(gulp.dest('./docs/'));
  }
}
gulp.task('preSass', fnSass);
gulp.task('sass', ['preSass'], fnRev);

//组装HTML（加版本号，include标签引入文件）
var htmlConfig = {
  base: './src/htmls/components/',
  src: 'htmls/pc/'
};

function fnAssembleHTML() {
  fnConsoleBegin('组装HTML开始');
  del([opts.destPath + htmlConfig.src + '*.html']).then(function() {
    gulp.src('./src/' + htmlConfig.src + '*.html')
      .pipe(include())
      // .pipe(revAppend())
      .pipe(gulp.dest('./')).on('end', function() {
        fnConsole('组装HTML结束-v' + num.HTML++);
        fnRev();
      });
  });
}
gulp.task('preAssembleHTML', fnAssembleHTML);
gulp.task('assembleHTML', ['preAssembleHTML'], function() {});

//传给webpack用
function fnWebpack(callback) {
  fnConsoleBegin('Webapck 开始');
  var newConfig = webpackConfig;
  // [opts.destPath + '/scripts/bundle/*.*']
  del(['dist/scripts/bundle/*.*', '!dist/scripts/bundle/APP.bundle.js']).then(function() {
    webpack(
      newConfig,
      function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        // gutil.log('[webpack]',stats.toString({}))
        if (stats.compilation.errors[0]) {
          var numError = num.webpackError++;
          fnConsoleError('webpack编译出错-v' + numError + '，↓↓↓↓↓');
          console.log(stats.compilation.errors[0].error);
          fnConsoleError('webpack编译出错-v' + numError + '，↑↑↑↑↑↑');
        } else {
          typeof callback == 'function' && callback();
        }
      });
  });
}
gulp.task('webpack', ['sass'], function() {
  fnWebpack(function() {
    fnConsole('webpack 结束-v' + num.webpack++);
    fnAssembleHTML();
  });
});

var fnGulpWatchFilesChangedThenWebpack = function() {
  watch('./src/scripts/**/*.*', function() {
    fnWebpack(function() {
      fnConsole('webpack 结束-v' + num.webpack++);
      fnRev();
    });
  });
};
//根据文件类型变动，自动刷新浏览器
function fnBrowserSync() {
  copyFiles();
  browserSync.init({
    // files: ['dist/css/*.css', 'dist/scripts/bundle/APP.bundle.js', './dist/htmls/**/*.html', '!**.scss', '!node_modules/**.*'],
    files: ['dist/css/*.css'], //只热更新CSS样式
    server: { baseDir: './' },
    port: 3018,
    // codeSync: false,
    ghostMode: false,
    // https: true
  });
  gulp.watch('./src/htmls/**/*.html', fnAssembleHTML);
  gulp.watch('./src/scss/**/*.scss', fnSass);
  gulp.watch('./dist/css/*.css', function() {
    fnConsole('SCSS编译结束，刷新页面查看-v' + num.SCSS++);
    // setTimeout(fnRev, 10);
  });
  if (!webpackConfig.watch) {
    fnGulpWatchFilesChangedThenWebpack();
  }
  // gulp.watch('./src/htmls/**/*.html', ['assembleHTML', 'webpack']);
}
gulp.task('browserSync', ['webpack'], fnBrowserSync);

//构建、上线前压缩下JS，压缩CSS
function fnPreBuild() {
  cssStyle = cssStyles[0];
  isBuild = true;
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      }
    }));
  webpackConfig.devtool = 'cheap-module-source-map';
}
gulp.task('preBuild', fnPreBuild);
//上线启动
gulp.task('build', ['preBuild', 'browserSync'], function() {
  fnConsole('Builded successfully, enjoy!');
});

//默认启动任务
gulp.task('default', ['browserSync'], function() {
  // gulp.start('minify','cleancss')
  fnConsole('开启默认任务，此时不启动webpack自带watch,用gulp watch可处理新加文件。enjoy!');
});

//启动webpack,watch:true,此时不用gulp-watch之后再webpack,速度快，但webpack不能处理新加文件
function fnPreWatch() {
  webpackConfig.watch = true;
}
gulp.task('preWatch', fnPreWatch);
gulp.task('ww', ['preWatch', 'browserSync'], function() {
  fnConsole('此时开启webpack自带watch选项，不能处理新加模块，如需处理启动gulp默认任务。。enjoy!');
});