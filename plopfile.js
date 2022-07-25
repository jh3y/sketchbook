const fs = require('fs')

// Base choices on directories under "templates" directory
const choices = fs.readdirSync(`${__dirname}/templates`)

const PLOPPER = (plop) => {
  plop.setGenerator('new pen', {
    description: 'basic HTML, CSS, and JavaScript',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Name your pen',
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose your template',
        choices,
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
