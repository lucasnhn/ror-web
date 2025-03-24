import { PlopTypes } from '@turbo/gen'

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  /**
   * Generator for React components
   */

  plop.setGenerator('component', {
    description: 'Generates a new React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new component? (lowercase)',
        validate: (input: string) => {
          if (!input) {
            return 'component name is required'
          }

          if (input.includes('.')) {
            return 'name cannot include an extension'
          }

          return true
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/react/src/components/{{dashCase name}}.tsx',
        templateFile: 'templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/apps/docs/stories/{{pascalCase name}}.stories.tsx',
        templateFile: 'templates/component.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: '{{ turbo.paths.root }}/packages/styles/scss/components/{{dashCase name}}.scss',
        templateFile: 'templates/component.scss.hbs',
      },
    ],
  })
}
