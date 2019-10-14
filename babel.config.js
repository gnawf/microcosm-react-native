module.exports = function(api) {
  api.cache(true);

  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-flow",
    ],
    plugins: [
      "transform-inline-environment-variables",
      [
        "babel-plugin-root-import",
        {
          root: __dirname,
          rootPathPrefix: '~/',
          rootPathSuffix: 'src',
        },
      ],
    ],
  };
};
