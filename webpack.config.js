const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    editor: './src/editor.js',
    pretty: './src/pretty.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
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
        test: /\.rng$/,
        use: [
          'raw-loader'
        ]
      },
      {
        test: /Worker\.js/,
        use: [
          'worker-loader'
        ]
      }
    ]
  },
  externals: {
    'verovio-dev': 'verovio',
    jquery: 'jQuery',
    d3: 'd3'
  }
};
