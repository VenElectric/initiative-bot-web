module.exports = {
    root: true,
    env: {
		node: true,
	},
	extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        '@vue/prettier',
        '@vue/prettier/@typescript-eslint',
	],
    parserOptions: {
		ecmaVersion: 2021,
    },
	rules: {
    "prettier/prettier": ['error',
    {
      'endOfLine': 'auto',
    }],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
	},
};
