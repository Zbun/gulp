var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/scripts/entry/main.js'
    // doc: './src/scripts/doc.js'
  ],
  output: {
    path: path.join(__dirname, './dist/scripts/bundle/'),
    filename: '[name].bundle.js',
    publicPath: '/dist/scripts/bundle/',
    chunkFilename: 'chunk[id].[hash].js'
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [path.resolve('./src/scripts')],
        exclude: /(node_modules|bower_components)/,
        options: {
          presets: ['es2015'],
          cacheDirectory: true
        }
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [path.resolve('./src/scripts')],
        exclude: /(node_modules|bower_components)/
      }
      // , {
      //   test: /\.html$/,
      //   loader: 'html',
      //   include: [path.resolve('./src')],
      //   exclude: /(node_modules|bower_components)/
      // }

      // {
      //shimming，用于不符合规范的模块（如一些直接返回全局变更的插件）进行shimi处理
      //这时用exports-loader
      //用法   require('./dist.../swiper.s')
      // test:require.resolve('./dist/scripts/lib/swiper3/swiper-3.3.1.min.js'),loaders:'exports?swiper'
      // }
      // { test: /\.less$/, loader: 'style!css!less' }, // use ! to chain loaders
      // { test:/\.s[ac]ss$/,loaders:['style','css','sass']},
      // { test: /\.css$/, loader: 'style!css' },
      // { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  },
  // vue: {
  //   loaders: {
  //     css: 'style!css!less'
  //   }
  // },
  // devtool: 'source-map',
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  resolve: {
    modules: ['node_modules/', path.join(__dirname, './src/scripts')],
    extensions: ['.vue', '.js'],
    alias: {
      'rdist': path.join(__dirname, './'), //根相对目录
      htmls: path.join(__dirname, './src/htmls'), //htmls模块路径
      libs: path.join(__dirname, './src/scripts/lib/'), //通用库文件路径
      commonScripts: path.join(__dirname, './src/scripts/modules/common'), //通用JS模块路径
      commonVues: path.join(__dirname, './src/scripts/vues'), //通用vue模块路径
      pages: path.join(__dirname, './src/scripts/SPA/pages/'), //独立的单页路径
      mixins: path.join(__dirname, './src/scripts/modules/production/mixins/')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      dialog: path.resolve(__dirname, './src/scripts/lib/artdialog/dist/dialog-plus-min.js'), //弹窗对话框
      getTarget: path.join(__dirname, './src/scripts/modules/common/getTarget.js'), //获取真实节点功能
      getType: path.join(__dirname, './src/scripts/modules/common/getType.js'),
      typeOf: path.join(__dirname, './src/scripts/modules/common/typeOf.js'), //获取变量typeOF
      spinZ: path.resolve('./src/scripts/modules/common/spinZ.js'), //封装了spin，依赖spin
      // dialog: path.resolve(__dirname, './src/scripts/modules/common/zpopupMobile.js'), //手机弹窗
      showTips: path.resolve(__dirname, './src/scripts/modules/common/showTipsState.js'), //弹窗提示框
      validatorManu: path.resolve(__dirname, './src/scripts/modules/common/validatorManu.js'), //手动校验数据完整性
      zmm_validator: path.resolve(__dirname, './src/scripts/modules/common/validator.js'), //数据完整性验证
      zmm_date: path.resolve(__dirname, './src/scripts/modules/common/date.js'), //常用的日期选择
      fetchData: path.join(__dirname, './src/scripts/modules/production/fetchData.js'), //获取数据
      areaSelector: path.join(__dirname, './src/scripts/modules/production/areaSelector.js'), //区域选择
      initPage: path.join(__dirname, './src/scripts/modules/production/pagination.js'), //分页总方法
      dictionary: path.join(__dirname, './src/scripts/modules/production/SysDictionary.js'), //字典数据
    })
  ],
  //
  // watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  externals: {
    //外部引入2，页面中需要预先引入相关库
    Vue: 'Vue',
    _: 'lodash',
    jquery: 'jQuery', //此时外部引入
    $: 'jQuery',
    'window.jQuery': 'jquery'
  }
};