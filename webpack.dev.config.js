const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

let commitHash = childProcess.execSync('git rev-parse --short HEAD').toString();

module.exports = {
  mode: 'development',
  target: 'web',
  entry: {
    landing: './deployment/archive.server/landing.ts',
    editor: './deployment/archive.server/editor.ts'
  },
  output: {
    path: path.resolve(__dirname, 'deployment', 'archive.public', 'Neon'),
    publicPath: '/',
    filename: '[name].js'
  },
  node: {
    fs: 'empty'
  },
  devtool: 'source-map',
  devServer: {
    static: './deployment/archive.public',
    hot: true,
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'awesome-typescript-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /Worker\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: { publicPath: '/Neon/' }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  externals: {
    'verovio-dev': 'verovio',
    d3: 'd3'
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.DefinePlugin({
      __LINK_LOCATION__: JSON.stringify('/'),
      __NEON_VERSION__: JSON.stringify(commitHash),
      __ASSET_PREFIX__: JSON.stringify('/Neon/')
    })
  ]
};
