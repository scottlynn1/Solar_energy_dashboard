const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: './assets/scripts/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dashboard_app', 'static', 'dashboard_app')
  },
  
}