module.exports = {
  entry: {
    content: './src/content.js',
    popup: './src/popup.js'
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      }
    ]
  },
};
