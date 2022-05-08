/*
Observations:
When running npm run build, the initial compile will create a new javascript file. 
This file will be placed in dist/bundle.js or public/javascripts/main.js depending on
which lines of code you've associated with the "output:" below.

After the first build, while npm run build is still running, if changes are made to
react files, hash-hot-update.json files will be added to /dist or /public.  These represent 
the diffs between what was initially built and what was modified.  They can be deleted
anytime because the bundle can easily be recreated by stopping the terminal and doing "npm 
run build" again.

The compile of the react files goes much quicker when just doing "npm start". The
changes even show up immediately in the browser without a reload. (This is probably 
a result of hotload) In contrast, the compile is much slower when running two terminals 
with "npm run build" in one and "npm run server" in the other. You have to use the latter
when developing the react and express together. But when you are only working with react files
then the former approach is faster.

When running "npm run start" notice that the code is rendered at port 4444.  This port is only
used with "npm run start"

When running "npm run start" notice too that devserver is running off of the /dist folder. So
if you want the code changes to render you also then need to change the "output:" to dist. 

Changing the output to dist (for npm start) and public (for npm run build) could also be done
automatically by passing the mode (which is in the cli script commands above) to webpack.  Like so:

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

See  https://webpack.js.org/configuration/mode/ .  But for simplicity (albeit not convenience) I'm
leaving that out right now. 

The [name] parameter is derived from the name of the entry file.  When you use it in the output
configuration it means that the output file will have the same name as the input file.

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
  // Output to dist when only running "npm run start".  This compiles much faster.  But you
  // only can run the react code, not the express server. 
  // You need to do this for compiled react changes to render in browser.
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
  },
  // Output to public when running "npm run build" in one terminal and "npm run server" in other.
  // You need to do this for compiled react changes to render in browser.
  // output: {
  //   path: path.resolve(__dirname, 'public'),
  //   filename: 'javascripts/[name].js',
  //   publicPath: '/'
  // },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 4444,
    hot: true,
  },
};
