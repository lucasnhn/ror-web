import { auth } from '@/app/auth'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import s from './profile.module.css'
import { SignOutButton } from '@/components/auth/sign-out-button'

const containerClasses = 'flex items-center justify-start gap-2 group cursor-pointer'

const avatarClasses =
  'relative flex shrink-0 items-center justify-center w-8 h-8 overflow-hidden bg-neutral-100 rounded-full dark:bg-neutral-600 group-hover:bg-(--r-layer-02)'

export async function Profile() {
  const session = await auth()

  if (!session?.user) return null
  if (session.user?.image && session.user.name) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className={containerClasses}>
            <Image src={session.user.image} alt={session.user.name} width={32} height={32} className={avatarClasses} />
            <ProfileName name={session.user.name} email={session.user.email} />
          </div>
        </PopoverTrigger>
        <ProfilePopover />
      </Popover>
    )
  }

  if (session.user.name) {
    const initials = session.user.name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className={containerClasses}>
            <div className={avatarClasses}>
              <span className='text-xs text-neutral-800 dark:text-neutral-300'>{initials}</span>
            </div>
            <ProfileName name={session.user.name} email={session.user.email} />
          </div>
        </PopoverTrigger>
        <ProfilePopover />
      </Popover>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={containerClasses}>
          <div className={avatarClasses}>
            <span className='text-xs text-neutral-800 dark:text-neutral-300'>?</span>
          </div>
          <ProfileName name={session.user.name} email={session.user.email} />
        </div>
      </PopoverTrigger>
      <ProfilePopover />
    </Popover>
  )
}

function ProfileName({ name, email }: { name?: string | null; email?: string | null }) {
  if (!name && !email) return null
  return <div className='hidden @min-[15rem]:flex flex-col text-xs'>{name ? <span>{name}</span> : null}</div>
}

function ProfilePopover() {
  return (
    <PopoverPortal>
      <PopoverContent collisionPadding={8} sideOffset={4}>
        <div className={s.popover}>
          <SignOutButton />
        </div>
      </PopoverContent>
    </PopoverPortal>
  )
}
