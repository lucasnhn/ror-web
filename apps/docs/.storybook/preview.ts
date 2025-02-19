import type { Preview } from '@storybook/react'
import '@ror/design/reset.css'
import '@ror/design/style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
