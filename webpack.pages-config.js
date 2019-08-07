const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process');

let commitHash = childProcess.execSync('git rev-parse --short HEAD').toString();

module.exports = {
  mode: 'production',
  entry: {
    editor: './pages/editor.js',
    index: './pages/index.js',
    pretty: './src/pretty.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './img/'
            }
          }
        ]
      },
      {
        test: /\.mei$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './mei/'
            }
          }
        ]
      },
      {
        test: /\.rng$/,
        use: [
          'raw-loader'
        ]
      },
      {
        test: /Worker\.js$/,
        use: [
          'worker-loader'
        ]
      },
      {
        test: /\.html$/,
        use: [
          'html-loader'
        ]
      }
    ]
  },
  externals: {
    'verovio-dev': 'verovio',
    jquery: 'jQuery',
    d3: 'd3'
  },
  plugins: [
    new webpack.DefinePlugin({
      __LINK_LOCATION__: JSON.stringify('https://ddmal.music.mcgill.ca/Neon'),
      __NEON_VERSION__: JSON.stringify('v4.0.1')
    })
  ]
};
