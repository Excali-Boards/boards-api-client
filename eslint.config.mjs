import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'node_modules/**', 'prisma/generated/**'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.ts'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		rules: {
			'brace-style': ['error', '1tbs', { allowSingleLine: true }],
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-unsafe-declaration-merging': 'off',
			'consistent-return': 'off',
			'quotes': ['error', 'single', { avoidEscape: true }],
			'no-mixed-spaces-and-tabs': 'error',
			'indent': ['error', 'tab', { SwitchCase: 1 }],
			'arrow-parens': ['error', 'always'],
			'eol-last': ['error', 'always'],
			'func-call-spacing': ['error', 'never'],
			'comma-dangle': ['error', 'always-multiline'],
			'no-multi-spaces': 'error',
			'no-whitespace-before-property': 'off',
			'semi': ['error', 'always'],
			'semi-style': ['error', 'last'],
			'space-in-parens': ['error', 'never'],
			'block-spacing': ['error', 'always'],
			'object-curly-spacing': ['error', 'always'],
			'eqeqeq': ['error', 'always', { null: 'ignore' }],
			'spaced-comment': ['error', 'always', { markers: ['!'] }],
			'yoda': 'error',
			'prefer-destructuring': ['error', { object: false, array: false }],
			'operator-assignment': ['error', 'always'],
			'no-useless-computed-key': 'error',
			'no-unneeded-ternary': ['error', { defaultAssignment: false }],
			'no-invalid-regexp': 'error',
			'no-constant-condition': ['error', { checkLoops: false }],
			'no-duplicate-imports': 'error',
			'no-extra-semi': 'error',
			'dot-notation': 'error',
			'no-useless-escape': 'error',
		},
	},
);
