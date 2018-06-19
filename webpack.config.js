const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./src/editor.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "editor.js",
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
                    'css-loader'
                ]
            }
        ]
    }
};
