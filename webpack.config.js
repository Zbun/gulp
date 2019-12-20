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
      exclude: /(node_modules|bower_components)/,
      options: {
        cssModules: {
          localIdentName: '[local]_[hash:base64:7]',
          camelCase: true
        },
        loaders: {
          use: ['vue-style-loader', 'css-loader', 'sass-loader', {
            loader: 'sass-resources-loader',
            options: {
              // https://www.npmjs.com/package/sass-resources-loader
              //将scss变量处理成全局变量，（也适用于mixins）在vue里使用。不需要一个个@import ...
              resources: './src/SCSS/base/_variables.scss'
            }
          }]
        }
      },
    }, {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules|bower_components/
    }, {
      test: /\.css$/,
      // loader: 'css-loader',
      use: ['style-loader', 'css-loader']
    }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  mode: 'development',
  resolve: {
    modules: ['node_modules/', path.join(__dirname, './src/scripts')],
    extensions: ['.vue', '.js', '.tsx', '.ts'],
    alias: {
      '@root': path.join(__dirname, './'), //根相对目录
      '@src': path.join(__dirname, './src/'), //资源根目录
      '@htmls': path.join(__dirname, './src/htmls'), //htmls模块路径
      '@libs': path.join(__dirname, './src/scripts/lib/'), //通用库文件路径
      '@modules': path.join(__dirname, './src/scripts/modules/'), //JS模块路径
      '@scripts': path.join(__dirname, './src/scripts/modules/common/'), //通用JS路径
      '@vues': path.join(__dirname, './src/scripts/vues'), //通用vue模块路径
      '@pages': path.join(__dirname, './src/scripts/SPA/pages/'), //独立的单页路径
      '@mixins': path.join(__dirname, './src/scripts/modules/production/mixins/')
    }
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all', //打包通用模块
  //   }
  // },
  plugins: [function () {
    this.plugin('watch-run', function (watching, callback) {
      var d1 = new Date();
      console.log('webpack building begin at ' + d1.toLocaleTimeString());
      callback();
    });
  },
  new webpack.ProvidePlugin({
    // $dialog: path.resolve(__dirname, './src/scripts/lib/artdialog/dist/dialog-plus-min.js'), //弹窗对话框
    // getTarget: path.join(__dirname, './src/scripts/modules/common/getTarget.js'), //获取真实节点功能
    // getType: path.join(__dirname, './src/scripts/modules/common/getType.js'),
    // typeOf: path.join(__dirname, './src/scripts/modules/common/typeOf.js'), //获取变量typeOF
    // dialog: path.resolve(__dirname, './src/scripts/modules/common/zpopupMobile.js'), //手机弹窗
    $showTips: path.resolve(__dirname, './src/scripts/modules/common/showTips.js'), //弹窗提示框
    $dialog: path.resolve(__dirname, './src/scripts/modules/common/dialog.js'), //弹窗对话框
    $validatorManu: path.resolve(__dirname, './src/scripts/modules/common/validatorManu.js'), //手动校验数据完整性
    $validator: path.resolve(__dirname, './src/scripts/modules/common/validator.js'), //数据完整性验证
    $date: path.resolve(__dirname, './src/scripts/modules/common/date.js'), //常用的日期选择
    $fetchData: path.join(__dirname, './src/scripts/modules/production/fetchData.js'), //获取数据
    $initPage: path.join(__dirname, './src/scripts/modules/production/pagination.js'), //分页总方法
    $dictionary: path.join(__dirname, './src/scripts/modules/production/SysDictionary.js'), //字典数据
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