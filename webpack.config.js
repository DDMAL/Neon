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
