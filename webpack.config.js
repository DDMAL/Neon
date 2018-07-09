const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: {
        editor: "./src/editor.js",
        pretty: "./src/pretty.js"
    },
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "[name].js",
    },
    plugins: [
        new webpack.ProvidePlugin({
            d3: 'd3',
            $: 'jquery'
        })
    ],
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: "[name].png"
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                      loader: 'file-loader',
                      options: {
                          name: '[name].[ext]',
                          outputPath: 'fonts/',
                          publicPath: '../'
                      }  
                    }
                ]
            }     
        ]
    }
};
