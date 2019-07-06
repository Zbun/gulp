/**
 * gulp 配置文件，总共2个命令
 * 1、gulp 默认命令，启用browserSync服务器+webpack middleware热模块加载
 * 2、gulp build: 压缩生成CSS及JS，此时没用sourcemap文件，上线时使用，速度最慢
 */

// var path = require('path');
var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  del = require('del'),
  // rename = require('gulp-rename'),
  revAppend = require('gulp-rev-append'),
  gutil = require('gulp-util'),
  include = require('gulp-html-tag-include'),

  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config.js');


var exec = require('child_process').exec;
function killProcess() {//结束进程，在purebuild打包模式使用
  console.log(gutil.colors.bgRed('2S后结束进程'));
  var cmdPid = process.ppid;
  setTimeout(function () {
    exec(`taskkill /pid ${cmdPid}`, function (error, stdout, stderr) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("成功");
      }
    });
  }, 2000);
}

var num = {
  webpack: 0,
  webpackError: 0,
  version: 0,
  HTML: 0,
  SCSS: 0
};

function fnConsoleBegin(v) {
  v = '<!-- ' + v + '于' + (new Date().toLocaleTimeString()) + ' -->';
  // console.log(gutil.colors.bgYellow(v));
  console.log(v);
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
var isPureBuild = false;//自信模式，纯打包，没做测试
var opts = {
  srcPath: './src/', //源文件目录
  destPath: './dist/',

  minRename: {
    suffix: '.min'
  }
};
var cssStyles = ['compressed', 'expanded'],
  cssStyle = cssStyles[1]; //生成css格式，压缩、展开

//复制文件至目标目录
var copyFiles = function () {
  gulp.src('./src/staticResources/scripts/**')
    .pipe(gulp.dest(opts.destPath + '/scripts/'));

  del([opts.destPath + '/images/**/*']).then(function () {
    gulp.src('./src/staticResources/images/**')
      .pipe(gulp.dest(opts.destPath + '/images/'));
  });

  gulp.src('./src/staticResources/fonts/**')
    .pipe(gulp.dest(opts.destPath + '/fonts/'));

  gulp.src('./src/staticResources/files/**')
    .pipe(gulp.dest(opts.destPath + '/files/'));

  gulp.src('./src/staticResources/css/*.css')
    .pipe(gulp.dest(opts.destPath + '/css/'));

  fnConsole('静态文件复制完成');
};

//文件添加版本号， 在HTML中写入 ** .js ? rev = @hash
function fnRev() {
  fnConsoleBegin('打下版本号');
  gulp.src('./*.html')
    .pipe(revAppend())
    .pipe(gulp.dest('.'));
  fnConsole('版本号打好啦-V' + num.version++);
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
    gulp.src(opts.srcPath + 'scss/doc.scss')
      .pipe(sass({
        outputStyle: cssStyle
      }).on('error', sass.logError))
      .pipe(gulp.dest('./docs/'));
  }
}
gulp.task('preSass', fnSass);
gulp.task('sass', ['preSass'], function () {

});

//组装HTML（加版本号，include标签引入文件）
var htmlConfig = {
  base: './src/htmls/components/', //html模块
  src: './src/htmls/pc/', //html模板源目录
  dir: './', //生成的html目录
};

function fnAssembleHTML(callback) {
  fnConsoleBegin('组装HTML开始');
  del([htmlConfig.dir + '*.html']).then(function () {
    gulp.src(htmlConfig.src + '*.html')
      .pipe(include())
      // .pipe(revAppend())
      .pipe(gulp.dest(htmlConfig.dir)).on('end', function () {
        fnConsole('组装HTML结束-V' + num.HTML++);
        if (isBuild) { //生产环境上线再打版本号
          fnRev();
        }
        typeof callback == 'function' && callback();
      });
  });
}

//传给webpack用
function fnWebpack(callback) {
  fnConsoleBegin('Webapck 开始');
  var newConfig = webpackConfig;
  if (!isPureBuild) {
    newConfig.watch = true;
  }
  // [opts.destPath + '/scripts/bundle/*.*']
  del(['dist/scripts/bundle/*.*', '!dist/scripts/bundle/APP.bundle.js', '!dist/scripts/bundle/main.bundle.js']).then(function () {
    webpack(
      newConfig,
      function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        // gutil.log('[webpack]',stats.toString({}))
        if (stats.compilation.errors[0]) {
          var numError = num.webpackError++;
          fnConsoleError('webpack编译出错-V' + numError + '，↓↓↓↓↓');
          console.log(stats.compilation.errors[0].error);
          fnConsoleError('webpack编译出错-V' + numError + '，↑↑↑↑↑↑');
        } else {
          typeof callback == 'function' && callback();
          fnConsole('webpack 结束-V' + num.webpack++);
          fnAssembleHTML(function () {
            setTimeout(function () {
              console.log(gutil.colors.bgMagenta(`构建完成于${new Date().toLocaleTimeString()}，可以压缩打包上线了`));
              if (isPureBuild) {
                killProcess();
              }
            }, 10);
          });
        }
      });
  });
}
gulp.task('webpack', function () {
  fnWebpack(function () {
    fnConsole('webpack 结束-V' + num.webpack++);
    fnAssembleHTML();
  });
});


//根据文件类型变动，自动刷新浏览器
function fnBrowserSync() {
  copyFiles();
  fnAssembleHTML();
  var middleware = [];
  if (isBuild) { //上线环境，切换wbpack配置及选项
    gutil.colors.bgRed('当前为生产环境，已压缩CSS及JS');
    webpackConfig.mode = 'production';
    delete webpackConfig.devtool;
    webpackConfig.plugins.unshift(
      // new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      // new webpack.optimize.ModuleConcatenationPlugin(),
    );
    fnWebpack();
  } else { //开发环境
    del(['dist/scripts/bundle/*.*']);
    webpackConfig.entry.unshift('webpack/hot/dev-server',
      'webpack-hot-middleware/client?quiet=true&noInfo=true');
    webpackConfig.plugins.unshift(
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin());
    var bundler = webpack(webpackConfig);
    middleware = [
      webpackDevMiddleware(bundler, {
        // IMPORTANT: dev middleware can't access config, so we should
        // provide publicPath by ourselves
        publicPath: webpackConfig.output.publicPath,
        logLevel: 'error',
        logTime: true,
        writeToDisk: false, //不写入硬盘文件，但还是从内存访问数据^-^
        // pretty colored output
        stats: {
          colors: true
        },

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler)
    ];
  }

  browserSync.init({
    // files: ['dist/css/*.css', 'dist/scripts/bundle/APP.bundle.js', './dist/htmls/**/*.html', '!**.scss', '!node_modules/**.*'],
    files: ['dist/css/*.css'],
    server: {
      baseDir: './',
      middleware,
      index: 'login.html'
    },
    port: 20046,
    // codeSync: false,
    ghostMode: false
  });
  watch('./src/htmls/**/*.html', fnAssembleHTML);
  watch('./src/staticResources/**/*', function () {
    setTimeout(copyFiles, 100);
  });//监视静态文件变化后复制文件
  gulp.watch('./src/scss/**/*.scss', fnSass);
  gulp.watch('./dist/css/*.css', function () {
    fnConsole('SCSS编译结束-V' + num.SCSS++);
    // setTimeout(fnRev, 10);
  });

}
gulp.task('browserSync', ['sass'], fnBrowserSync);

//构建、上线前压缩下JS，压缩CSS
function fnPreBuild() {
  cssStyle = cssStyles[0];
  isBuild = true;
  webpackConfig.output.publicPath = 'dist/scripts/bundle/';//适合有相对目录的环境
}
gulp.task('preBuild', fnPreBuild);
//上线启动
gulp.task('build', ['preBuild', 'browserSync'], function () {
  fnConsole('Builded successfully, enjoy!');
});

gulp.task('pureBuild', ['preBuild', 'sass'], function () {//纯打包模式，不开启服务器
  copyFiles();
  isPureBuild = true;
  console.log(gutil.colors.bgRed('当前为生产环境，使用自信纯打包不验证模式，并已执行压缩CSS及JS'));
  webpackConfig.mode = 'production';
  delete webpackConfig.devtool;
  fnWebpack();
});
gulp.task('purebuild', ['pureBuild']);
//默认启动任务
gulp.task('default', ['browserSync'], function () {
  // gulp.start('minify','cleancss')
  fnConsole('开启默认任务，启用webpack middleware 热加载。enjoy!');
});