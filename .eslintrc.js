export default {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'@react-native-community',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'prettier',
		'eslin-config-prettier',
	],
	rules: {
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'auto',
			},
		],
		'@typescript-eslint/no-unused-vars': ['warn'], //error, off, warn
		'no-console': 'off',
	},
};
