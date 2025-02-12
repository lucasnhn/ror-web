import { signOut } from '@/app/auth'
import { Button } from '@ror/react/components/button'

export function SignOutButton() {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button type='submit' variant='secondary' size='small'>
        Sign out
      </Button>
    </form>
  )
}
