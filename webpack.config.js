const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    editor: './src/editor.js',
    pretty: './src/pretty.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
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
              outputPath: '/img/'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: false
  }
};
