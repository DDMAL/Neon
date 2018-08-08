const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: {
        editor: "./pages/editor.js",
        pretty: "./src/pretty.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
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
            },
            {
                test: /\.(png|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "/img/"
                        }
                    }
                ]
            },
            {
                test: /\.mei$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                            outputPath: "/mei/"
                        }
                    }
                ]
            }
        ]
    }
};

