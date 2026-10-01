const path = require('path');
module.exports = {
  mode: 'production',
  entry: './content.js',
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') },
  target: 'web',
  devtool: false
};
