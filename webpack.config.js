const path = require('path');
const { argv } = require('process');
const webpack = require('webpack');


module.exports = {
  // entry: path.resolve(__dirname, './src/index.js'),
  entry: path.resolve(__dirname, './src/javascripts/main.js'),
  devtool: 'inline-source-map',
  watch: true,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'javascripts/[name].js',
    publicPath: '/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
  },
};
