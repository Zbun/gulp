var gulp = require('gulp'),
    browserSync=require('browser-sync'),
    concat=require('gulp-concat'),
    coffee=require('gulp-coffee'),
    del=require('del'),
    gutil=require('gulp-util'),
    jshint=require('gulp-jshint'),
    minify=require('gulp-minify'),
    cleanCss=require('gulp-clean-css'),
    rename=require('gulp-rename'),
    runsequence=require('run-sequence'),
    sourcemaps=require("gulp-sourcemaps"),
    uglify = require('gulp-uglify'),
    rev=require('gulp-rev'),
    revAppend=require('gulp-rev-append'),
    sass=require('gulp-sass'),
    webpack=require('webpack');

var webpackConfig=Object.create(require('./webpack.config.js'));
var dirDist='./dist/';

var opts={
  destPath:'./dist/',
  minRename:{
    suffix:'.min'
  },
};
var cssStyles=['compressed','expanded'],cssStyle=cssStyles[1];

//清理文件
gulp.task('clean',function(cb){
	del([driDist+'css',dirDist+'scripts'],cb);
});

//构建
gulp.task('build',['minify','cleancss','sass'],function(){
   console.log("Good Job!");
});

//默认启动任务
gulp.task("default",['browserSync'],function(){
	// gulp.start('minify','cleancss')
   console.log("Enjoy!");
});

//文件添加版本号，在HTML中写入**.js?rev=@hash
gulp.task('rev',function(){
  gulp.src('./src/htmls/pc/*.html')
  .pipe(revAppend())
  .pipe(gulp.dest(opts.destPath+'htmls/pc/'));
})

gulp.task("greet",function(){
  console.log('Hello World!');
});

gulp.task('jshint',function(){
  gulp.src(dirDis+'scripts/*.js').pipe(jshint());
});

//压缩、链接资源类
gulp.task('unlify', function () {
   gulp.src('./src/scripts/*.js')
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(rename({suffix:'.min'}))
      .pipe(sourcemaps.write('../maps'))
      .pipe(gulp.dest(opts.destPath+'scripts'));
});

gulp.task('minify',function(){
    gulp.src('./src/scripts/*.js')
        .pipe(minify({
                exclude:['tasks'],
                ignoreFiles:['.combo.js','-min.js']
        }))
        .pipe(gulp.dest(opts.destPath+'scripts'));
})

gulp.task("minifycss",function(){
  gulp.src("./css/*.css").pipe(cleanCss()).pipe(rename({suffix:'.min'})).pipe(gulp.dest('./dist/css/'))
});

gulp.task('concat',function(){
   gulp.src('./scripts/*.js')
   .pipe(uglify())
   .pipe(concat('site.js'))
   .pipe(gulp.dest(opts.destPath+'scripts'));
});

/*预处理系列*/
gulp.task('coffee',function(){
   gulp.src('coffee/*.coffee')
   .pipe(sourcemaps.init())
   .pipe(coffee({bare:true}).on('error',gutil.log))
   .pipe(sourcemaps.write('../maps'))
   .pipe(gulp.dest(opts.destPath+'scripts'));
});


//outputStyle:compressed,expanded
gulp.task('sass',function(){
    return gulp.src('./scss/*.scss')
    .pipe(sass({outputStyle:cssStyle}).on('error',sass.logError))
    .pipe(gulp.dest(opts.destPath+'css'));

  //以下为传给browseSync用
  // return gulp.src("app/scss/*.scss")
  //       .pipe(sass())
  //       .pipe(gulp.dest("app/css"))
  //       .pipe(browserSync.stream());
});

//监视文件变化，执行相关任务
gulp.task('watch',function(){
   gulp.watch("**.coffee",['coffee']);
   gulp.watch('./scripts/**/*.js', ['rev']);
   gulp.watch('./css/**/*.css','rev');
   gulp.watch('/scss/*.scss','sass');
});

//传给webpack用
gulp.task('webpack',function(callback){
  webpack(
    webpackConfig,function(err,stats){
      if(err) throw new gutil.PluginError('webpack',err);
      // gutil.log('[webpack]',stats.toString({}))

      callback();
      // console.log(err);
    })
});
// gulp.watch('app/src/**/*.js', ['webpack']);

//根据文件类型变动，自动刷新浏览器
gulp.task("browserSync",['sass','webpack'],function(){
   browserSync({
      files:["**/*.html","**/*.css","**/*.js",'!**.less','!**.coffee','!**.SCSS','!node_modules/**.*','!src/**.*','!webpack.config.js'],
      server:{
         baseDir:"./"
      },
      port:2015
   });
   gulp.watch('./scss/**/*.scss',['sass']);
   gulp.watch('./src/**/*.*',['webpack']);
   //gulp.watch('./src/scripts/**/*.js', ['rev']);
   //gulp.watch('./src/css/**/*.css','rev')
});