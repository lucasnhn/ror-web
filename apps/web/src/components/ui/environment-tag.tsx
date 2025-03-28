import { Tag, TagColor, TagProps } from '@ror/react'

type Environment = 'development' | 'dev' | 'test' | 'staging' | 'production' | 'prod' | 'qa'

const mapEnvironmentToColor: Record<Environment | string, TagColor> = {
  dev: 'blue',
  development: 'blue',
  staging: 'purple',
  test: 'green',
  production: 'red',
  prod: 'red',
  qa: 'yellow',
}

interface EnvironmentTagProps extends Omit<TagProps<'div'>, 'color' | 'as'> {
  environment: Environment | string
}

/**
 * Display environment as a tag using consistent color for the different environments
 */
export function EnvironmentTag({ environment, ...rest }: EnvironmentTagProps) {
  const color = mapEnvironmentToColor[environment] ?? 'gray'
  return (
    <Tag color={color} {...rest}>
      {environment}
    </Tag>
  )
}
