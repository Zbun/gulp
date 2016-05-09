var path=require('path');
// var webpack=require('webpack');
// var jquery=require('jquery');

module.exports = {
  entry: './src/main.js',
  output: {
    path:path.join(__dirname,'./dist/scripts/bundle/'),
    filename: 'bundle.js',
    publicPath:'/dist/htmls/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude:/(node_modules|bower_components)/,
        query: {
         presets: ['es2015']
        }
      },
      // { test: /\.less$/, loader: 'style!css!less' }, // use ! to chain loaders
      // { test:/\.s[ac]ss$/,loaders:['style','css','sass']},
      // { test: /\.css$/, loader: 'style!css' },
      // { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
    ]
  },
  vue:{
    loaders:{
      css:'style!css!less'
    }
  },
  // babel:{
  //   presets:['es2015'],
  //   plugins:['transform-runtime']
  // },
  resolve:{
    root:path.resolve('./src'),
    extensions:['','.vue','.js'],
    alias:{
      // jquery:'./src/scripts/lib/jquery-1.11.3.js'
    }
  },
  plugins:[
    // jquery合并打包，需要配合本地或CND加载
    // new webpack.ProvidePlugin({
    //   jQuery:'jquery',
    //   $:'jquery'
    // })
  ],
  watch:true,
  externals:{
    //外部引入2，页面中需要预先引入相关库
    jquery:'jQuery',    //此时外部引入
    $:'jQuery'
  }
};
