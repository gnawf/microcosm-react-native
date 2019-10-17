module.exports = {
  presets: [
    "module:metro-react-native-babel-preset",
    "@babel/preset-flow",
  ],
  plugins: [
    "transform-inline-environment-variables",
    [
      "babel-plugin-root-import",
      {
        root: __dirname,
        rootPathPrefix: "~/",
        rootPathSuffix: "src",
      },
    ],
  ],
};
