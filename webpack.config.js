const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: "./src/Neon.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "NeonBundle.js",
        library: "NeonBundle"
    },
    plugins: [
        new webpack.ProvidePlugin({
            d3: 'd3',
            $: 'jquery'
        })
    ],
    node: {
        fs: 'empty'
    }
};
