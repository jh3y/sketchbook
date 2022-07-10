const PLOPPER = (plop) => {
	plop.setGenerator('new pen', {
		description: 'basic HTML, CSS, and JavaScript',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'name your pen',
			},
			{
				type: 'list',
				name: 'template',
				message: 'choose template (default standard)',
				choices: [
					'3d-scene',
					'3d-scene-preprocessor',
					'experimental',
					'greensock',
					'open-props',
					'react',
					'standard',
					'typescript',
				],
				default: 'standard',
			},
		],
		actions: [
			{
				type: 'addMany',
				destination: 'src/{{name}}/',
				base: 'templates/{{template}}/',
				transform: (template, data) => template.replace('PageTitle', data.name),
				templateFiles: [
					'templates/{{template}}/index.*',
					'templates/{{template}}/dev.*',
					'templates/{{template}}/script.*',
					'templates/{{template}}/style.*',
				],
			},
		],
	})
}

module.exports = PLOPPER
