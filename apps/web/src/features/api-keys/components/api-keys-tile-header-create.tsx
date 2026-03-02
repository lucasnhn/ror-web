'use client'

import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { CreateApiKeyForm } from './create-api-key-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const ApiKeysTileHeaderCreate = () => {
  const router = useRouter()
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  return (
    <>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='r-heading-03'>API keys</h3>
        <Button onClick={() => setOpenCreate(true)}>
          <Plus /> Create new API key
        </Button>
      </div>
      {openCreate && (
        <>
          <hr />
          <CreateApiKeyForm
            onCreated={() => {
              router.refresh()
            }}
            onFinish={() => {
              setOpenCreate(false)
            }}
          />
        </>
      )}
    </>
  )
}
