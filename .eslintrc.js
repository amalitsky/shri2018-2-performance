module.exports = {
  "extends": "google",
  "env": {
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": 6
  },
  "rules": {
    "max-len": ["error", 120],
    "comma-dangle": ["error", "never"],
    "indent": ["warn", 2],
    "arrow-parens": [1, "as-needed", {
      "requireForBlockBody": false
    }],
    "require-jsdoc": ["warn"]
  }
};
