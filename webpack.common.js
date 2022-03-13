const path = require("path");

module.exports = {
  entry: {
    content: "./src/index.js",
  },
  module: {},
  resolve: {
    extensions: [".js"],
  },
  output: { filename: "[name].js", path: path.resolve(__dirname, "dist") }, // chrome will look for files under dist/* folder
};
