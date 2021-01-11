module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    "eslint:recommended",
  ],
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'rules': {
    'eqeqeq': 'error',
    'semi': [2, 'always']
  },
  'parser': "babel-eslint",
};
