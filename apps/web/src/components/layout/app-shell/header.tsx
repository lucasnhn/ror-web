import { cn } from '@/utils/clsxm'

interface HeaderProps {
  className?: string
  title?: string
}

export const Header = ({ className, title = 'ROR' }: HeaderProps) => {
  return (
    <header className={cn('w-full h-28 px-12 py-2 border-b flex items-center', className)}>
      <h1 className='text-center'>{title}</h1>
    </header>
  )
}
