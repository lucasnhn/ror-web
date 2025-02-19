import { auth } from '@/app/auth'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover'
import s from './profile.module.css'
import { SignOutButton } from '@/components/auth/sign-out-button'

export async function Profile() {
  const session = await auth()

  if (!session?.user) return null
  if (session.user?.image && session.user.name) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className={s.profile}>
            <Image src={session.user.image} alt={session.user.name} width={32} height={32} className={s.avatar} />
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
          <div className={s.profile}>
            <div className={s.avatar}>
              <span className={s.label}>{initials}</span>
            </div>
          </div>
        </PopoverTrigger>
        <ProfilePopover />
      </Popover>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={s.profile}>
          <div className={s.avatar}>
            <span className={s.label}>?</span>
          </div>
        </div>
      </PopoverTrigger>
      <ProfilePopover />
    </Popover>
  )
}

function ProfileName({ name, email }: { name?: string | null; email?: string | null }) {
  if (!name && !email) return null
  return (
    <div className='hidden @min-[15rem]:flex flex-col text-xs'>
      {name ? <span>{name}</span> : null}
      {email ? <span className='text-(--r-text-secondary)'>{email}</span> : null}
    </div>
  )
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
