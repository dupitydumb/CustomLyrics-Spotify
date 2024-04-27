const path = require("path");

module.exports = {
  entry: "./content.js", // The entry point of your application
  output: {
    filename: "bundle.js", // The name of the bundled file
    path: path.resolve(__dirname, "dist"), // The directory where the bundled file will be saved
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Files to be processed
        exclude: /node_modules/, // Files to be excluded
        use: {
          loader: "babel-loader", // The loader to be used
        },
      },
    ],
  },
  target: "web",
};
