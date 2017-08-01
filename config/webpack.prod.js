new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}),
new webpack.optimize.UglifyJsPlugin()
output: {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'dist')
}
