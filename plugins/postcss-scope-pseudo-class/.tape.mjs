import { declarationClonerPlugin, postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-scope-pseudo-class';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:preserve-true': {
		message: "supports basic usage",
		options: {
			preserve: true
		}
	},
	'basic:with-cloned-declarations': {
		message: 'doesn\'t cause duplicate CSS',
		plugins: [
			declarationClonerPlugin,
			plugin({
				preserve: true
			})
		]
	},
	'generated-selector-cases': {
		message: 'handles all generated selector cases correctly',
		warnings: 1,
	},
	'examples/example': {
		message: 'minimal example',
	},
	'examples/example:preserve-true': {
		message: 'minimal example',
		options: {
			preserve: true
		}
	},
});
