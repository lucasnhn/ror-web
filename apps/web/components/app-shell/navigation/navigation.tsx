import { NavigationItem } from './item'
import { routes } from './routes'
export function Navigation() {
  return (
    <nav>
      <ul className='flex flex-col gap-1'>
        {routes.map((route) => (
          <NavigationItem key={route.label} {...route} />
        ))}
      </ul>
    </nav>
  )
}
