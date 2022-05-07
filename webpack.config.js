const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  //Inline source maps allow minified js to be debugged more easily in dev
  //However, source maps increase the bundle size and will create a warning
  //Comment out the devtool line to get rid of the warning and when running 'npm run build' 
  //Or add a conditional like: devtool: (mode === 'development') ? 'inline-source-map' : false,
  //See: https://stackoverflow.com/questions/49348365/webpack-4-size-exceeds-the-recommended-limit-244-kib
  devtool: 'inline-source-map',
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
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
  },
};
