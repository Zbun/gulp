var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    APP: './src/scripts/entry/APP.js'
      // doc: './src/scripts/doc.js'
  },
  output: {
    path: path.join(__dirname, './dist/scripts/bundle/'),
    filename: '[name].bundle.js',
    publicPath: '/dist/scripts/bundle/',
    chunkFilename: '[id].[chunkhash].js'
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        // loader: 'babel-loader',
        include: [path.join(__dirname, './src/scripts')],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }

      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [path.resolve('./src/scripts')],
        exclude: /node_modules/
      }

      // {
      //shimming，用于不符合规范的模块（如一些直接返回全局变更的插件）进行shimi处理
      //这时用exports-loader
      //用法   require('./dist.../swiper.s')
      // test:require.resolve('./dist/scripts/lib/swiper3/swiper-3.3.1.min.js'),loaders:'exports?swiper'
      // }
      // { test:/\.s[ac]ss$/,loaders:['style','css','sass']},
      // { test: /\.css$/, loader: 'style!css' },
      // { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  },
  devtool: 'source-map',
  resolve: {
    // root: path.resolve('./src/scripts'),
    modules: [
      path.join(__dirname, './src/scripts'),
      'node_modules'
    ],
    // extensions: ['.vue'],
    alias: {
      htmls: path.join(__dirname, './src/htmls'), //htmls模块路径
      libs: path.join(__dirname, './src/scripts/lib/'), //通用库文件路径
      commonScripts: path.join(__dirname, './src/scripts/modules/common'), //通用JS模块路径
      commonVues: path.join(__dirname, './src/scripts/vues'), //通用vue模块路径
      views: path.join(__dirname, './src/scripts/SPA/views/'), //独立的单页路径
      images: path.join(__dirname, './imgages')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      dialog: path.resolve(__dirname, './src/scripts/lib/artdialog/dist/dialog-plus-min.js'), //弹窗对话框
      getTarget: path.join(__dirname, './src/scripts/modules/common/getTarget.js'), //获取真实节点功能
      getType: path.join(__dirname, './src/scripts/modules/common/getType.js'),
      typeOf: path.join(__dirname, './src/scripts/modules/common/typeOf.js'), //获取变量typeOF
      spinZ: path.resolve('./src/scripts/modules/common/spinZ.js'), //封装了spin，依赖spin
      loading: path.resolve('./src/scripts/modules/common/zWaiting.js'), //加载数据时，右上角等待提示
      showTips: path.resolve(__dirname, './src/scripts/modules/common/showTipsState.js'), //弹窗提示框
      validatorManu: path.resolve(__dirname, './src/scripts/modules/common/validatorManu.js'), //手动校验数据完整性
      zmm_validator: path.resolve(__dirname, './src/scripts/modules/common/validator.js'), //数据完整性验证
      zmm_date: path.resolve(__dirname, './src/scripts/modules/common/date.js'), //常用的日期选择
      fetchData: path.join(__dirname, './src/scripts/modules/production/fetchData.js'), //获取数据
      areaSelector: path.join(__dirname, './src/scripts/modules/production/areaSelector.js'), //区域选择
      initPage: path.join(__dirname, './src/scripts/modules/production/pagination.js'), //分页总方法
      createOrderNum: path.join(__dirname, './src/scripts/modules/production/createOrderNum.js'), //生成单号方法
      dictionary: path.join(__dirname, './src/scripts/modules/production/SysDictionary.js') //字典数据
    })
  ],
  // watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000
  },
  externals: {
    // Vue: 'Vue',
    _: 'lodash',
    jquery: 'jQuery', //此时外部引入
    $: 'jQuery',
    'window.jQuery': 'jquery'
  }
};
