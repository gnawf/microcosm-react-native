module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "rules": {
    "quotes": [
      "warn",
    ],
    "comma-dangle": [
      "warn",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "only-multiline",
      },
    ],
    "object-curly-spacing": [
      "warn",
      "always",
    ],
    "keyword-spacing": [
      "warn",
      {
        "after": true,
        "before": true,
      },
    ],
    "key-spacing": [
      "warn",
    ],
    "comma-spacing": [
      "warn",
    ],
    "semi": [
      "warn",
    ],
    "semi-style": [
      "warn",
    ],
    "semi-spacing": [
      "warn",
    ]
  },
};
