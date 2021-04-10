/*
Observations:
When running npm run build, the initial compile will create a new javascript file. 
This file will be placed in dist/bundle.js or public/javascripts/main.js depending on
which lines of code you've configured the output below.

After the first build, while npm run build is still running, if changes are made to
react files, hash-hot-update.json files will be added to dist or public.  These represent 
the diffs between what was initially built and what was modified.  They can be deleted
anytime because the bundle can easily be recreated by stopping the terminal and doing "npm 
run build" again.

The compile of the react files goes much quicker when just doing "npm start". The
changes even show up immediately in the browser without a reload. (This is probably 
a result of hotload) In contrast, the compile is much slower when running two terminals 
with "npm run build" in one and "npm run server" in the other. You have to use the latter
when developing the react and express together. But when you are only working with react files
then the former approach is faster.

*/

const path = require('path');
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
  // output: {
  //   path: path.resolve(__dirname, './dist'),
  //   filename: 'bundle.js',
  // },
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
