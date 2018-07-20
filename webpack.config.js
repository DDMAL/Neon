const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "production",
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
            d3: './vendor/d3.v5.min.js',
            $: './vendor/jquery-3.3.1.min.js'
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
                    'css-loader'
                ]
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "/img/"
                        }
                    }
                ]
            }
        ]
    }
};
