import { auth } from "@/app/auth"

export async function Profile() {
  const session = await auth()

  if (!session?.user) return null
  if (session.user?.image && session.user.name) {
    return (
      <div>
        <img src={session.user.image} alt="User Avatar" />
      </div>
    )
  }

  const initials = session.user.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex shrink-0 items-center justify-center w-8 h-8 overflow-hidden bg-neutral-100 rounded-full dark:bg-neutral-600">
          <span className="text-xs text-neutral-800 dark:text-neutral-300">{initials}</span>
      </div>
      <div className="hidden @min-[15rem]:flex flex-col text-xs">
        <span>{session.user.name}</span>
        <span className="text-(--r-text-secondary)">{session.user.email}</span>
      </div>
    </div>
  )
}
