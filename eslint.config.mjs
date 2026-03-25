import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	globalIgnores(['.next/**', 'build/**', 'next-env.d.ts', 'out/**']),
	{
		rules: {
			'@next/next/no-img-element': 'off',
			'react-hooks/incompatible-library': 'off',
		},
	},
])

export default eslintConfig
